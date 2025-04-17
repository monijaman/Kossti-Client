import { NextRequest, NextResponse } from "next/server";

// Define a function to handle common DELETE requests
async function handleDeleteRequest(req: NextRequest, apiUrl: string) {
  try {
    // Parse the request body as JSON (only if needed)
    const body = await req.json();

    // Get the access token from cookies
    const accessToken = req.cookies.get("accessToken")?.value;

    if (!accessToken) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized. No access token found.",
        },
        { status: 401 }
      );
    }

    // Send a DELETE request to the API endpoint
    const response = await fetch(`${apiUrl}/api/${body.apiUrl}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // Check if the request was successful
    if (response.ok) {
      return NextResponse.json({
        success: true,
        message: "Resource deleted successfully.",
      });
    } else {
      // Parse the JSON error response from the API
      const resJson = await response.json();
      return NextResponse.json({
        success: false,
        error: resJson.error || "Unknown error occurred.",
      });
    }
  } catch (error) {
    // Handle errors during the DELETE request
    console.error("Error during DELETE request:", error);
    return NextResponse.json(
      {
        success: false,
        error: "An unexpected error occurred during deletion.",
      },
      { status: 500 }
    );
  }
}

// Define the DELETE request handler for the API route
export async function DELETE(req: NextRequest) {
  try {
    // Get the API URL from environment variables
    const apiUrl = process.env.NEXT_PUBLIC_API_URL as string;

    // Call the common DELETE request handler function
    return handleDeleteRequest(req, apiUrl);
  } catch (error) {
    console.error("Error during DELETE request:", error);
    return NextResponse.json(
      {
        success: false,
        error: "An unexpected error occurred.",
      },
      { status: 500 }
    );
  }
}
