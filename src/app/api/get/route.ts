import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic"; // Mark this route as dynamic

// Function to handle common GET requests
async function handleGetRequest(req: NextRequest, apiUrl: string) {
  try {
    // Extract search params and action route
    const searchParams = req.nextUrl.searchParams;
    const reqType = searchParams.get("type");



    // Extract the action from query params and append it to the path
// let searchParams = new URLSearchParams(req.nextUrl.search);

// Extract the action parameter (like 'reviews') from the query string
const action = searchParams.get("action");

// Remove the action from the query params since it's now part of the path
searchParams.delete("action");

// Construct the URL without action in the query string
let fetchUrl = `${apiUrl}/api/v1/${action}?${searchParams.toString()}`;

console.log('fetchUrlfetchUrl', fetchUrl
    
)

    // Construct the base fetch URL with the action route (if provided)
    // let fetchUrl = `${apiUrl}/api/v1/${req.nextUrl.search}`;
    // Initialize headers as an empty object
    let headers: HeadersInit = {};

 
    // Check if the request type is not public and retrieve the access token from cookies
    if (!reqType || reqType !== "public") {
      const accessToken = req.cookies.get("accessToken")?.value;

      // Add Authorization header if accessToken exists
      if (accessToken) {
        headers = {
          Authorization: `Bearer ${accessToken}`,
        };
      }
    }

    // Make the API request
    const response = await fetch(fetchUrl, {
      method: "GET",
      headers,
    });

    // Check if the response is successful
    if (!response.ok) throw new Error("Failed to fetch");

    // Parse the response as JSON
    const resJson = await response.json();

    // Check if the response is successful
    if (response.ok) {
      return NextResponse.json({
        success: true,
        data: resJson,
        headers
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
