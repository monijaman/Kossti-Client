const cacheBuster = new Date().getTime(); // Cache-busting parameter
const apiUrl = process.env.NEXT_PUBLIC_API_URL + "/api/v1";
import { SpecificationInt, SpecificationKey } from "@/lib/types"; // Assuming you have a Product type
import { SpecKeyTranslation, ReviewTranslation } from "@/lib/types";

const useSpecificationsKeys = () => {
  
  const getSpecificationsKeys = async (per_page = 10, serachTem = "", paginate=false) => {
    const apiEndpoint = `?action=speckey&search=${serachTem}&per_page=${per_page}&paginate=${paginate}`;

    try {
      const response = await fetch(`/api/get${apiEndpoint}`, { cache: 'no-store' }); // Adjust API endpoint
      const dataset = await response.json();
 
      return dataset.data;
    } catch (error) {
      console.error("Error fetching campaigns:", error);
    }
  };

   

  const submitSpecificationsKeys = async (
    productId: number,
    specification_key: string,
  ): Promise<any> => {
    try {
      // Prepare the payload with productId, specifications, and apiUrl
      const payload = {
        id:productId,
        specification_key,
        apiUrl: "speckey",
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
    getSpecificationsKeys,
    submitSpecificationsKeys,
  };
};

export default useSpecificationsKeys;
