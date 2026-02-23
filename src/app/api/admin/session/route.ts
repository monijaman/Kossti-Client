import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const adminSession = request.cookies.get("admin_session")?.value;
    const accessToken = request.cookies.get("accessToken")?.value;

    console.log("Session check:", {
      adminSession: adminSession ? "EXISTS" : "MISSING",
      accessToken: accessToken ? "EXISTS" : "MISSING",
      userAgent: request.headers.get("user-agent"),
    });

    // Check if the session cookie exists and is not empty
    if (adminSession && adminSession.trim() !== "" && accessToken) {
      return NextResponse.json(
        {
          message: "Authenticated",
          session: adminSession.substring(0, 20) + "...", // Log partial session for debugging
        },
        { status: 200 },
      );
    }

    return NextResponse.json(
      {
        message: "Not authenticated",
        reason: !adminSession ? "No admin session" : "No access token",
      },
      { status: 401 },
    );
  } catch (err) {
    console.error("Session check error:", err);
    return NextResponse.json({ message: "Error", error: err }, { status: 500 });
  }
}
