import { NextRequest, NextResponse } from 'next/server';

async function handlePostRequest(req: NextRequest, apiUrl: string) {
    try {
        // Check if the request has a valid content type
        const contentType = req.headers.get('content-type') || '';

          if (!contentType.includes('multipart/form-data')) {
            return NextResponse.json({
                success: false,
                error: 'Invalid content type',
            }, { status: 400 });
        }

        // Get the access token from cookies
        const accessToken = req.cookies.get("accessToken")?.value;

        // Check for missing access token
        if (!accessToken) {
            return NextResponse.json({
                success: false,
                error: 'Missing access token',
            }, { status: 401 });
        }

        // Convert the request body to FormData
        const formData = await req.formData();
        const endApiUrl = formData.get('apiUrl') as string;

        // Log formData for debugging
        formData.forEach((value, key) => console.log(`${key}: ${value}`));

        // Send a POST request to the API endpoint
        const response = await fetch(`${apiUrl}${endApiUrl}`, {
            method: req.method,
            body: formData,
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        // Parse the JSON response from the API
        const resText = await response.text();

        // Try to parse the response text as JSON
        let dataset;
        try {
            dataset = JSON.parse(resText);
        } catch (e) {
            console.error('Failed to parse response as JSON:', resText);
            throw new Error('Invalid JSON response');
        }

        // Check if the request was successful
        if (response.ok) {
            // Return a JSON response with the data
            return NextResponse.json({
                success: true,
                dataset,
            });
        } else {
            // Return an error response if the request was not successful
            return NextResponse.json({
                success: false,
                error: dataset.error || 'Unknown error',
            }, { status: response.status });
        }
    } catch (error: any) {
        // Handle errors
        console.error('Error during POST request:', error);
        return NextResponse.json({
            success: false,
            error: error.message || 'Unknown server error',
        }, { status: 500 });
    }
}

// Define the POST request handler for the API route
export async function POST(req: NextRequest) {
    try {
        // Get the API URL from environment variables
        const apiUrl = process.env.NEXT_PUBLIC_API_URL as string;

        // Check for missing API URL
        if (!apiUrl) {
            throw new Error('API URL is not defined');
        }

        // Call the common POST request handler function
        return handlePostRequest(req, apiUrl);
    } catch (error: any) {
        console.error('Error during POST request:', error);
        return NextResponse.json({
            success: false,
            error: error.message || 'Unknown server error',
        }, { status: 500 });
    }
}
