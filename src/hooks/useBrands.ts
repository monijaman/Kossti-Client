import { Brand } from "@/lib/types";
import { ApiResponse } from "@/lib/types";
const apiUrl = process.env.NEXT_PUBLIC_API_URL + "/api/v1";
interface CategoryOptions {
  per_page?: string;
  search?: string;
  paginate?: boolean;
}
interface AddBrandData {
  message: string;
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
    } catch (error: unknown) {
      console.error("Error fetching category:", error);

      let errorMessage = "An unknown error occurred";

      if (error instanceof Error) {
        errorMessage = error.message;
      }

      return {
        success: false,
        data: [],
        error: errorMessage,
      };
    }
  };

  const addNewBrand = async ({
    brand,
    brandId = null,
  }: {
    brand: string;
    brandId?: number | null;
  }): Promise<ApiResponse<AddBrandData>> => {
    try {
      // Prepare the payload with productId, specificationKey, and apiUrl
      const payload = {
        id: brandId, // Consistent naming with snake_case
        name: brand,
        apiUrl: "brands",
      };

      // Send the request to the backend
      const response = await fetch("/api/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // Return the JSON response
      return await response.json();
    } catch (error) {
      console.error("Error submitting specifications:", error);
      throw error; // Properly propagate the error
    }
  };

  // Submit form
  const submitBrands = async (
    categoryId: number,
    brands: Brand[]
  ): Promise<unknown> => {
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

  // get all categories
  const getCategoryRelBrands = async (options: {
    category_id?: number;
    category_slug?: string;
    locale?: string;
  }) => {
    const { category_id, category_slug, locale } = options;

    // Ensure the API URL is defined
    if (!apiUrl) {
      return Promise.reject(
        new Error("API URL is not defined in environment variables")
      );
    }

    // Build query string based on optional parameters
    const queryParams = new URLSearchParams();
    if (category_id !== undefined) {
      queryParams.append("category_id", category_id.toString());
    }
    if (category_slug) {
      queryParams.append("category_slug", category_slug.toString());
    }
    if (locale) {
      queryParams.append("locale", locale);
    }

    // Construct the full URL with query parameters
    const apiEndpoint = `category-brands`;
    const fullUrl = `${apiUrl}/${apiEndpoint}?${queryParams.toString()}`;

    try {
      // Fetch data from the API
      const response = await fetch(fullUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Check if the response is successful
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
      }

      // Parse the JSON data
      const dataset = await response.json();

      // Return success with data
      return {
        success: true,
        data: dataset,
      };
    } catch (error: unknown) {
      console.error("Error fetching category:", error);
    
      let errorMessage = "An unknown error occurred";
    
      if (error instanceof Error) {
        errorMessage = error.message;
      }
    
      return {
        success: false,
        data: [],
        error: errorMessage,
      };
    }
    
  };

  // get all categories
  const getWideBrands = async ({
    perPage = "",
    search = "",
    paginate = "false",
    locale = "en",
    brandId = "",
    status = null,
    page = null,
  }: {
    perPage?: number | string;
    search?: string;
    paginate?: "true" | "false";
    locale?: string;
    brandId?: number | string;
    status?: number | null;
    page?: number | null;
  }) => {
    // Construct query parameters dynamically
    const queryParams = new URLSearchParams({
      per_page: perPage.toString(),
      search,
      paginate,
      locale,
      brand_id: brandId.toString(),
    });

    queryParams.append("status", status !== null ? status.toString() : "");
    queryParams.append("page", page !== null ? page.toString() : "");

    if (!apiUrl) {
      return Promise.reject(
        new Error("API URL is not defined in environment variables")
      );
    }

    // Construct the full URL with the query string
    const fullUrl = `${apiUrl}/wide-brands?${queryParams.toString()}`;

    try {
      const response = await fetch(fullUrl);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const dataset = await response.json();

      return {
        success: true,
        data: dataset,
      };
    } catch (error) {
      console.error("Error fetching category:", error);
      return { success: false, data: [] };
    }
  };

  const brandStatUpdate = async ({
    brand_id,
    status,
  }: {
    brand_id: number;
    status: number;
  }): Promise<unknown> => {
    try {
      // Prepare the payload with consistent naming
      const payload = {
        status: status, // Use speckeyId as the identifier
        apiUrl: `brand-status/${brand_id}`,
      };

      // Send the request to the backend
      const response = await fetch("/api/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // Return the JSON response
      return await response.json();
    } catch (error) {
      console.error("Error submitting specifications:", error);
      throw error; // Properly propagate the error
    }
  };

  const submitBrandTranslation = async ({
    locale = "bn",
    brandId = 0,
    brand,
  }: {
    locale: string;
    brandId?: number | null;
    brand: string;
  }): Promise<ApiResponse> => {
    try {
      // Prepare the payload with consistent naming
      const payload = {
        brand_id: brandId, // Use speckeyId as the identifier
        name: brand, // Ensure this matches the key you expect on the server
        locale,
        apiUrl: "brand-translation",
      };

      // Send the request to the backend
      const response = await fetch("/api/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // Return the JSON response
      return await response.json();
    } catch (error) {
      console.error("Error submitting specifications:", error);
      throw error; // Properly propagate the error
    }
  };

  return {
    brandStatUpdate,
    getWideBrands,
    getBrands,
    getPublicBrands,
    getAllBrands,
    submitBrands,
    getCategoryRelBrands,
    addNewBrand,
    submitBrandTranslation,
  };
};
