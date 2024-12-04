import { NextRequest, NextResponse } from "next/server";
const apiUrl = process.env.NEXT_PUBLIC_API_URL as string;

export const dynamic = "force-dynamic"; // Force the route to be dynamic

export async function POST(req: NextRequest) {
  try {
    // Get the access token from cookies
    const accessToken = req.cookies.get("accessToken")?.value;
    if (!accessToken) {
      return NextResponse.json(
        { error: "Access token not found" },
        { status: 401 }
      );
    }
    // Make a logout request to your API
    const apiResponse = await fetch(`${apiUrl}/api/v1/logout`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!apiResponse.ok) {
      return NextResponse.json(
        { error: "Failed to logout from API" },
        { status: apiResponse.status }
      );
    }

    // Delete the access token and refresh token cookies
    const response = NextResponse.json({ message: "Successfully logged out" });
    response.cookies.delete("theAccessToken");
    response.cookies.delete("theRefreshToken");

    return response;
  } catch (error) {
    console.error("Logout Error:", error);
    return NextResponse.json({ error: "Failed to logout" }, { status: 500 });
  }
}
