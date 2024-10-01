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
      _: cacheBuster.toString(), // Cache-busting parameter
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

    const fullUrl = `${apiUrl}/product/${id}`;
  
    try {
      const response = await fetch(fullUrl);
      const dataset = await response.json();
 
      return {
        success: true,
        data: dataset.products
      };
    } catch (error) {
      console.error("Error fetching products:", error);
      return { success: false, data: [] };
    }
  };

  return { getProducts, getAProductBySlug, getAProductById };
};
