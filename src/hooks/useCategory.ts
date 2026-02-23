import { apiEndpoints } from "@/lib/constants";
import fetchApi from "@/lib/fetchApi";
import {
  ApiResponse,
  CategoryTranslationResponse,
  MessageInfo,
} from "@/lib/types";

export const useCategory = () => {
  // get all categories
  const getCategory = async (): Promise<{
    success: boolean;
    data: unknown;
  }> => {
    try {
  // Request a larger page size to return more rows (backend defaults to 50 per page)
  // If the backend enforces pagination, consider using getCategories/getWideCategories with pagination params.
  const dataset = await fetchApi(`${apiEndpoints.getCategories}?limit=1000&offset=0`);

      // Type the response to handle Go server structure
      const responseData = dataset.data as {
        categories?: unknown;
        [key: string]: unknown;
      };

      return {
        success: true,
        data: responseData.categories || responseData, // Extract categories from Go server response
      };
    } catch (error) {
      console.error("Error fetching category:", error);
      return { success: false, data: [] };
    }
  };

  // get all categories
  const getCategories = async ({
    perPage = "",
    search = "",
    paginate = false,
    locale = "en",
    categoryId = "",
    status = null,
    page = null,
    sortBy = "",
    sortOrder = "",
  }: {
    perPage?: number | string;
    search?: string;
    paginate?: boolean;
    locale?: string;
    categoryId?: number | string;
    status: string | null;
    page?: number | null;
    sortBy?: string;
    sortOrder?: string;
  }): Promise<{ success: boolean; data: unknown }> => {
    // Construct query parameters dynamically
    const queryParams = new URLSearchParams({
      per_page: perPage.toString(),
      search,
      paginate: paginate.toString(),
      locale,
      category_id: categoryId.toString(),
    });

    // Only append status if it's not null
    if (status !== null) {
      queryParams.append("status", status.toString());
    }

    // Only append page if it's not null
    if (page !== null) {
      queryParams.append("page", page.toString());
    }

    // Only append sort parameters if they're not empty
    if (sortBy) {
      queryParams.append("sort_by", sortBy);
    }
    if (sortOrder) {
      queryParams.append("sort_order", sortOrder);
    }

    try {
      const dataset = await fetchApi(
        `${apiEndpoints.getWideCategories}?${queryParams.toString()}`
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

  const submitCategory = async ({
    categoryId = null,
    category,
  }: {
    categoryId?: number | null;
    category: string;
  }): Promise<ApiResponse<MessageInfo>> => {
    try {
      // Prepare the payload
      const payload = {
        name: category,
      };

      // Send the request to the backend using fetchApi
      const endpoint = categoryId
        ? apiEndpoints.category(categoryId)
        : apiEndpoints.createCategory;
      const method = categoryId ? "PUT" : "POST";

      const response = await fetchApi(endpoint, {
        method,
        body: payload,
      });

      return response as ApiResponse<MessageInfo>;
    } catch (error) {
      console.error("Error submitting category:", error);
      throw error;
    }
  };

  const getCategoryById = async (id: number) => {
    try {
      const dataset = await fetchApi(apiEndpoints.getCategoryById(id));
      return dataset;
    } catch (error) {
      console.error("Error fetching category:", error);
    }
  };

  const getCategoryTranslationById = async ({
    category_id = 0,
    locale = "",
  } = {}): Promise<
    { success: boolean; data: CategoryTranslationResponse } | undefined
  > => {
    try {
      const response = await fetchApi(
        apiEndpoints.getCategoryTranslation(category_id),
        {
          method: "GET",
          headers: {
            "Accept-Language": locale,
          },
        }
      );

      if (response && response.success && response.data) {
        return {
          success: true,
          data: response.data as CategoryTranslationResponse,
        };
      }

      return {
        success: false,
        data: { category_id: 0, count: 0, translations: [] },
      };
    } catch (error) {
      console.error("Error fetching category translation:", error);
      return undefined;
    }
  };

  const submitKeysTranslation = async ({
    locale = "bn",
    categoryId = 0,
    category,
  }: {
    locale: string;
    categoryId?: number | null;
    category: string;
  }): Promise<ApiResponse> => {
    try {
      // Prepare the payload with consistent naming
      const payload = {
        name: category,
        locale,
      };

      if (!categoryId) {
        throw new Error("Category ID is required for translation submission");
      }

      const methodType = categoryId ? "PUT" : "POST";

      // Send the request to the backend using fetchApi
      const response = await fetchApi(
        apiEndpoints.categoryTranslationById(categoryId),
        {
          method: methodType,
          body: payload,
        }
      );

      // Return the response
      return response;
    } catch (error) {
      console.error("Error submitting specifications:", error);
      throw error; // Properly propagate the error
    }
  };

  // get all categories
  const getCategoryRelBrands = async (options: {
    category_id: number;
    locale?: string;
  }) => {
    const { category_id, locale } = options;

    // Build query string based on optional parameters
    const queryParams = new URLSearchParams();
    if (category_id !== undefined) {
      queryParams.append("category_id", category_id.toString());
    }
    if (locale) {
      queryParams.append("locale", locale);
    }

    try {
      // Fetch data from the API using fetchApi
      const dataset = await fetchApi(
        `${apiEndpoints.getCategoryBrands}?${queryParams.toString()}`
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

  const categoryStatUpdate = async ({
    category_id,
    status,
  }: {
    category_id: number;
    status: number;
  }): Promise<ApiResponse> => {
    try {
      // Prepare the payload with consistent naming
      const payload = {
        status: status,
      };

      // Send the request to the backend using fetchApi
      const response = await fetchApi(
        apiEndpoints.updateCategoryStatus(category_id),
        {
          method: "PUT",
          body: payload,
        }
      );

      // Return the JSON response
      return response;
    } catch (error) {
      console.error("Error submitting specifications:", error);
      throw error; // Properly propagate the error
    }
  };

  return {
    getCategory,
    getCategories,
    submitCategory,
    getCategoryById,
    getCategoryTranslationById,
    submitKeysTranslation,
    getCategoryRelBrands,
    categoryStatUpdate,
  };
};
