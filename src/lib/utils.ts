import { ClassValue, clsx } from "clsx";
import { NextResponse } from "next/server";

const apiUrl = process.env.NEXT_PUBLIC_API_URL as string;

export async function gettokenbyrefreshToken(
  refreshToken: string
): Promise<string | undefined> {
  if (!refreshToken) {
    console.error("No refresh token provided.");
    return undefined;
  }

  try {
    const response = await fetch(`${apiUrl}/api/v1/refresh-token`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${refreshToken}`,
        "Content-Type": "application/json",
      },
    });

    // Check if the response was successful
    if (response.ok) {
      const data = await response.json();

      if (data?.access_token) {
        return data.access_token; // Use `access_token` as per your API response
      } else {
        console.error("No access token in response:", data);
      }
    } else {
      console.error(`Failed to refresh token. Status: ${response.status}`);
      console.log("Response details:", await response.text());
    }
  } catch (error) {
    console.error("Error refreshing access token:", error);
  }

  // Return undefined as a fallback
  return undefined;
}

export async function checkToken(
  token: string | undefined,
  apiUrl: string,
  refreshToken: string | undefined
) {
  if (!token) {
    return {
      isValidToken: false,
      accessToken: "",
    };
  }
  try {
    const response = await fetch(`${apiUrl}/api/v1/check-token`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // if the accesstoken is valid then return true;
    if (response.ok) {
      return {
        isValidToken: true,
        accessToken: "",
      };
    }

    // If response is not ok and refreshToken is provided, attempt to get a new token
    if (refreshToken) {
      const newTokenResponse = await gettokenbyrefreshToken(refreshToken);
      // const data = await newTokenResponse?.json();

      if (!newTokenResponse) {
        return {
          isValidToken: false,
          accessToken: "",
        };
      }
      const newResponse = NextResponse.next();
      newResponse.cookies.set("accessToken", newTokenResponse, {
        httpOnly: true,
        secure: true,
        path: "/",
      });

      if (newTokenResponse) {
        return {
          isValidToken: true,
          accessToken: newTokenResponse,
        };
      }
    }

    return {
      isValidToken: true,
      accessToken: "",
    };
  } catch (error) {
    console.error("Error checking token validity:", error);
    return {
      isValidToken: true,
      accessToken: "",
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
  return new Promise((resolve) => setTimeout(resolve, ms));
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
