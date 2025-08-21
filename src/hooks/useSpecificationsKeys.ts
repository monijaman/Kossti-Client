import { apiEndpoints } from "@/lib/constants";
import fetchApi from "@/lib/fetchApi";
import { ApiResponse } from "@/lib/types";

const useSpecificationsKeys = () => {
  const getSpecificationsKeys = async ({
    perPage = 10,
    searchTerm = "",
    paginate = false,
    page = 1,
  } = {}) => {
    try {
      // Calculate offset for pagination
      const limit = perPage;
      const offset = (page - 1) * limit;

      // Build query parameters
      const queryParams: Record<string, string | number> = {
        limit: limit,
        offset: offset,
      };

      // Add search if provided (we'll handle this on the server side later)
      if (searchTerm) {
        queryParams.search = searchTerm;
      }

      // Use fetchApi to call the Go server directly
      const response = await fetchApi(apiEndpoints.getSpecKeys, {
        queryParams,
      });

      if (response.success && response.data) {
        // Transform the Go server response to match expected format
        const goData = response.data as any;
        let filteredKeys = goData.specification_keys || [];

        // Client-side search filtering if needed
        if (searchTerm) {
          filteredKeys = filteredKeys.filter((key: any) =>
            key.specification_key
              .toLowerCase()
              .includes(searchTerm.toLowerCase())
          );
        }

        return {
          data: filteredKeys,
          total: filteredKeys.length,
          per_page: perPage,
          current_page: page,
        };
      } else {
        console.error("API returned error:", response.error);
        return null;
      }
    } catch (error) {
      console.error("Error fetching specification keys:", error);
      return null;
    }
  };

  const getSpecificationsKeysById = async (id: number) => {
    try {
      // Use fetchApi to call the Go server directly
      const response = await fetchApi(apiEndpoints.getSpecKeyById(id));

      if (response.success) {
        return response;
      } else {
        console.error("API returned error:", response.error);
        return { success: false, error: response.error };
      }
    } catch (error) {
      console.error("Error fetching specification key by ID:", error);
      return { success: false, error: "Failed to fetch specification key" };
    }
  };

  const getKeysTranslationById = async ({ key_id = 0, locale = "" } = {}) => {
    try {
      // Build query parameters for translation lookup
      const queryParams: Record<string, string | number> = {};
      if (key_id) queryParams.key_id = key_id;
      if (locale) queryParams.locale = locale;

      // Use fetchApi to call the Go server directly
      const response = await fetchApi(apiEndpoints.getSpecKeyTranslations, {
        queryParams,
      });

      if (response.success) {
        return response;
      } else {
        console.error("API returned error:", response.error);
        return { success: false, error: response.error };
      }
    } catch (error) {
      console.error("Error fetching key translations:", error);
      return { success: false, error: "Failed to fetch key translations" };
    }
  };

  const submitSpecificationsKeys = async ({
    speckeyId = null,
    speckey,
  }: {
    speckeyId?: number | null;
    speckey: string;
  }): Promise<ApiResponse> => {
    try {
      // Prepare the payload for the Go server
      const payload = {
        id: speckeyId || undefined, // Only include ID for updates
        specification_key: speckey,
      };

      // Use fetchApi to call the Go server directly
      const response = await fetchApi(apiEndpoints.createSpecKey, {
        method: "POST",
        body: payload,
      });

      return response;
    } catch (error) {
      console.error("Error submitting specifications:", error);
      return { success: false, error: "Failed to submit specification key" };
    }
  };
  const submitKeysTranslation = async ({
    locale = "bn",
    speckeyId = 0,
    speckey,
  }: {
    locale: string;
    speckeyId?: number | null;
    speckey: string;
  }): Promise<ApiResponse> => {
    try {
      // Prepare the payload for the Go server
      const payload = {
        specification_key_id: speckeyId,
        translated_key: speckey,
        locale,
      };

      // Use fetchApi to call the Go server directly
      const response = await fetchApi(apiEndpoints.createSpecKeyTranslation, {
        method: "POST",
        body: payload,
      });

      return response;
    } catch (error) {
      console.error("Error submitting key translation:", error);
      return { success: false, error: "Failed to submit key translation" };
    }
  };

  const deleteSpecificationKey = async (id: number): Promise<ApiResponse> => {
    try {
      // Use fetchApi to call the Go server directly
      const response = await fetchApi(apiEndpoints.removeSpec(id), {
        method: "POST", // Go server expects POST for delete
      });

      return response;
    } catch (error) {
      console.error("Error deleting specification key:", error);
      return { success: false, error: "Failed to delete specification key" };
    }
  };

  return {
    getSpecificationsKeys,
    submitKeysTranslation,
    submitSpecificationsKeys,
    getSpecificationsKeysById,
    getKeysTranslationById,
    deleteSpecificationKey,
  };
};

export default useSpecificationsKeys;
