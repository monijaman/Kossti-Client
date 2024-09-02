import { NextRequest, NextResponse } from 'next/server';

// Define a function to handle common POST requests
async function handlePostRequest(req: NextRequest, apiUrl: string) {
  try {
    // Parse the request body as JSON
    const body = await req.json();
 
 
    // Send a POST request to the API endpoint
    const accessToken = req.cookies.get("accessToken")?.value;
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
      // Return a JSON response with the data
      return NextResponse.json({
        success: true,
        data: resJson,
      });
    } else {
      // Return an error response if the request was not successful
      return NextResponse.json({
        success: false,
        error: resJson.error || 'Unknown error',
      });
    }
  } catch (error) {
    // Handle errors
    console.error('Error during POST request:', error);
    return NextResponse.error();
  }
}

// Define the POST request handler for the API route
export async function POST(req: NextRequest) {
  try {
    // Get the API URL from environment variables
    const apiUrl = process.env.NEXT_PUBLIC_API_URL as string;
    //console.log(req)
    // Call the common POST request handler function
    return handlePostRequest(req, apiUrl);
  } catch (error) {
    console.error('Error during POST request:', error);
    return NextResponse.error();
  }
}
