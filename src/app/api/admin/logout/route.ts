import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const response = NextResponse.redirect(new URL("/admin/login", request.url), {
    status: 302,
  });

  // Clear all cookies by setting them with past expiration
  const pastDate = new Date(0).toUTCString();

  response.headers.append(
    "Set-Cookie",
    "admin_session=; Path=/; Expires=" + pastDate + "; HttpOnly; SameSite=lax",
  );
  response.headers.append(
    "Set-Cookie",
    "accessToken=; Path=/; Expires=" + pastDate + "; HttpOnly; SameSite=lax",
  );
  response.headers.append(
    "Set-Cookie",
    "refreshToken=; Path=/; Expires=" + pastDate + "; HttpOnly; SameSite=lax",
  );

  return response;
}
