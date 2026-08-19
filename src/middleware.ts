import { LOCALES } from "@/lib/constants";
import { gettokenbyrefreshToken } from "@/lib/utils"; // Adjust the import path as needed
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// Extend NextRequest to include geo property
interface RequestWithGeo extends NextRequest {
  geo?: {
    country?: string;
    region?: string;
    city?: string;
    latitude?: string;
    longitude?: string;
  };
}

const PUBLIC_FILE = /\.(.*)$/;

// --- Lightweight per-IP rate limiting -------------------------------------
// Best-effort, in-memory limiter scoped to this middleware instance. It
// protects the data channel scrapers actually want (/api/proxy, which
// forwards to the Go backend) and the admin login endpoint (brute force),
// as a first line of defense in front of the backend's own rate limiter.
// Note: on multi-instance/edge deployments each instance keeps its own
// counters, so this is a deterrent, not a hard guarantee - pair it with
// the backend limiter and/or edge-level bot protection (e.g. Cloudflare).
type RateBucket = { count: number; resetAt: number };
const rateBuckets = new Map<string, RateBucket>();

function isRateLimited(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const bucket = rateBuckets.get(key);

  if (!bucket || now > bucket.resetAt) {
    rateBuckets.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }

  bucket.count += 1;
  return bucket.count > limit;
}

function getClientIp(req: NextRequest): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "unknown";
}

// --- Honeypot trap -----------------------------------------------------
// A link at this path is rendered hidden (visually-hidden, aria-hidden,
// unreachable by tab/mouse) in the root layout. No real visitor can ever
// follow it - only a bot parsing the raw DOM for every <a href> will. Any
// IP that requests it gets provisionally blocked site-wide. In-memory and
// per-instance like the rate limiter above, so it's a deterrent, not a
// guarantee.
const HONEYPOT_PATH = "/products-full-export";
const TRAP_TTL_MS = 24 * 60 * 60_000;
const trappedIps = new Map<string, number>();

function isTrapped(ip: string): boolean {
  const expiresAt = trappedIps.get(ip);
  if (!expiresAt) return false;
  if (Date.now() > expiresAt) {
    trappedIps.delete(ip);
    return false;
  }
  return true;
}

function trapIp(ip: string): void {
  trappedIps.set(ip, Date.now() + TRAP_TTL_MS);
}

// --- Known-scraper User-Agent blocklist ---------------------------------
// Default UA strings of common HTTP/scraping libraries. Real browsers
// never send these, so false positives on human traffic are effectively
// zero. A missing User-Agent header is also treated as suspicious since
// every real browser sends one.
const SCRAPER_UA_PATTERNS = [
  /python-requests/i,
  /python-urllib/i,
  /\bscrapy\b/i,
  /\bcurl\//i,
  /\bwget\b/i,
  /go-http-client/i,
  /okhttp/i,
  /libwww-perl/i,
  /phantomjs/i,
  /node-fetch/i,
  /^axios\//i,
  /postmanruntime/i,
  /apache-httpclient/i,
];

function isKnownScraperUA(userAgent: string | null): boolean {
  if (!userAgent) return true;
  return SCRAPER_UA_PATTERNS.some((pattern) => pattern.test(userAgent));
}

// --- Session-bound API access --------------------------------------------
// /api/proxy only responds if the caller is carrying a short-lived token
// that this middleware itself minted while serving a normal page. A
// scraper hitting /api/proxy directly - skipping the page load entirely,
// the most common lazy-scraper pattern - never has the token and gets
// rejected. A scraper that first loads a page in a real browser/session
// (cookie jar) still gets through; this stops naive direct-API scraping,
// not sophisticated bot sessions.
const VISIT_TOKEN_COOKIE = "kst_vt";
const VISIT_TOKEN_TTL_MS = 30 * 60_000;
const VISIT_TOKEN_SECRET = process.env.VISIT_TOKEN_SECRET;

if (!VISIT_TOKEN_SECRET) {
  console.warn(
    "[middleware] VISIT_TOKEN_SECRET is not set - using an insecure dev default. Set it in the deployment's env vars.",
  );
}

