const cacheBuster = new Date().getTime(); // Cache-busting parameter
const apiUrl = process.env.NEXT_PUBLIC_API_URL + "/api/v1";

export const useProducts = () => {
  const getProducts = async (
    page: number,
    limit: number,
    category?: string,
    brands?: string,
    priceRange?: string,
    searchTerm?: string,
    locale?: string
  ) => {
    const params: Record<string, string> = {
      page: page.toString(),
      limit: limit.toString(),
      // _: cacheBuster.toString(), // Cache-busting parameter
    };

    // Add optional parameters only if they are defined
    if (category) params.category = category;
    if (brands) params.brand = brands;
    if (priceRange) params.pricerange = priceRange;
    if (searchTerm) params.searchterm = searchTerm;
    if (locale) params.locale = locale;

    // Build the query string
    const queryString = new URLSearchParams(params).toString();

    console.log("queryString", queryString);

    // Ensure API URL is defined
    if (!apiUrl) {
      return Promise.reject(
        new Error("API URL is not defined in environment variables")
      );
    }

    const fullUrl = `${apiUrl}/products?${queryString}`;
    console.log("Fetching URL:", fullUrl); // Ensure this URL is correct

    try {
      const response = await fetch(fullUrl);
      const dataset = await response.json();

      return {
        success: true,
        data: dataset,
        totalProducts: dataset.totalProducts,
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
    const params: Record<string, string> = {};

    // Build the query string
    const queryString = new URLSearchParams(params).toString();

    // Ensure API URL is defined
    if (!apiUrl) {
      return Promise.reject(
        new Error("API URL is not defined in environment variables")
      );
    }

 
    const fullUrl = `${apiUrl}/product/${id}?type=public`;
 
    try {
      const response = await fetch(fullUrl);
      const dataset = await response.json();

      return {
        success: true,
        data: dataset.products,
      };
    } catch (error) {
      console.error("Error fetching products:", error);
      return { success: false, data: [] };
    }
  };

  const createProduct = async (productData: Record<string, any>) => {
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
        data: dataset,
      };
    } catch (error) {
      const err = error as Error;
      console.error("Error updating product:", err.message);

      return { success: false, data: [], error: err.message };
    }
  };

  const updateProduct = async (
    id: number | string,
    productData: Record<string, any>
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
        data: dataset,
      };
    } catch (error) {
      // Type the error as `Error` to access the `message` property
      const err = error as Error;
      console.error("Error updating product:", err.message);

      return { success: false, data: [], error: err.message };
    }
  };

  const updateProducts = async (
    id: number | string,
    productData: Record<string, any>
  ) => {
    // Ensure API URL is defined
    if (!apiUrl) {
      return Promise.reject(
        new Error("API URL is not defined in environment variables")
      );
    }

    const fullUrl = `/products/update/${id}`;

    try {

      const response = await fetch("/api/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

   

      if (!response.ok) {
        // If response status is not 200-299, throw an error with status info
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
        data: dataset,
      };
    } catch (error) {
      // Type the error as `Error` to access the `message` property
      const err = error as Error;
      console.error("Error updating product:", err.message);

      return { success: false, data: [], error: err.message };
    }
  };

  return {
    getProducts,
    getAProductBySlug,
    getAProductById,
    createProduct,
    updateProduct,
  };
};
