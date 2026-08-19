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

  // Block CN/SG at the edge, but never lock out /admin (in case you're
  // legitimately accessing it from one of those countries).
  if (!pathname.startsWith("/admin")) {
    const country = getCountry(request);
    if (country && BLOCKED_COUNTRIES.has(country)) {
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
  }

  const response = NextResponse.next();

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
