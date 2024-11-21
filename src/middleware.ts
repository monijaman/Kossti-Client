import { country } from "@/lib/types";
import { checkToken } from "@/lib/utils"; // Adjust the import path as needed
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
const apiUrl = process.env.NEXT_PUBLIC_API_URL as string;
const PUBLIC_FILE = /\.(.*)$/;

function internationalization(req: NextRequest, res: NextResponse) {
  // List of supported locales (as defined in next.config.js)
  const supportedLocales = ["en", "bn", "fr"];
  const defaultLocale = "en"; // Your default locale

  // Skip Next.js internal routes, API routes, and public files
  if (
    req.nextUrl.pathname.startsWith("/_next") ||
    req.nextUrl.pathname.includes("/api/") ||
    PUBLIC_FILE.test(req.nextUrl.pathname)
  ) {
    return null; // No redirect if internal or public file
  }
  // Extract the locale from cookies, Accept-Language, or use the default
  const cookieLocale = req.cookies.get("country-code")?.value;
  const browserLocale = req.headers
    .get("accept-language")
    ?.split(",")[0]
    ?.split("-")[0];

  let detectedLocale: string;

  // Check if the locale is available in the cookies and is supported
  if (cookieLocale && supportedLocales.includes(cookieLocale)) {
    detectedLocale = cookieLocale;
  }
  // Otherwise, check if the browser's locale is supported
  else if (browserLocale && supportedLocales.includes(browserLocale)) {
    detectedLocale = browserLocale;
  }
  // Fallback to the default locale
  else {
    detectedLocale = defaultLocale;
  }

  // res.cookies.set("country-code", detectedLocale, {
  //   httpOnly: false,
  // });

  console.log("detectedLocale: = ", detectedLocale);

  // Check if the path already has a locale prefix
  const pathnameParts = req.nextUrl.pathname.split("/");
  const currentLocale = pathnameParts[1];

  // If the locale prefix is missing or incorrect, return the correct redirect URL
  if (currentLocale !== detectedLocale) {
    const redirectUrl = `${detectedLocale}${
      req.nextUrl.pathname === "/" ? "" : req.nextUrl.pathname
    }`;
    return redirectUrl; // Return the correct redirect URL
  }

  // Return null if no redirection is needed
  return null;
}

// Function to handle IP Address extraction and setting
async function handleIpAddress(request: NextRequest, response: NextResponse) {
  const ip = (
    request.headers.get("x-forwarded-for") ||
    request.headers.get("remoteAddress") ||
    "127.0.0.1"
  )
    .split(",")[0]
    .trim();

  // Replace "::1" with "127.0.0.1" for localhost consistency
  const clientIp = ip === "::1" ? "103.42.52.79" : ip;

  response.cookies.set("user-ip", clientIp, { httpOnly: false });

  try {
    // Fetch country code based on IP
    const fetchResponse = await fetch(`http://ip-api.com/json/${clientIp}`);
    if (fetchResponse.ok) {
      const data: country = await fetchResponse.json();
      let ccode = data.countryCode;
      // if (data.countryCode == "BD") {
      //   ccode = "bn";
      // }

      response.cookies.set("country-code", ccode, {
        httpOnly: false,
      });

      return data.countryCode;
    } else {
      console.error("Failed to fetch country information.");
    }
  } catch (error) {
    console.error("Error fetching country information:", error);
  }

  return null; // Return null if country code was not retrieved
}

// Function to handle token checking and redirection
async function handleTokenAndRedirect(
  request: NextRequest,
  response: NextResponse
) {
  const token = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  const tokenStatus = await checkToken(token, apiUrl, refreshToken);
  const { isValidToken, accessToken } = tokenStatus;

  console.log("------------------------------", request.nextUrl.locale);
  // console.log("accessToken:", token);
  // console.log("Token Status:", tokenStatus);
  // console.log("Request URL:", request.nextUrl.href);
  // console.log("Is Valid Token:", isValidToken);
  // console.log("Access Token:", accessToken);
  // console.log("Pathname:", request.nextUrl.pathname);

  // Redirect to signin if token is invalid and clear cookies
  if (token && !isValidToken) {
    const redirectResponse = NextResponse.redirect(
      new URL("/signin", request.url)
    );
    redirectResponse.cookies.set("accessToken", "", { expires: new Date(0) });
    redirectResponse.cookies.set("refreshToken", "", { expires: new Date(0) });
    redirectResponse.cookies.set("XSRF-TOKEN", "", { expires: new Date(0) });
    return redirectResponse;
  }

  // If token is valid and a new access token is provided, set it and redirect
  if (isValidToken && accessToken) {
    response.cookies.set("accessToken", accessToken);
    return response;
  }

  // Redirect to admin if signed in and trying to access signin
  if (token && isValidToken && request.nextUrl.pathname.startsWith("/signin")) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  // Redirect to signin if trying to access protected routes without a token
  if (
    !token &&
    !request.nextUrl.pathname.startsWith("/signin") &&
    !request.nextUrl.pathname.startsWith("/signup")
  ) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  // Redirect to admin if accessing signup with a valid token
  if (token && request.nextUrl.pathname.startsWith("/signup")) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

// Main middleware function
export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Only call handleTokenAndRedirect for specified routes
  const pathname = request.nextUrl.pathname;
  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/signin") ||
    pathname.startsWith("/signup")
  ) {
    return await handleTokenAndRedirect(request, response);
  } else if (!request.cookies.get("country-code")) {
    const redirectUrl = internationalization(request, response);

    if (redirectUrl) {
      response.cookies.set("country-code", redirectUrl, {
        httpOnly: false,
      });

      //   return NextResponse.redirect(new URL(redirectUrl, request.url));
    }
    // return NextResponse.redirect(new URL(redirectUrl, request.url));
  } else {
    const redirectUrl = await handleIpAddress(request, response);
    if (redirectUrl) {
      //  return NextResponse.redirect(new URL(redirectUrl, request.url));
    }
  }

  // Continue to next response if no further handling is needed
  return response;
}

// Middleware configuration to apply to all routes
export const config = {
  matcher: "/:path*",
  // matcher: ["/admin/:path*", "/signin/:path*", "/signup/:path*", "/:path*"],
};
