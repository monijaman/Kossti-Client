import { apiEndpoints } from "@/lib/constants";
import fetchApi from "@/lib/fetchApi";
import { ApiResponse, MessageInfo } from "@/lib/types";

export const useCategory = () => {
  // get all categories
  const getCategory = async () => {
    try {
      const dataset = await fetchApi(apiEndpoints.getCategories);

      return {
        success: true,
        data: dataset,
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
    paginate = "false",
    locale = "en",
    categoryId = "",
    status = null,
    page = null,
  }: {
    perPage?: number | string;
    search?: string;
    paginate?: "true" | "false";
    locale?: string;
    categoryId?: number | string;
    status?: number | null;
    page?: number | null;
  }) => {
    // Construct query parameters dynamically
    const queryParams = new URLSearchParams({
      per_page: perPage.toString(),
      search,
      paginate,
      locale,
      category_id: categoryId.toString(),
    });

    queryParams.append("status", status !== null ? status.toString() : "");
    queryParams.append("page", page !== null ? page.toString() : "");

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
        id: categoryId,
        name: category,
      };

      // Send the request to the backend using fetchApi
      const endpoint = categoryId
        ? apiEndpoints.updateCategory(categoryId)
        : apiEndpoints.createCategory;
      const method = categoryId ? "PUT" : "POST";

      const response = await fetchApi(endpoint, {
        method,
        body: JSON.stringify(payload),
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
  } = {}) => {
    try {
      const dataset = await fetchApi(
        apiEndpoints.getCategoryTranslation(category_id),
        {
          method: "GET",
          headers: {
            "Accept-Language": locale,
          },
        }
      );

      return dataset;
    } catch (error) {
      console.error("Error fetching category translation:", error);
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
        category_id: categoryId,
        name: category,
        locale,
      };

      // Send the request to the backend using fetchApi
      const response = await fetchApi(apiEndpoints.createCategoryTranslation, {
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
          body: JSON.stringify(payload),
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
