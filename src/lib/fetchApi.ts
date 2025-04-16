// app/lib/fetchApi.ts

import { ApiResponse } from "@/lib/types";
import { cookies } from "next/headers";

interface FetchOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: FormData | Record<string, unknown> | unknown;
  queryParams?: Record<string, string | number | null | undefined>;
  signal?: number; // timeout in ms
  accessToken?: string; // Optional override
}

const baseUrl = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL;

export default async function fetchApi<T>(
  path: string,
  options: FetchOptions = {}
): Promise<ApiResponse<T>> {
  if (!baseUrl) throw new Error("API URL is not defined in env variables");

  const queryString = options.queryParams
    ? new URLSearchParams(
        Object.entries(options.queryParams)
          .filter(([, v]) => v !== undefined && v !== null)
          .map(([k, v]) => [k, String(v)])
      ).toString()
    : "";

  const fullUrl = `${baseUrl}${path}${queryString ? `?${queryString}` : ""}`;
  const method = options.method?.toUpperCase() || "GET";
  const hasBody = method !== "GET" && options.body !== undefined;

  // Server-side cookie access
  const cookieStore = await cookies();
  const token =
    options.accessToken || cookieStore.get("accessToken")?.value || "";
  const country = cookieStore.get("country-code")?.value;

  // Timeout logic
  const controller = new AbortController();
  const timeoutMs = options.signal ?? 20000;
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
    signal: controller.signal,
    cache: "no-store", // Important for dynamic SSR behavior
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
      errorDetail = errorData?.detail || errorData?.title || errorDetail;
    } catch {
      // Ignore JSON parse errors
    }

    return {
      success: false,
      status: res.status,
      data: null,
      error: errorDetail,
    };
  } catch (err: any) {
    clearTimeout(timeoutId);
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
}

/**
 * * Usage Example:
 *
 * ```typescript
 * const { success, data, error } = await fetchApi('/path/to/resource', {
 *   method: 'POST',
 *  body: { key: 'value' },
 *  headers: { 'Custom-Header': 'value' },
 *  queryParams: { page: 1, limit: 10 },
 *  signal: 5000, // 5 seconds timeout
 *  }
 * });
 *
 * *
 */
