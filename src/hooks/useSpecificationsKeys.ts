const cacheBuster = new Date().getTime(); // Cache-busting parameter
const apiUrl = process.env.NEXT_PUBLIC_API_URL + "/api/v1";
import { SpecificationInt, SpecificationKey } from "@/lib/types"; // Assuming you have a Product type
import { SpecKeyTranslation, ReviewTranslation } from "@/lib/types";

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

      // Check if the response is successful
      // if (!response.ok) {
      //   throw new Error(`Error: ${response.statusText}`);
      // }

      // Return the JSON response
      return await response.json();
    } catch (error) {
      console.error("Error submitting specifications:", error);
      throw error; // Properly propagate the error
    }
  };

  return {
    getSpecificationsKeys,
    submitSpecificationsKeys,
    getSpecificationsKeysById,
  };
};

export default useSpecificationsKeys;
