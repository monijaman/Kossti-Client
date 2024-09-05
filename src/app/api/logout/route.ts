import { NextRequest, NextResponse } from "next/server";

// Get the API URL from environment variables
const apiUrl = process.env.NEXT_PUBLIC_API_URL as string;

export const dynamic = "force-dynamic"; // Force the route to be dynamic

export async function GET(req: NextRequest) {
  try {
    const responseApi = await fetch(`${apiUrl}/api/logout`);
    const resApiJson = await responseApi.json(); // Make sure to await the response

    const response = NextResponse.json(resApiJson);
    response.cookies.delete('accessToken');
    response.cookies.delete('refreshToken');
    return response;
  } catch (error) {
    return NextResponse.json({ error: "Failed to logout" }, { status: 500 });
  }
}
