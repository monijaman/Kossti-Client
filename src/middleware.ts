import { DEFAULT_LOCALE, LOCALES } from "@/lib/constants";
import { gettokenbyrefreshToken } from "@/lib/utils"; // Adjust the import path as needed
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
const PUBLIC_FILE = /\.(.*)$/;

// Function to check admin session
function checkAdminSession(req: NextRequest): boolean {
  const adminSession = req.cookies.get("admin_session")?.value;
  console.log(
    `[Middleware Check] Path: ${req.nextUrl.pathname}, admin_session: ${adminSession ? "FOUND" : "MISSING"}`,
  );
  return !!adminSession;
}

function internationalization(req: NextRequest, res: NextResponse) {
  // Skip Next.js internal routes, API routes, and public files.
  if (
    req.nextUrl.pathname.startsWith("/_next") ||
    req.nextUrl.pathname.includes("/api/") ||
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

  // Only redirect to default locale if it's the root path
  if (req.nextUrl.pathname === "/") {
    return `/${DEFAULT_LOCALE}`;
  }

  // For other paths without locale, prepend default locale
  return `/${DEFAULT_LOCALE}${req.nextUrl.pathname}`;
}

// Function to handle token checking and redirection
async function handleTokenAndRedirect(
  request: NextRequest,
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

  if (
    token &&
    (request.nextUrl.pathname.startsWith("/signin") ||
      request.nextUrl.pathname.startsWith("/signup"))
  ) {
    console.log("User already signed in, redirecting to admin...");
    return NextResponse.redirect(new URL("/admin", request.url));
  } else if (!token) {
    console.log("No token, redirecting to signin...");
    // return NextResponse.redirect(new URL("/signin", request.url));
  }

  // Allow access to other routes
  return NextResponse.next();
}

// Main middleware function
export async function middleware(request: NextRequest) {
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

  // Only call handleTokenAndRedirect for specified routes
  const pathname = request.nextUrl.pathname;

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
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
