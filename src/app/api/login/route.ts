"use server"
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

// Get the API URL from environment variables
const apiUrl = process.env.NEXT_PUBLIC_API_URL as string;

// Define the POST request handler
export async function POST(req: NextRequest) {
  try {
    // Parse the request body as JSON
    const body = await req.json();

     // Create a FormData object and append the required fields
     const formData = new FormData();
     formData.append('email', body.email);
     formData.append('password', body.password);

    // Send a POST request to the API endpoint for login
   
 
    const response = await fetch(`${apiUrl}/api/login`, {
      method: 'POST',
       body: formData,
    });

 
    // Parse the JSON response from the API
   const resJson =  await response.json();
 
 
    // Check if login was successful
    if (resJson.data.success === true) {
    
      // Set the access token and refresh token cookies

      cookies().set('accessToken', resJson.data.access_token, {
        httpOnly: true,
        // maxAge: 24 * 60 * 60, // Example: Set maxAge for 1 day
      });
      cookies().set('refreshToken', resJson.data. refresh_token, {
        httpOnly: true,
        // maxAge: 7 * 24 * 60 * 60, // Example: Set maxAge for 7 days
      });

      // Remove sensitive data from the response before sending it back
      delete resJson.data.accessToken;
      delete resJson.data.refreshToken;

      // Return a JSON response with the modified data
      
      return NextResponse.json({
        success: true,
        dataset: resJson.data,
      });
    } 

    // Return an error response if login was not successful
    return NextResponse.json({
      success: false,
      message: resJson.error,
    });
  } catch (error) {
    // Handle errors during the login process
    console.error('Error during login:', error);

      // Return an error response with the pre-defined Error object
    return NextResponse.error();
  }
}
