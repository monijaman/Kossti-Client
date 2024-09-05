"use server";
import { NextRequest, NextResponse } from 'next/server';

// Get the API URL from environment variables
const apiUrl = process.env.NEXT_PUBLIC_API_URL as string;

// Define the POST request handler
export async function POST(req: NextRequest) {
  try {
    // Parse the request body as JSON
    const body = await req.json();

    // Send a POST request to the API endpoint for login
    const response = await fetch(`${apiUrl}/api/v1/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: body.email,
        password: body.password,
      }),
    });

    // Parse the JSON response from the API
    const resJson = await response.json();

    // Check if login was successful
    if (resJson.success === true) {
      // Set the access token and refresh token cookies
      const nextResponse = NextResponse.json({
        success: true,
        dataset: resJson,
      });

      nextResponse.cookies.set('accessToken', resJson.access_token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60, // 1 day
      });
      nextResponse.cookies.set('refreshToken', resJson.refresh_token, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60, // 7 days
      });

      // Remove sensitive data from the response before sending it back
      delete resJson.access_token;
      delete resJson.refresh_token;

      // Return the JSON response with cookies set
      return nextResponse;
    }

    // Return an error response if login was not successful
    return NextResponse.json({
      success: false,
      message: resJson.error || "Login failed",
    });
  } catch (error) {
    // Handle errors during the login process
    console.error('Error during login:', error);

    // Return an error response
    return NextResponse.json({
      success: false,
      message: 'An unexpected error occurred',
    }, { status: 500 });
  }
}
