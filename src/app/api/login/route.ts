import { NextRequest, NextResponse } from "next/server";

// Sets httpOnly session cookies for a regular (non-admin) user after a
// successful /api/login call to the Go backend. Deliberately does NOT set
// admin_session - that cookie is what middleware.ts uses to gate /admin/*,
// and a public sign-in must never grant access to the admin panel.
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, refresh_token } = body;

    if (!token) {
      return NextResponse.json(
        { message: "Token is required" },
        { status: 400 },
      );
    }

    const isProduction = process.env.NODE_ENV === "production";

    const response = NextResponse.json(
      { message: "Login successful", success: true },
      { status: 200 },
    );

    response.cookies.set({
      name: "accessToken",
      value: token,
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      maxAge: 24 * 60 * 60,
      path: "/",
    });

    if (refresh_token) {
      response.cookies.set({
        name: "refreshToken",
        value: refresh_token,
        httpOnly: true,
        secure: isProduction,
        sameSite: "lax",
        maxAge: 30 * 24 * 60 * 60,
        path: "/",
      });
    }

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "An error occurred during login", success: false },
      { status: 500 },
    );
  }
}
