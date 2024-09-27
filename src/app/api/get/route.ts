import { NextRequest, NextResponse } from "next/server";
export const dynamic = 'force-dynamic'; // Mark this route as dynamic

// Function to handle common GET requests
async function handleGetRequest(req: NextRequest, apiUrl: string) {
  try {
    console.log("==========================================");

    // Extract search params and action route
    const searchParams = req.nextUrl.searchParams;
    const actionRoute = searchParams.get("action");

    // Construct the base fetch URL with the action route (if provided)
    let fetchUrl = `${apiUrl}/api/v1/${actionRoute ? actionRoute : ""}${
      req.nextUrl.search
    }`;

    // Retrieve the access token from cookies
    const accessToken = req.cookies.get("accessToken")?.value;

    // Prepare request headers (add Authorization if accessToken exists)
    const headers: HeadersInit = accessToken
      ? { Authorization: `Bearer ${accessToken}` }
      : {};

    // Make the API request
    const response = await fetch(fetchUrl, {
      method: "GET",
      headers,
    });

    
    // Check if the response is successful
    if (!response.ok) throw new Error("Failed to fetch products");

    // Parse the response as JSON
    const resJson = await response.json();

  
    // Check if the response is successful
    if (response.ok) {
      return NextResponse.json({
        success: 'eeee4',
        data: resJson
      });
    } else {
      return NextResponse.json({
        success: false,
        error: "Unknown error occurred",
      });
    }
  } catch (error) {
    console.error("Error during GET request:", error);
    return NextResponse.json(
      { success: false, message: "An error occurred during the request" },
      { status: 500 }
    );
  }
}

// Define the GET request handler for the API route
export async function GET(req: NextRequest) {
  try {
    // Get the API URL from environment variables
    const apiUrl = process.env.NEXT_PUBLIC_API_URL as string;
    // Call the common GET request handler
    return handleGetRequest(req, apiUrl);
  } catch (error) {
    console.error("Error during GET request:", error);
    return NextResponse.json(
      { success: false, message: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
