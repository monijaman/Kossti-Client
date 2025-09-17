import { NextRequest, NextResponse } from "next/server";

async function handlePostRequest(req: NextRequest, apiUrl: string) {
  try {
    // Check if the request has a valid content type
    const contentType = req.headers.get("content-type") || "";

    if (!contentType.includes("multipart/form-data")) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid content type",
        },
        { status: 400 }
      );
    }

    // Get the access token from cookies or Authorization header
    let accessToken = req.cookies.get("accessToken")?.value;

    // Fallback to Authorization header if cookie is not present
    if (!accessToken) {
      const authHeader = req.headers.get("authorization");
      if (authHeader && authHeader.startsWith("Bearer ")) {
        accessToken = authHeader.substring(7);
      }
    }

    // Check for missing access token
    if (!accessToken) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing access token. Please log in.",
        },
        { status: 401 }
      );
    }

    // Convert the request body to FormData
    const formData = await req.formData();
    const endApiUrl = formData.get("apiUrl") as string;

    // Handle missing API endpoint in form data
    if (!endApiUrl) {
      return NextResponse.json(
        {
          success: false,
          error: "API URL not provided in form data",
        },
        { status: 400 }
      );
    }

    // Log formData for debugging (only in development)
    if (process.env.NODE_ENV === "development") {
      formData.forEach((value, key) =>
        console.log(
          `${key}: ${value instanceof File ? `File: ${value.name}` : value}`
        )
      );
    }

    // Send a POST request to the Go server API endpoint
    const response = await fetch(`${apiUrl}/api/v1${endApiUrl}`, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        // Don't set Content-Type header - fetch will set it automatically with boundary for multipart
      },
    });

    // Parse the JSON response from the API
    const resJson = await response.json();

    // Check if the request was successful
    if (response.ok) {
      return NextResponse.json({
        success: true,
        data: resJson,
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: resJson.error || "Unknown error",
        },
        { status: response.status }
      );
    }
  } catch (error: unknown) {
    // Handle general errors during the request
    const errorMessage =
      error instanceof Error ? error.message : "Unknown server error";
    console.error("Error during multipart POST request:", error);
    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}

// Define the POST request handler for the API route
export async function POST(req: NextRequest) {
  try {
    // Get the API URL from environment variables
    const apiUrl = process.env.NEXT_PUBLIC_API_URL as string;

    // Check for missing API URL in environment variables
    if (!apiUrl) {
      throw new Error("API URL is not defined in environment variables");
    }

    // Call the common POST request handler function
    return handlePostRequest(req, apiUrl);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown server error";
    console.error("Error in multipart API route:", error);
    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
