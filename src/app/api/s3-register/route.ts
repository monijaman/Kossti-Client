import { NextRequest, NextResponse } from "next/server";
import { getApiUrl } from "@/lib/apiUrl";

async function proxyRegister(req: NextRequest, apiUrl: string) {
  try {
    const body = await req.json();

    let accessToken = req.cookies.get("accessToken")?.value;
    if (!accessToken) {
      const authHeader = req.headers.get("authorization");
      if (authHeader && authHeader.startsWith("Bearer ")) {
        accessToken = authHeader.substring(7);
      }
    }

    const resp = await fetch(`${apiUrl}/productimages/s3`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
    });

    const json = await resp.json();
    return NextResponse.json(
      { success: resp.ok, data: json },
      { status: resp.status }
    );
  } catch (err) {
    return NextResponse.json(
      { success: false, error: (err as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const apiUrl = getApiUrl();
  return proxyRegister(req, apiUrl);
}
