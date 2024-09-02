import { NextRequest, NextResponse } from 'next/server';

// Define a function to handle common DELETE requests
async function handleDeleteRequest(req: NextRequest, apiUrl: string) {
  try {
    // Parse the request body as JSON if needed (DELETE requests may not have a body)
   
     const body = await req.json();
    // Send a DELETE request to the API endpoint
    const accessToken = req.cookies.get("accessToken")?.value;
    const response = await fetch(`${apiUrl}/api/${body.apiUrl}`, {
      method: 'DELETE', // Change the request method to DELETE
      // body: JSON.stringify(body), // No body for DELETE requests
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // Check if the request was successful
    if (response.ok) {
      // Return a JSON response with success message
      return NextResponse.json({
        success: true,
        message: 'Resource deleted successfully.',
      });
    } else {
      // Parse the JSON error response from the API
      const resJson = await response.json();
      // Return an error response if the request was not successful
      return NextResponse.json({
        success: false,
        error: resJson.error || 'Unknown error',
      });
    }
  } catch (error) {
    // Handle errors
    console.error('Error during DELETE request:', error);
    return NextResponse.error();
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
    console.error('Error during DELETE request:', error);
    return NextResponse.error();
  }
}


 