import { apiEndpoints } from "@/lib/constants";
import fetchApi from "@/lib/fetchApi";
import { ApiResponse, SpecificationKey } from "@/lib/types";

// Define interfaces for Go server responses
interface GoSpecKeysResponse {
  specification_keys: SpecificationKey[];
  count: number;
  total: number;
  returned: number;
  limit: number;
  offset: number;
}

const useSpecificationsKeys = () => {
  const getSpecificationsKeys = async ({
    perPage = 10,
    searchTerm = "",
    page = 1,
  } = {}) => {
    try {
      // Use server-side search and pagination for all cases
      const limit = perPage;
      const offset = (page - 1) * limit;

      const queryParams: Record<string, string | number> = {
        limit: limit,
        offset: offset,
      };

      // Add search parameter if provided
      if (searchTerm) {
        queryParams.search = searchTerm;
      }

      const response = await fetchApi(apiEndpoints.getSpecKeys, {
        queryParams: queryParams,
      });

      if (response.success && response.data) {
        const goData = response.data as GoSpecKeysResponse;
        const keys = goData.specification_keys || [];

        return {
          data: keys,
          total: goData.total || keys.length, // Use server total count
          per_page: perPage,
          current_page: page,
        };
      }

      console.error("API returned no data");
      return null;
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
