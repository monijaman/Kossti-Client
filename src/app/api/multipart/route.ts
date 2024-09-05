import { NextRequest, NextResponse } from 'next/server';

async function handlePostRequest(req: NextRequest, apiUrl: string) {
  try {
    // Check if the request has a valid content type
    const contentType = req.headers.get('content-type') || '';

    if (!contentType.includes('multipart/form-data')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid content type',
        },
        { status: 400 }
      );
    }

    // Get the access token from cookies
    const accessToken = req.cookies.get('accessToken')?.value;

    // Check for missing access token
    if (!accessToken) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing access token',
        },
        { status: 401 }
      );
    }

    // Convert the request body to FormData
    const formData = await req.formData();
    const endApiUrl = formData.get('apiUrl') as string;

    // Handle missing API endpoint in form data
    if (!endApiUrl) {
      return NextResponse.json(
        {
          success: false,
          error: 'API URL not provided in form data',
        },
        { status: 400 }
      );
    }

    // Log formData for debugging
    formData.forEach((value, key) => console.log(`${key}: ${value}`));

    // Send a POST request to the API endpoint
    const response = await fetch(`${apiUrl}${endApiUrl}`, {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // Handle non-JSON responses gracefully
    const resText = await response.text();
    let dataset;
    try {
      dataset = JSON.parse(resText);
    } catch (e) {
      // If parsing fails, log the response and send a plain text response instead of JSON
      console.error('Failed to parse response as JSON:', resText);
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid JSON response from the server',
          rawResponse: resText,
        },
        { status: response.status }
      );
    }

    // Check if the request was successful
    if (response.ok) {
      return NextResponse.json({
        success: true,
        dataset,
      });
    } else {
      // Return an error response if the request was not successful
      return NextResponse.json(
        {
          success: false,
          error: dataset?.error || 'Unknown error',
        },
        { status: response.status }
      );
    }
  } catch (error: any) {
    // Handle general errors during the request
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

    // Check for missing API URL in environment variables
    if (!apiUrl) {
      throw new Error('API URL is not defined');
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
