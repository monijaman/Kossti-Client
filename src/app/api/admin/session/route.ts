import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const adminSession = request.cookies.get("admin_session")?.value;

    // Check if the session cookie exists and is not empty
    if (adminSession && adminSession.trim() !== "") {
      return NextResponse.json({ message: "Authenticated" }, { status: 200 });
    }

    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  } catch (err) {
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}
