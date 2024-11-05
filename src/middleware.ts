import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

interface tokenStatus {
  isValidToken: boolean;
  accessToken: string;
}

// interface tokenStat =
import { checkToken } from "@/lib/utils"; // adjust the import path as needed
const apiUrl = process.env.NEXT_PUBLIC_API_URL as string;

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;
  const tokenStatus = await checkToken(token, apiUrl, refreshToken);

  const { isValidToken, accessToken } = tokenStatus;

  console.log("accessToken :", token);
  console.log("Token Status:", tokenStatus);
  console.log("Request URL:", request.nextUrl.href);
  console.log("Is Valid Token:", isValidToken);
  console.log("Access Token:", accessToken);
  console.log("Pathname:", request.nextUrl.pathname);
  console.log(
    "Ends with /dashboard:",
    request.nextUrl.pathname.endsWith("/admin")
  );

  // Redirect to signin if token is invalid and clear cookies
  if (token && !isValidToken) {
    const response = NextResponse.redirect(new URL("/signin", request.url));
    response.cookies.set("accessToken", "", { expires: new Date(0) });
    response.cookies.set("refreshToken", "", { expires: new Date(0) });
    response.cookies.set("XSRF-TOKEN", "", { expires: new Date(0) });
    return response;
  }

  //  if token is valid and get a new acces token
  if (isValidToken && accessToken) {
    const response = NextResponse.redirect(new URL("/admin", request.url));
    response.cookies.set("accessToken", accessToken);
    return response;
  }

  // Redirect to dashboard if token is valid
  if (token && isValidToken && request.nextUrl.pathname.startsWith("/signin")) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  // Redirect to signin if no token and accessing protected routes
  if (
    !token &&
    !request.nextUrl.pathname.startsWith("/signin") &&
    !request.nextUrl.pathname.startsWith("/signup")
  ) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  // Redirect to dashboard if accessing signup with a valid token
  if (token && request.nextUrl.pathname.startsWith("/signup")) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  // Continue to the requested page if none of the above conditions are met
  return NextResponse.next();
}

// export const config = {
//   matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
// }

export const config = {
  // Define the routes to apply the middleware
  matcher: ["/admin/:path*", "/signin/:path*", "/signup/:path*"],
};
