import { ClassValue, clsx } from 'clsx';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const apiUrl = process.env.NEXT_PUBLIC_API_URL as string;

export async function gettokenbyrefreshToken(refreshToken: string) {
  // Check for refresh token and issue a new access token if needed


  if (refreshToken) {
    try {

      const response = await fetch(`${apiUrl}/api/get-access-token`, {
        method: 'POST', // Assuming you are sending a POST request to get the access token
        headers: {
          'Authorization': `Bearer ${refreshToken}`,
          'Content-Type': 'application/json' // Set content type if sending JSON payload
        }
      });

 

      if (response.ok) {
        const data = await response.json();
        const newAccessToken = data.accessToken;

        if (newAccessToken) {
          return newAccessToken;
        }
      }
    } catch (error) {
      console.error('Error refreshing access token:', error);
    }
  }
}
export async function checkToken(token: string | undefined, apiUrl: string, refreshToken: string | undefined) {
  if (!token) {
    return {
      isValidToken: false,
      accessToken: ""
    };
  }
  try {
    const response = await fetch(`${apiUrl}/api/v1/check-token`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

 
    // if the accesstoken is valid then return true; 
    if (response.ok) {
      return {
        isValidToken: true,
        accessToken: ""
      };
    }

    // If response is not ok and refreshToken is provided, attempt to get a new token
    if (refreshToken) {
      const newTokenResponse = await gettokenbyrefreshToken(refreshToken);
      // const data = await newTokenResponse?.json();
 

      if(!newTokenResponse){
        return {
          isValidToken: false,
          accessToken: ""
        };

      }
      const newResponse = NextResponse.next();
      newResponse.cookies.set('accessToken', newTokenResponse, {
        httpOnly: true,
        secure: true,
        path: '/',
      });
      
      if (newTokenResponse ) {
        
        return {
          isValidToken: true,
          accessToken: newTokenResponse
        };
      }
    }



    return {
      isValidToken: true,
      accessToken: ""
    };
  } catch (error) {
    console.error('Error checking token validity:', error);
    return {
      isValidToken: true,
      accessToken: ""
    };
  }
}

// Function to set 'accessToken' cookie
export function setAccessTokenCookie(accessToken: string) {
  document.cookie = `accessToken=${accessToken}; path=/;`;
}


export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}


export async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
// Function to set 'accessToken' cookie (client-side)


export const checkImageExists = async (url: string): Promise<boolean> => {
  return new Promise<boolean>((resolve) => {
 
    const img = new Image();
    img.src = url;
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
  });
};
