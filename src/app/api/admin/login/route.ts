import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, refresh_token, email } = body;

    // Validate input
    if (!token) {
      return NextResponse.json(
        { message: "Token is required" },
        { status: 400 },
      );
    }

    // Create response with session and token cookies
    const response = NextResponse.json(
      { message: "Login successful", email },
      { status: 200 },
    );

    // Set admin session cookie
    response.cookies.set({
      name: "admin_session",
      value: "authenticated_" + Date.now(),
      httpOnly: true,
      secure: false, // process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60, // 24 hours
      path: "/",
    });

    // Set access token cookie
    response.cookies.set({
      name: "accessToken",
      value: token,
      httpOnly: true,
      secure: false, // process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60,
      path: "/",
    });

    // Set refresh token cookie
    if (refresh_token) {
      response.cookies.set({
        name: "refreshToken",
        value: refresh_token,
        httpOnly: true,
        secure: false, // process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 30 * 24 * 60 * 60, // 30 days
        path: "/",
      });
    }

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "An error occurred during login" },
      { status: 500 },
    );
  }
}
