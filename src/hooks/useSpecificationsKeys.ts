const cacheBuster = new Date().getTime(); // Cache-busting parameter
const apiUrl = process.env.NEXT_PUBLIC_API_URL + "/api/v1";

const useSpecificationsKeys = () => {
  const getSpecificationsKeys = async ({
    perPage = 10,
    searchTerm = "",
    paginate = false,
    page = 1,
  } = {}) => {
    // Construct query parameters
    const params = new URLSearchParams({
      action: "speckey",
      search: searchTerm,
      per_page: perPage.toString(),
      paginate: paginate.toString(),
      page: page.toString(),
    });

    // Define the API endpoint
    const apiEndpoint = `/api/get?${params.toString()}`;

    try {
      // Fetch data with 'no-store' cache policy to avoid cached responses
      const response = await fetch(apiEndpoint, { cache: "no-store" });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Parse and return JSON response data
      const dataset = await response.json();
      return dataset.data;
    } catch (error) {
      console.error("Error fetching specification keys:", error);
      return null; // Return null in case of an error
    }
  };

  const getSpecificationsKeysById = async (id: number) => {
    const apiEndpoint = `?action=speckey/${id}`;

    try {
      const response = await fetch(`/api/get${apiEndpoint}`); // Adjust API endpoint

      const dataset = await response.json();
      return dataset;
    } catch (error) {
      console.error("Error fetching campaigns:", error);
    }
  };

  const getKeysTranslationById = async ({ key_id = 0, locale = "" } = {}) => {
    const params = new URLSearchParams({
      action: "speckey-translation",
      locale,
      key_id: key_id.toString(), // Convert number to string
    });

    // Define the API endpoint
    const apiEndpoint = `/api/get?${params.toString()}`;

    try {
      const response = await fetch(apiEndpoint, { cache: "no-store" }); // Adjust API endpoint

      const dataset = await response.json();
      return dataset;
    } catch (error) {
      console.error("Error fetching campaigns:", error);
    }
  };

  const submitSpecificationsKeys = async ({
    speckeyId = null,
    speckey,
  }: {
    speckeyId?: number | null;
    speckey: string;
  }): Promise<any> => {
    try {
      // Prepare the payload with productId, specificationKey, and apiUrl
      const payload = {
        id: speckeyId, // Consistent naming with snake_case
        specification_key: speckey,
        apiUrl: "speckey",
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
  const submitKeysTranslation = async ({
    locale = "bn",
    speckeyId = 0,
    speckey,
  }: {
    locale: string;
    speckeyId?: number | null;
    speckey: string;
  }): Promise<any> => {
    try {
      // Prepare the payload with consistent naming
      const payload = {
        specification_key_id: speckeyId, // Use speckeyId as the identifier
        translated_key: speckey, // Ensure this matches the key you expect on the server
        locale,
        apiUrl: "speckey-translation",
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
    getSpecificationsKeys,
    submitKeysTranslation,
    submitSpecificationsKeys,
    getSpecificationsKeysById,
    getKeysTranslationById,
  };
};

export default useSpecificationsKeys;
