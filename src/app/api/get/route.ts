import { NextRequest, NextResponse } from 'next/server';

// Define a function to handle common POST requests
async function handleGetRequest(req: NextRequest, apiUrl: string) {
  try {


    const searpParam = req.nextUrl.search
    const actionRoute = req.nextUrl.searchParams.get('action');
    // Send a POST request to the API endpoint

    let fetchUrl = `${apiUrl}/api/${actionRoute}/${searpParam}`;


    // console.log("fetchUrl " + fetchUrl)
    // console.log("searpParam---- " + searpParam)
    // if action is null then replace ?type=& and 
    if (actionRoute == null) {
      let urlWithoutType = searpParam.replace('?type=&', '').replace(/%2F/g, '/');
      fetchUrl = `${apiUrl}/api/${urlWithoutType}`;
    } 
 
    const accessToken = req.cookies.get("accessToken")?.value;
    const response = await fetch(fetchUrl, {
      method: req.method,
      headers: {
        // 'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });


    // Parse the JSON response from the API
    const resJson = await response.json();
    // console.log(resJson.data)
    // Check if the request was successful
    if (response.ok) {
      // Return a JSON response with the data
      return NextResponse.json({
        success: true,
        data: resJson.data,
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
export async function GET(req: NextRequest) {
  try {
    // Get the API URL from environment variables
    const apiUrl = process.env.NEXT_PUBLIC_API_URL as string;
    // const { param1, param2 } = req.query;

    // Call the common POST request handler function
    return handleGetRequest(req, apiUrl);
  } catch (error) {
    console.error('Error during POST request:', error);
    return NextResponse.error();
  }
}
