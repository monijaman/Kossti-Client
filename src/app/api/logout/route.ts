import { NextRequest, NextResponse } from "next/server";
// Get the API URL from environment variables
const apiUrl = process.env.NEXT_PUBLIC_API_URL as string;


export async function GET(req: NextRequest) {
  const responseApi = await fetch(`${apiUrl}/api/logout`);
  const resApiJson = responseApi.json();

  const response = NextResponse.json(resApiJson);
  response.cookies.delete('accessToken');
  response.cookies.delete('refreshToken');
  return response;
};
