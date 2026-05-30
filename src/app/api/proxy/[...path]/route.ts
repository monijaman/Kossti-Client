import { NextRequest, NextResponse } from "next/server";

// Read API_URL at runtime (server-side only, no NEXT_PUBLIC_ prefix needed)
const BACKEND_URL =
  process.env.API_URL || "https://gocritserver-production.up.railway.app";

const SKIP_HEADERS = new Set([
  "host",
  "connection",
  "transfer-encoding",
  "keep-alive",
  "te",
  "trailers",
  "upgrade",
]);

async function proxyRequest(
  req: NextRequest,
  path: string[]
): Promise<NextResponse> {
  const targetPath = path.join("/");
  const search = req.nextUrl.search;
  const targetUrl = `${BACKEND_URL}/${targetPath}${search}`;

  // Forward safe headers only
  const headers = new Headers();
  req.headers.forEach((value, key) => {
    if (!SKIP_HEADERS.has(key.toLowerCase())) {
      headers.set(key, value);
    }
  });

  const hasBody = req.method !== "GET" && req.method !== "HEAD";
  const body = hasBody ? await req.arrayBuffer() : undefined;

  let response: Response;
  try {
    response = await fetch(targetUrl, {
      method: req.method,
      headers,
      body: body ? Buffer.from(body) : undefined,
    });
  } catch (err) {
    console.error("[proxy] Backend unreachable:", targetUrl, err);
    return NextResponse.json(
      { success: false, error: "Backend service unreachable" },
      { status: 502 }
    );
  }

  const resBody = await response.arrayBuffer();

  const resHeaders = new Headers();
  response.headers.forEach((value, key) => {
    if (!SKIP_HEADERS.has(key.toLowerCase())) {
      resHeaders.set(key, value);
    }
  });

  return new NextResponse(resBody, {
    status: response.status,
    headers: resHeaders,
  });
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return proxyRequest(req, (await params).path);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return proxyRequest(req, (await params).path);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return proxyRequest(req, (await params).path);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return proxyRequest(req, (await params).path);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return proxyRequest(req, (await params).path);
}
