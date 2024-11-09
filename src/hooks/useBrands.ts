import { Brand } from "@/lib/types";

const apiUrl = process.env.NEXT_PUBLIC_API_URL + "/api/v1";
interface CategoryOptions {
  per_page?: string;
  search?: string;
  paginate?: boolean;
}

export const useBrands = () => {
  // get all categories
  const getBrands = async () => {
    const apiEndpoint = `brands`;
    // const apiEndpoint = `/api/v1/products?page=1&productsPerPage=10&category=&branch=&priceRange=`;

    if (!apiUrl) {
      return Promise.reject(
        new Error("API URL is not defined in environment variables")
      );
    }

    const fullUrl = `${apiUrl}/${apiEndpoint}`;

    try {
      const response = await fetch(fullUrl); // Adjust API endpoint
      const dataset = await response.json();

      return {
        success: true,
        data: dataset,
      };
    } catch (error) {
      console.error("Error fetching category:-", error);
      return { success: false, data: [] };
    }
  };

  const getPublicBrands = async () => {
    const apiEndpoint = `public-brands`;
    // const apiEndpoint = `/api/v1/products?page=1&productsPerPage=10&category=&branch=&priceRange=`;

    if (!apiUrl) {
      return Promise.reject(
        new Error("API URL is not defined in environment variables")
      );
    }

    const fullUrl = `${apiUrl}/${apiEndpoint}`;

    try {
      const response = await fetch(fullUrl); // Adjust API endpoint
      const dataset = await response.json();

      return {
        success: true,
        data: dataset,
      };
    } catch (error) {
      console.error("Error fetching category:-", error);
      return { success: false, data: [] };
    }
  };

  // get all categories
  const getAllBrands = async (options: CategoryOptions = {}) => {
    const { per_page, search, paginate } = options;

    // Ensure the API URL is defined
    if (!apiUrl) {
      return Promise.reject(
        new Error("API URL is not defined in environment variables")
      );
    }

    // Build query string based on optional parameters
    const queryParams = new URLSearchParams();
    if (per_page !== undefined) queryParams.append("per_page", per_page);
    if (search !== undefined) queryParams.append("search", search);
    if (paginate !== undefined)
      queryParams.append("paginate", String(paginate));

    // Construct the full URL with query parameters
    const apiEndpoint = `wide-brands`;
    const fullUrl = `${apiUrl}/${apiEndpoint}?${queryParams.toString()}`;
    try {
      // Fetch data from the API
      const response = await fetch(fullUrl);

      // Check if the response is OK
      if (!response.ok) {
        throw new Error(
          `Error fetching category: ${response.status} ${response.statusText}`
        );
      }

      // Parse the JSON data
      const dataset = await response.json();

      // Return success with data
      return {
        success: true,
        data: dataset,
      };
    } catch (error: any) {
      // Log any errors and return failure
      console.error("Error fetching category:", error);
      return {
        success: false,
        data: [],
        error: error.message,
      };
    }
  };

  // Submit form
  const submitBrands = async (
    categoryId: number,
    brands: Brand[]
  ): Promise<any> => {
    try {
      // Prepare the payload with productId, specifications, and apiUrl

      const brandArrays = brands
        .map((brand) => brand.id) // Return the `id` directly
        .filter((id): id is number => id !== null) // Ensure non-null values
        .sort((a, b) => a - b); // Sort numerically

      const payload = {
        category_id: categoryId,
        brands: brandArrays,
        apiUrl: "category-brands",
      };

      // Send the request to the backend
      const response = await fetch("/api/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload), // Send payload including apiUrl
      });

      // Check if the response is successful
      if (!response.ok) {
        throw new Error("Failed to submit specifications");
      }

      // Return the JSON response if the request was successful
      return await response.json();
    } catch (error) {
      console.error("Error submitting specifications:", error);
      throw error; // Properly propagate the error
    }
  };

  return {
    getBrands,
    getPublicBrands,
    getAllBrands,
    submitBrands,
  };
};
