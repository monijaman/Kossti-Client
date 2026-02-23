import { apiEndpoints } from "@/lib/constants";
import fetchApi from "@/lib/fetchApi";
import { ApiResponse, Brand } from "@/lib/types";
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
    try {
      const dataset = await fetchApi(apiEndpoints.getBrands);

      // Type the response to handle Go server structure
      const responseData = dataset.data as {
        brands?: unknown;
        [key: string]: unknown;
      };

      return {
        success: true,
        data: responseData.brands || responseData, // Extract brands from Go server response
      };
    } catch (error) {
      console.error("Error fetching category:-", error);
      return { success: false, data: [] };
    }
  };

  const getPublicBrands = async () => {
    try {
      const dataset = await fetchApi(apiEndpoints.getPublicBrands);

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

    // Build query string based on optional parameters
    const queryParams = new URLSearchParams();
    if (per_page !== undefined) queryParams.append("per_page", per_page);
    if (search !== undefined) queryParams.append("search", search);
    if (paginate !== undefined)
      queryParams.append("paginate", String(paginate));

    try {
      // Fetch data from the API using fetchApi
      const dataset = await fetchApi(
        `${apiEndpoints.getBrands}?${queryParams.toString()}`
      );

      // Return success with parsed body (dataset.data contains parsed JSON)
      return {
        success: true,
        data: dataset.data,
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
      // Prepare the payload
      const payload = {
        id: brandId,
        name: brand,
      };

      // Send the request to the backend using fetchApi
      const endpoint = brandId
        ? apiEndpoints.updateBrand(brandId)
        : apiEndpoints.createBrand;
      const method = brandId ? "PUT" : "POST";

      const response = await fetchApi(endpoint, {
        method,
        body: payload,
      });

      // Return the response
      return response as ApiResponse<AddBrandData>;
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
      // Prepare the payload

      const brandArrays = brands
        .map((brand) => brand.id) // Return the `id` directly
        .filter((id): id is number => id !== null) // Ensure non-null values
        .sort((a, b) => a - b); // Sort numerically

      const payload = {
        category_id: categoryId,
        brands: brandArrays,
      };

      // Send the request to the backend using fetchApi
      const response = await fetchApi(apiEndpoints.createCategoryBrands, {
        method: "POST",
        body: payload,
      });

      // Return the response
      return response;
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

    try {
      // Fetch data from the API using fetchApi
      const dataset = await fetchApi(
        `${apiEndpoints.getCategoryBrands}?${queryParams.toString()}`
      );

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
    limit = "",
    search = "",
    paginate = false,
    locale = "en",
    brandId = "",
    status = null,
    page = null,
  }: {
    limit?: number | string;
    search?: string;
    paginate?: boolean;
    locale?: string;
    brandId?: number | string;
    status?: number | null;
    page?: number | null;
  }) => {
    // Construct query parameters dynamically
    const queryParams = new URLSearchParams({
      limit: limit.toString(),
      search,
      paginate: paginate.toString(),
      locale,
      brand_id: brandId.toString(),
    });

    queryParams.append("status", status !== null ? status.toString() : "");
    queryParams.append("page", page !== null ? page.toString() : "");

    try {
      const dataset = await fetchApi(
        `${apiEndpoints.getBrands}?${queryParams.toString()}`
      );

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
        status: status,
      };

      // Send the request to the backend using fetchApi
      const response = await fetchApi(apiEndpoints.BrandStatus(brand_id), {
        method: "PUT",
        body: payload,
      });

      // Return the response
      return response;
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
        brand_id: brandId,
        name: brand,
        locale,
      };

      // Send the request to the backend using fetchApi (assuming brand-translation endpoint exists)
      const response = await fetchApi("/brand-translation", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      // Return the response
      return response;
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
