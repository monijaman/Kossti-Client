import { NextRequest, NextResponse } from 'next/server';

// Define a function to handle common GET requests
async function handleGetRequest(req: NextRequest, apiUrl: string) {
  try {
    // Extract search params and action route
    const searchParams = req.nextUrl.searchParams;
    const actionRoute = searchParams.get('action');
    
    // Construct the fetch URL based on action and query params
    let fetchUrl = `${apiUrl}/api/${actionRoute}${req.nextUrl.search}`;

    // Handle the case where the action route is missing
    if (!actionRoute) {
      const typeParam = searchParams.get('type');
      // Remove '?type=&' if type is empty, and ensure proper URL construction
      if (typeParam === '') {
        const urlWithoutType = req.nextUrl.search.replace('?type=&', '').replace(/%2F/g, '/');
        fetchUrl = `${apiUrl}/api/${urlWithoutType}`;
      }
    }

    // Get the access token from cookies
    const accessToken = req.cookies.get('accessToken')?.value;

    // Send a GET request to the API endpoint
    const response = await fetch(fetchUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // Parse the JSON response from the API
    const resJson = await response.json();

    // Check if the request was successful
    if (response.ok) {
      return NextResponse.json({
        success: true,
        data: resJson.data,
      });
    } else {
      return NextResponse.json({
        success: false,
        error: resJson.error || 'Unknown error',
      });
    }
  } catch (error) {
    // Handle errors
    console.error('Error during GET request:', error);
    return NextResponse.json({ success: false, message: 'An error occurred during the request' }, { status: 500 });
  }
}

// Define the GET request handler for the API route
export async function GET(req: NextRequest) {
  try {
    // Get the API URL from environment variables
    const apiUrl = process.env.NEXT_PUBLIC_API_URL as string;

    // Call the common GET request handler function
    return handleGetRequest(req, apiUrl);
  } catch (error) {
    console.error('Error during GET request:', error);
    return NextResponse.json({ success: false, message: 'An unexpected error occurred' }, { status: 500 });
  }
}
