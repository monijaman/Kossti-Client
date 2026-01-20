import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const response = NextResponse.json(
    { message: "Logout successful" },
    { status: 200 },
  );

  // Clear the admin session cookie
  response.cookies.set({
    name: "admin_session",
    value: "",
    httpOnly: true,
    maxAge: 0,
    path: "/",
    secure: false,
  });

  // Clear access token
  response.cookies.set({
    name: "accessToken",
    value: "",
    httpOnly: true,
    maxAge: 0,
    path: "/",
    secure: false,
  });

  // Clear refresh token
  response.cookies.set({
    name: "refreshToken",
    value: "",
    httpOnly: true,
    maxAge: 0,
    path: "/",
    secure: false,
  });

  return response;
}
