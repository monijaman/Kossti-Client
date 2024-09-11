import { NextRequest, NextResponse } from 'next/server';

// Define a function to handle common POST requests
async function handlePostRequest(req: NextRequest, apiUrl: string) {
  try {
    // Ensure the request has a valid Content-Type
    const contentType = req.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      return NextResponse.json(
        { success: false, error: 'Invalid content type' },
        { status: 400 }
      );
    }

    // Parse the request body as JSON
    const body = await req.json();

    // Ensure apiUrl is present in the request body
    if (!body.apiUrl) {
      return NextResponse.json(
        { success: false, error: 'Missing API URL in request body' },
        { status: 400 }
      );
    }

    // Get the access token from cookies
    const accessToken = req.cookies.get('accessToken')?.value;
    if (!accessToken) {
      return NextResponse.json(
        { success: false, error: 'Missing access token' },
        { status: 401 }
      );
    }

    // Send a POST request to the API endpoint
    const response = await fetch(`${apiUrl}/api/${body.apiUrl}`, {
      method: req.method,
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
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
          error: resJson.error || 'Unknown error',
        },
        { status: response.status }
      );
    }
  } catch (error: any) {
    // Handle errors and provide a structured JSON error response
    console.error('Error during POST request:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Unknown server error',
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

    // Ensure API URL is set in environment variables
    if (!apiUrl) {
      return NextResponse.json(
        { success: false, error: 'API URL is not defined in environment variables' },
        { status: 500 }
      );
    }

    // Call the common POST request handler function
    return handlePostRequest(req, apiUrl);
  } catch (error: any) {
    console.error('Error during POST request:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Unknown server error',
      },
      { status: 500 }
    );
  }
}
