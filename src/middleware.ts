import { DEFAULT_LOCALE, LOCALES } from "@/lib/constants";
import { country } from "@/lib/types";
import { checkToken } from "@/lib/utils"; // Adjust the import path as needed
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
const apiUrl = process.env.NEXT_PUBLIC_API_URL as string;
const PUBLIC_FILE = /\.(.*)$/;

function internationalization(req: NextRequest, res: NextResponse) {
  // List of supported locales

  // Skip Next.js internal routes, API routes, and public files
  if (
    req.nextUrl.pathname.startsWith("/_next") ||
    req.nextUrl.pathname.includes("/api/") ||
    PUBLIC_FILE.test(req.nextUrl.pathname)
  ) {
    return null; // No redirect if internal or public file
  }

  // Extract the locale from cookies or headers
  const cookieLocale = req.cookies.get("country-code")?.value;
  const browserLocale = req.headers
    .get("accept-language")
    ?.split(",")[0]
    ?.split("-")[0];

  let detectedLocale: string;

  // Determine the detected locale
  if (cookieLocale && LOCALES.includes(cookieLocale)) {
    detectedLocale = cookieLocale;
  } else if (browserLocale && LOCALES.includes(browserLocale)) {
    detectedLocale = browserLocale;
  } else {
    detectedLocale = DEFAULT_LOCALE;
  }

  // Update the cookie with the detected locale
  res.cookies.set("country-code", detectedLocale, {
    httpOnly: false,
  });

  // Check if the URL already has a valid locale prefix
  const pathnameParts = req.nextUrl.pathname.split("/");
  const currentLocale = pathnameParts[1];

  if (LOCALES.includes(currentLocale)) {
    // If the locale in the path matches the detected locale, do nothing
    if (currentLocale === detectedLocale) {
      return null; // No redirection needed
    }

    // If the locale in the path differs, update the cookie but avoid redirect
    res.cookies.set("country-code", currentLocale, {
      httpOnly: false,
    });
    return null; // No redirection needed
  }

  // Redirect to the correct locale if no valid locale is present in the path
  const redirectUrl = `/${detectedLocale}${
    req.nextUrl.pathname === "/" ? "" : req.nextUrl.pathname
  }`;
  return redirectUrl; // Return the correct redirect URL
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
  const token = request.cookies.get("cccessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  const tokenStatus = await checkToken(token, apiUrl, refreshToken);
  const { isValidToken, accessToken } = tokenStatus;

  // console.log("accessToken:", token);
  // console.log("Token Status:", tokenStatus);
  // console.log("Request URL:", request.nextUrl.href);
  // console.log("Is Valid Token:", isValidToken);
  // console.log("Access Token:", accessToken);
  // console.log("Pathname:", request.nextUrl.pathname);

  // Redirect to signin if token is invalid and clear cookies
  if (!token) {
    const redirectResponse = NextResponse.redirect(
      new URL("/signin", request.url)
    );
    // redirectResponse.cookies.set("accessToken", "", { expires: new Date(0) });
    // redirectResponse.cookies.set("refreshToken", "", { expires: new Date(0) });
    // redirectResponse.cookies.set("XSRF-TOKEN", "", { expires: new Date(0) });
    return redirectResponse;
  }

  // Redirect to admin if signed in and trying to access signin
  // if (token && isValidToken && request.nextUrl.pathname.startsWith("/signin")) {
  //   return NextResponse.redirect(new URL("/admin", request.url));
  // }

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
      // response.cookies.set("country-code", redirectUrl, {
      //   httpOnly: false,
      // });

      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }
    // return NextResponse.redirect(new URL(redirectUrl, request.url));
  } else if (request.cookies.get("country-code")) {
    // Get the current pathname
    const pathname = request.nextUrl.pathname;

    // Get the 'country-code' cookie value
    const countryCodeCookie = request.cookies.get("country-code");
    const countryCode = countryCodeCookie?.value;

    // Check if the pathname already includes a valid locale
    const firstPathSegment = pathname.split("/")[1]; // Extract the first segment
    // If the first path segment is a valid locale and differs from the stored cookie value

    // Check if the first path segment is a valid locale
    if (firstPathSegment && LOCALES.includes(firstPathSegment)) {
      // If the locale in the URL matches the cookie, do nothing and continue
      if (firstPathSegment === countryCode) {
        return response; // No redirect needed, continue with the response
      }

      // If the locale in the URL is different from the cookie, update the cookie
      const url = new URL(request.url);
      url.pathname = `/${firstPathSegment}${pathname.substring(
        firstPathSegment.length + 1
      )}`;

      // Set the 'country-code' cookie with the new locale
      response.cookies.set("country-code", firstPathSegment, {
        httpOnly: false, // Make the cookie accessible from JavaScript
      });

      // Redirect to the updated URL with the new locale
    } else if (!firstPathSegment) {
      // If the country code cookie is available, prepend it to the URL
      if (countryCode && LOCALES.includes(countryCode)) {
        const url = new URL(request.url);
        url.pathname = `/${countryCode}${pathname}`; // Add the country-code as the first segment

        // Set the 'country-code' cookie with the new locale
        response.cookies.set("country-code", countryCode, {
          httpOnly: false, // Make the cookie accessible from JavaScript
        });

        return NextResponse.redirect(url); // Redirect to the URL with the new locale
      }

      // If no valid cookie is set, default to a supported locale (e.g., "en")
      const url = new URL(request.url);
      url.pathname = `/${DEFAULT_LOCALE}${pathname}`; // Prepend the default locale

      // Set the 'country-code' cookie with the default locale
      response.cookies.set("country-code", DEFAULT_LOCALE, {
        httpOnly: false,
      });

      return NextResponse.redirect(url); // Redirect to the default locale
    }

    // If no valid locale is found in the URL path, do nothing and continue
    return response;
  }

  // else {
  //   const redirectUrl = await handleIpAddress(request, response);
  //   if (redirectUrl) {
  //     return NextResponse.redirect(new URL(redirectUrl, request.url));
  //   }
  // }

  // Continue to next response if no further handling is needed
  return response;
}

// Middleware configuration to apply to all routes
export const config = {
  matcher: "/:path*",
  // matcher: ["/admin/:path*", "/signin/:path*", "/signup/:path*", "/:path*"],
};
