import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  // Clear all cookies by setting them with past expiration
  const response = NextResponse.json(
    {
      success: true,
      message: "Logged out successfully",
    },
    { status: 200 },
  );

  const pastDate = new Date(0).toUTCString();

  response.cookies.set({
    name: "admin_session",
    value: "",
    expires: new Date(0),
    path: "/",
    httpOnly: true,
    sameSite: "lax",
  });

  response.cookies.set({
    name: "accessToken",
    value: "",
    expires: new Date(0),
    path: "/",
    httpOnly: true,
    sameSite: "lax",
  });

  response.cookies.set({
    name: "refreshToken",
    value: "",
    expires: new Date(0),
    path: "/",
    httpOnly: true,
    sameSite: "lax",
  });

  return response;
}
