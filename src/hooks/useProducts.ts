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
    sortby?: string
  ) => {
    const params: Record<string, string> = {
      page: page.toString(),
      limit: limit.toString(),
      // _: cacheBuster.toString(), // Cache-busting parameter
    };

    // Add optional parameters only if they are defined
    if (locale) params.locale = locale;
    if (category) params.category = category;
    if (brands) params.brand = brands;
    if (priceRange) params.priceRange = priceRange; // Updated to match Go server format
    if (searchTerm) params.searchterm = searchTerm;
    if (sortby) params.sortby = sortby;

    // Build the query string
    const queryString = new URLSearchParams(params).toString();

    // Ensure API URL is defined
    if (!apiUrl) {
      return Promise.reject(
        new Error("API URL is not defined in environment variables")
      );
    }

    const fullUrl = `${apiUrl}/products?${queryString}`;

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
        new Error("API URL is not defined in environment variables")
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
      ? `${apiUrl}/product/${id}?${queryString}&type=public`
      : `${apiUrl}/product/${id}?type=public`;

    // Ensure API URL is defined
    if (!apiUrl) {
      return Promise.reject(
        new Error("API URL is not defined in environment variables")
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
          `Error creating product: ${errorData.message || response.statusText}`
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
    productData: Record<string, unknown>
  ) => {
    try {
      const apiUrl = `products/update/${id}`; // Example API endpoint

      // Append apiUrl to productData
      const payload = { ...productData, apiUrl };

      // Make the PUT request to the backend API
      const response = await fetch(`/api/post/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Ensure you're sending JSON data
        },
        body: JSON.stringify(payload), // Convert the payload to JSON format
      });

      if (!response.ok) {
        // If the response status is not OK, throw an error
        const errorData = await response.json();
        throw new Error(
          `Error updating product: ${errorData.message || response.statusText}`
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
      // Type the error as `Error` to access the `message` property
      const err = error as Error;
      console.error("Error updating product:", err.message);

      return { success: false, data: [], error: err.message };
    }
  };

  const Translation = async (
    productData: Record<string, unknown>,
    id: number
  ) => {
    try {
      const apiUrl = `product-trans/${id}`; // Assuming this is the API route

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
          `Error creating product: ${errorData.message || response.statusText}`
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
          `Error creating product: ${errorData.message || response.statusText}`
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

  const MakePhotoDefault = async (photoId: number | string) => {
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

      // Return success along with the data
      return {
        success: true,
        data: dataset.data.images,
      };
    } catch (error) {
      // Type the error to access the message property
      const err = error as Error;
      console.error("Error updating product:", err.message);

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
    getPhotosByProductId,
    MakePhotoDefault,
    incrementViews,
  };
};
