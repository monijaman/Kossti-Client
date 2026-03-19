// app/lib/fetchApi.ts (no import from 'next/headers')
import { ApiResponse } from "@/lib/types";

interface FetchOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: FormData | Record<string, unknown> | unknown;
  queryParams?: Record<string, string | number | null | undefined>;
  signal?: number;
  accessToken?: string; // Optional Bearer token
  countryCode?: string; // Optional country code
  next?: NextFetchRequestConfig; // Next.js caching options
}

type NextFetchRequestConfig = {
  revalidate?: number | false;
  tags?: string[];
};

const getBaseUrl = () => {
  let url = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL;

  // Fallback for production deployments
  if (!url && typeof window !== "undefined") {
    // If running in browser, try to use backend from origin or default production URL
    url = "https://gocritserver-production.up.railway.app";
  }

  if (!url && typeof window === "undefined") {
    // Server-side but no URL set - use default for builds
    url = "https://gocritserver-production.up.railway.app";
  }

  if (!url) {
    const errorMsg = `API URL is not defined in env variables.
    NEXT_PUBLIC_API_URL: ${process.env.NEXT_PUBLIC_API_URL || "undefined"}
    API_URL: ${process.env.API_URL || "undefined"}
    NODE_ENV: ${process.env.NODE_ENV || "undefined"}`;
    console.error(errorMsg);
    throw new Error(errorMsg);
  }

  return url;
};

export default async function fetchApi<T>(
  path: string,
  options: FetchOptions = {},
): Promise<ApiResponse<T>> {
  const baseUrl = getBaseUrl();

  const queryString = options.queryParams
    ? new URLSearchParams(
        Object.entries(options.queryParams)
          .filter(([, v]) => v !== undefined && v !== null)
          .map(([k, v]) => [k, String(v)]),
      ).toString()
    : "";

  const fullUrl = `${baseUrl}${path}${queryString ? `?${queryString}` : ""}`;
  const method = options.method?.toUpperCase() || "GET";
  const hasBody = method !== "GET" && options.body !== undefined;

  // Get token/country from passed-in options
  const token = options.accessToken || "";
  const country = options.countryCode;

  const controller = new AbortController();
  const timeoutMs = options.signal ?? 15000; // Reduced default timeout for Vercel
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  let errorStatus = 0;

  const fetchOptions: RequestInit = {
    method,
    headers: {
      ...(options.body instanceof FormData
        ? {}
        : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(country ? { "x-country-code": country } : {}),
      ...options.headers,
    },
    ...(hasBody && {
      body:
        options.body instanceof FormData
          ? options.body
          : JSON.stringify(options.body),
    }),
    // Include credentials so cookie-based auth works across dev ports (3000 <-> 8080)
    credentials: "include",
    signal: controller.signal,
    // Use Next.js caching if provided, otherwise default to 60s revalidation for GET requests
    ...(options.next
      ? { next: options.next }
      : method === "GET"
        ? { next: { revalidate: 60 } }
        : { cache: "no-store" }),
  };

  try {
    const res = await fetch(fullUrl, fetchOptions);
    clearTimeout(timeoutId);
    errorStatus = res.status;

    if (res.ok || res.status === 201) {
      const isJson = res.headers
        .get("Content-Type")
        ?.includes("application/json");
      const data = isJson ? await res.json() : null;
      return { success: true, status: res.status, data };
    }

    let errorDetail = "An error occurred";
    if (res.status === 422) {
      return { success: false, status: res.status };
    }

    try {
      const errorData = await res.json();
      // Handle standardized Go API response format
      if (errorData?.success === false && errorData?.error) {
        errorDetail = errorData.error;
      } else {
        // Fallback to other error formats
        errorDetail =
          errorData?.detail ||
          errorData?.title ||
          errorData?.message ||
          errorDetail;
      }
    } catch {}

    return {
      success: false,
      status: res.status,
      data: null,
      error: errorDetail,
    };
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    if (err instanceof Error) {
      if (err.name === "AbortError") {
        return {
          success: false,
          data: null,
          status: 408,
          error: "Request timed out",
        };
      }

      return {
        success: false,
        data: null,
        status: errorStatus || 500,
        error: err.message || "Unknown error",
      };
    }

    return {
      success: false,
      data: null,
      status: 500,
      error: "An unknown error occurred",
    };
  }
}