async function signVisitToken(timestamp: number): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(VISIT_TOKEN_SECRET || "dev-only-visit-token-secret"),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sigBuf = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(String(timestamp)));
  return Array.from(new Uint8Array(sigBuf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function issueVisitToken(): Promise<string> {
  const ts = Date.now();
  return `${ts}.${await signVisitToken(ts)}`;
}

async function isValidVisitToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  const [tsStr, sig] = token.split(".");
  const ts = Number(tsStr);
  if (!ts || !sig) return false;
  if (Date.now() - ts > VISIT_TOKEN_TTL_MS) return false;
  return sig === (await signVisitToken(ts));
}

// --- Country-level blocking -------------------------------------------------
// Aug 2026: GA4 showed a bot-shaped traffic spike (near-vertical, single
// browser) originating almost entirely from China and Singapore. Blocking
// those two countries at the edge here rather than relying on GA (which
// only reports traffic, it doesn't stop it).
const BLOCKED_COUNTRIES = new Set(["CN", "SG"]);

function getCountry(req: RequestWithGeo): string | undefined {
  const country =
    req.geo?.country ||
    req.headers.get("x-vercel-ip-country") ||
    req.headers.get("cf-ipcountry") ||
    undefined;
  return country?.toUpperCase();
}

// Function to check admin session
function checkAdminSession(req: RequestWithGeo): boolean {
  const adminSession = req.cookies.get("admin_session")?.value;
  const accessToken = req.cookies.get("accessToken")?.value;

  console.log(
    `[Middleware Check] Path: ${req.nextUrl.pathname}`,
    `admin_session: ${adminSession ? "FOUND" : "MISSING"}`,
    `accessToken: ${accessToken ? "FOUND" : "MISSING"}`,
    `User-Agent: ${req.headers.get("user-agent")?.substring(0, 50)}...`,
  );

  // Require both admin session and access token for admin routes
  return !!(adminSession && accessToken);
}

function getPreferredLocale(req: RequestWithGeo): string {
  // First check if user has a locale preference cookie (check multiple possible names)
  const localePreference =
    req.cookies.get("locale-preference")?.value ||
    req.cookies.get("country-code")?.value ||
    req.cookies.get("locale")?.value;

  if (localePreference && LOCALES.includes(localePreference)) {
    console.log("Found locale preference in cookies:", localePreference);
    return localePreference;
  }

  // Check if user's country is Bangladesh based on various indicators
  const country =
    req.geo?.country ||
    req.headers.get("cf-ipcountry") ||
    req.headers.get("x-vercel-ip-country") ||
    req.headers.get("x-forwarded-for") ||
    "";
  const acceptLanguage = req.headers.get("accept-language") || "";

  // Log for debugging (remove in production)
  console.log("Country detection:", {
    country,
    acceptLanguage,
    geo: req.geo,
    cfCountry: req.headers.get("cf-ipcountry"),
  });

  // If user is from Bangladesh, default to Bangla
  if (
    country?.toLowerCase() === "bd" ||
    country?.toLowerCase() === "bangladesh" ||
    acceptLanguage.includes("bn")
  ) {
    console.log("User detected from Bangladesh, using Bengali locale");
    return "bn";
  }

  // Smart default: Use English for users outside Bangladesh
  console.log("User detected outside Bangladesh, using English locale");
  return "en";
}

function internationalization(req: RequestWithGeo, res: NextResponse) {
  // Skip Next.js internal routes, API routes, and public files.
  if (
    req.nextUrl.pathname.startsWith("/_next") ||
    req.nextUrl.pathname.includes("/api/") ||
    req.nextUrl.pathname.startsWith("/sentry-example-page") ||
    PUBLIC_FILE.test(req.nextUrl.pathname)
  ) {
    return null; // No redirect if internal or public file
  }

  // Extract the locale from the pathname
  const pathnameParts = req.nextUrl.pathname.split("/");
  const currentLocale = pathnameParts[1];

  // If the path already has a valid locale, don't redirect
  if (LOCALES.includes(currentLocale)) {
    return null;
  }

  // Get preferred locale based on user location
  const preferredLocale = getPreferredLocale(req);

  // Public legacy article URLs without a locale are English by definition.
  // Do not let a Bengali preference cookie change their feedback language.
  if (req.nextUrl.pathname === "/sales-and-culture") {
    return "/en/sales-and-culture";
  }

  // Only redirect to preferred locale if it's the root path
  if (req.nextUrl.pathname === "/") {
    return `/${preferredLocale}`;
  }

  // For other paths without locale, prepend preferred locale
  return `/${preferredLocale}${req.nextUrl.pathname}`;
}

// Function to handle token checking and redirection
async function handleTokenAndRedirect(
  request: RequestWithGeo,
  response: NextResponse,
  refToken?: string,
) {
  const token = request.cookies.get("accessToken")?.value;

  if (refToken) {
    return NextResponse.redirect(new URL("/redirect", request.url));
  }

  // Redirect to signin if trying to access protected routes without a token
  if (!token && request.nextUrl.pathname.startsWith("/signin")) {
    // Allow access to the signin page without redirection
    return NextResponse.next();
  }

  if (!token) {
    console.log("No token, redirecting to signin...");
    // return NextResponse.redirect(new URL("/signin", request.url));
  }

  // Allow access to other routes
  return NextResponse.next();
}

// Main middleware function
export async function middleware(request: RequestWithGeo) {
  const pathname = request.nextUrl.pathname;
  const clientIp = getClientIp(request);
  // /admin pages AND the admin API routes are exempt from the blocks below,
  // so you never lock yourself out of the dashboard or its login call.
  const isAdminPath = pathname.startsWith("/admin") || pathname.startsWith("/api/admin");

  // Honeypot: tripping it blocks the IP outright. Respond as an ordinary
  // 404 so a bot doesn't learn it was caught.
  if (pathname === HONEYPOT_PATH) {
    trapIp(clientIp);
    return new NextResponse("Not Found", { status: 404 });
  }

  if (!isAdminPath) {
    if (isTrapped(clientIp)) {
      return new NextResponse("Blocked", { status: 403 });
    }

    const country = getCountry(request);
    if (country && BLOCKED_COUNTRIES.has(country)) {
      return new NextResponse("Blocked", { status: 403 });
    }

    if (isKnownScraperUA(request.headers.get("user-agent"))) {
      return new NextResponse("Blocked", { status: 403 });
    }
  }

  if (pathname.startsWith("/api/admin/login")) {
    if (isRateLimited(`login:${clientIp}`, 10, 5 * 60_000)) {
      return NextResponse.json(
        { error: "Too many login attempts. Please try again later." },
        { status: 429, headers: { "Retry-After": "300" } },
      );
    }
  } else if (pathname.startsWith("/api/proxy")) {
    if (isRateLimited(`proxy:${clientIp}`, 200, 60_000)) {
      return NextResponse.json(
        { error: "Too many requests. Please slow down." },
        { status: 429, headers: { "Retry-After": "60" } },
      );
    }

    if (!(await isValidVisitToken(request.cookies.get(VISIT_TOKEN_COOKIE)?.value))) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  const response = NextResponse.next();

  // Mint/refresh the visit token on every page response (not on API
  // routes themselves) so a browser that just loaded a page can call
  // /api/proxy immediately after.
  if (!pathname.startsWith("/api/")) {
    response.cookies.set(VISIT_TOKEN_COOKIE, await issueVisitToken(), {
      httpOnly: true,
      sameSite: "lax",
      maxAge: Math.floor(VISIT_TOKEN_TTL_MS / 1000),
      path: "/",
    });
  }

  const token = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;
  let refToken = undefined;
  if (!token && refreshToken) {
    try {
      refToken = await gettokenbyrefreshToken(refreshToken);

      if (refToken) {
        response.cookies.set("accessToken", refToken, {
          httpOnly: true,
          maxAge: 24 * 60 * 60, // 1 day
          path: "/", // Ensure cookie is accessible site-wide
        });
        // Construct absolute URL for the redirect
      }
    } catch (error) {
      console.error("Error while fetching token using refreshToken:", error);
    }
  }

  // Only call handleTokenAndRedirect for specified routes (pathname declared above)

  // Protect admin routes - require session
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    if (!checkAdminSession(request)) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
  }

  // Redirect /admin to /admin/dashboard (only if user is authenticated)
  if (pathname === "/admin") {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/dashboard";
    return NextResponse.redirect(url);
  }

  // If user is logged in and tries to access login page, redirect to dashboard
  if (pathname === "/admin/login") {
    if (checkAdminSession(request)) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/dashboard";
      return NextResponse.redirect(url);
    }
  }

  // Skip internationalization for admin routes - keep them in English only
  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/signin") ||
    pathname.startsWith("/signup")
  ) {
    return await handleTokenAndRedirect(request, response, refToken);
  }

  // Apply internationalization only to non-admin routes
  const redirectUrl = internationalization(request, response);
  if (redirectUrl) {
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }

  return response;
}

// Middleware configuration to apply to all routes except admin
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - admin (admin routes - no internationalization)
     */
    "/((?!api|_next|favicon.ico|.*\\.).*)",
    // Also run (rate-limit check only, see early-return above) on the
    // backend data proxy and admin login, which are otherwise excluded above.
    "/api/proxy/:path*",
    "/api/admin/login",
  ],
};
