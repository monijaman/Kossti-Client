import { apiEndpoints } from "@/lib/constants";
import fetchApi from "@/lib/fetchApi";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const useProducts = () => {
  const getProducts = async (
    page: number,
    limit: number,
    category?: string,
    brands?: string,
    priceRange?: string,
    searchTerm?: string,
    locale?: string,
    sortby?: string,
  ) => {
    const params: Record<string, string> = {
      page: page.toString(),
      limit: limit.toString(),
      // _: cacheBuster.toString(), // Cache-busting parameter
    };

    // Add optional parameters only if they are defined and not empty
    if (locale) params.locale = locale;
    if (category) params.category = category;
    if (brands) params.brand = brands;
    if (priceRange) params.priceRange = priceRange; // Updated to match Go server format
    if (searchTerm && searchTerm.trim() !== "")
      params.search = searchTerm.trim();
    if (sortby) params.sortby = sortby;

    // Build the query string
    const queryString = new URLSearchParams(params).toString();

    // Ensure API URL is defined
    if (!apiUrl) {
      return Promise.reject(
        new Error("API URL is not defined in environment variables"),
      );
    }

    const fullUrl = `${apiUrl}/products?${queryString}`;

    console.log("API URL being called:", fullUrl);
    console.log("Search term:", searchTerm);

    try {
      const response = await fetch(fullUrl);
      const dataset = await response.json();

      // Handle Laravel-compatible response format
      return {
        success: true,
        data: {
          products: dataset.data || [], // Laravel format uses 'data' field
          totalProducts: dataset.meta?.total || 0, // Laravel format uses 'meta.total'
        },
        totalProducts: dataset.meta?.total || 0,
      };
    } catch (error) {
      console.error("Error fetching products:", error);
      return { success: false, data: [] };
    }
  };

  const getAProductBySlug = async (slug: string, locale?: string) => {
    const params: Record<string, string> = {};

    // Add optional parameters only if they are defined
    if (locale) params.locale = locale;

    // Build the query string
    const queryString = new URLSearchParams(params).toString();

    // Ensure API URL is defined
    if (!apiUrl) {
      return Promise.reject(
        new Error("API URL is not defined in environment variables"),
      );
    }

    const fullUrl = `${apiUrl}/products/${slug}?${queryString}`;

    try {
      const response = await fetch(fullUrl);
      const dataset = await response.json();

      return {
        success: true,
        data: dataset.products,
        totalProducts: dataset.totalProducts,
      };
    } catch (error) {
      console.error("Error fetching products:", error);
      return { success: false, data: [] };
    }
  };
  const getAProductById = async (id: number) => {
    const params: Record<string, string> = {
      // Add any additional query parameters if necessary
      // e.g. 'filter': 'someFilterValue'
    };

    // Build the query string (if params are provided)
    const queryString = new URLSearchParams(params).toString();
    const fullUrl = queryString
      ? `${apiUrl}/products/${id}?${queryString}&type=public`
      : `${apiUrl}/products/${id}?type=public`;

    // Ensure API URL is defined
    if (!apiUrl) {
      return Promise.reject(
        new Error("API URL is not defined in environment variables"),
      );
    }

    try {
      const response = await fetch(fullUrl, { cache: "no-store" });

      // Check if the response is okay (status 200-299)
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const dataset = await response.json();

      return {
        success: true,
        data: dataset,
      };
    } catch (error) {
      console.error("Error fetching product:", error);
      return { success: false, data: [] };
    }
  };

  const createProduct = async (productData: Record<string, unknown>) => {
    try {
      const apiUrl = "products"; // Assuming this is the API route

      // Append apiUrl to productData
      const payload = { ...productData, apiUrl };

      // Make the POST request to the backend API
      const response = await fetch("/api/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Ensure you're sending JSON data
        },
        body: JSON.stringify(payload), // Convert the payload with apiUrl to JSON format
      });

      if (!response.ok) {
        // If the response status is not OK, throw an error
        const errorData = await response.json();
        throw new Error(
          `Error creating product: ${errorData.message || response.statusText}`,
        );
      }

      // Parse the response body as JSON if the request was successful
      const dataset = await response.json();

      // Return success along with the data
      return {
        success: true,
        ...dataset,
      };
    } catch (error) {
      const err = error as Error;
      console.error("Error updating product:", err.message);

      return { success: false, data: [], error: err.message };
    }
  };

  const updateProduct = async (
    id: number | string,
    productData: Record<string, unknown>,
  ) => {
    try {
      // Use the correct Go server endpoint for updating products
      const response = await fetchApi(apiEndpoints.updateProduct(id), {
        method: "PATCH",
        body: productData,
      });

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Error updating product:", error);
      return {
        success: false,
        data: null,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  };

  const Translation = async (
    productData: Record<string, unknown>,
    id: number,
  ) => {
    try {
      console.log(
        "Creating/updating translation for product:",
        id,
        productData,
      );

      // Use Go server API URL for product translations
      const goApiUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
      const url = `${goApiUrl}/products/${id}/translations`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          locale: productData.locale,
          translated_name: productData.translated_name,
          price: productData.price,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      return {
        success: data.success || true,
        data: data.translation || data,
        message: data.message || "Translation created/updated successfully",
      };
    } catch (error) {
      console.error("Error creating translation:", error);
      return {
        success: false,
        data: null,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  };

  const getProductTranslations = async (productId: number, locale?: string) => {
    try {
      console.log(`Getting translations for product ${productId}`);

      // Use Go server API URL for product translations
      const goApiUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
      const url = locale
        ? `${goApiUrl}/products/${productId}/translations?locale=${locale}`
        : `${goApiUrl}/products/${productId}/translations`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      return {
        success: data.success || true,
        data: data.data || [],
        message: data.message || "Translations retrieved successfully",
      };
    } catch (error) {
      console.error("Error fetching translations:", error);
      return {
        success: false,
        data: [],
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  };

  const getPhotosByProductId = async (productId: number) => {
    const fullUrl = `${apiUrl}/productimages/${productId}`;

    try {
      const response = await fetch(fullUrl);
      const dataset = await response.json();

      return {
        success: true,
        data: dataset.images,
      };
    } catch (error) {
      console.error("Error fetching products:", error);
      return { success: false, data: [] };
    }
  };

  const getVideosByProductId = async (productId: number) => {
    const fullUrl = `${apiUrl}/product-videos/${productId}`;

    try {
      const response = await fetch(fullUrl);
      const dataset = await response.json();

      return {
        success: true,
        data: dataset.data || dataset.videos || [],
      };
    } catch (error) {
      console.error("Error fetching videos:", error);
      return { success: false, data: [] };
    }
  };

  const incrementViews = async (productId: number) => {
    try {
      const fullUrl = `${apiUrl}/products/${productId}/increment-views`; // Assuming this is the API route

      // Append apiUrl to productData

      // Make the POST request to the backend API
      const response = await fetch(fullUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Ensure you're sending JSON data
        },
      });

      if (!response.ok) {
        // If the response status is not OK, throw an error
        const errorData = await response.json();
        throw new Error(
          `Error creating product: ${errorData.message || response.statusText}`,
        );
      }

      // Parse the response body as JSON if the request was successful
      const dataset = await response.json();

      // Return success along with the data
      return {
        success: true,
        ...dataset,
      };
    } catch (error) {
      const err = error as Error;
      console.error("Error updating product:", err.message);

      return { success: false, data: [], error: err.message };
    }
  };

  const MakePhotoDefault = async (photoId: number | string, productId?: number) => {
    try {
      const payload = {
        apiUrl: `default-image/${photoId}`,
      };

      // Make the POST request to the backend API
      const response = await fetch("/api/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      // Parse the response body as JSON
      const dataset = await response.json();
      console.log("[MakePhotoDefault] Response:", dataset);

      // After setting the default, fetch the updated photos list
      if (productId) {
        const photosResponse = await getPhotosByProductId(productId);
        return {
          success: true,
          data: photosResponse.data || [],
        };
      }

      // If no productId provided, return empty data (caller should refetch)
      return {
        success: true,
        data: [],
        message: dataset.message || "Image set as default",
      };
    } catch (error) {
      // Type the error to access the message property
      const err = error as Error;
      console.error("Error setting photo as default:", err.message);

      return { success: false, data: [], error: err.message };
    }
  };

  return {
    Translation,
    getProducts,
    getAProductBySlug,
    getAProductById,
    createProduct,
    updateProduct,
    getProductTranslations,
    getPhotosByProductId,
    getVideosByProductId,
    MakePhotoDefault,
    incrementViews,
  };
};
