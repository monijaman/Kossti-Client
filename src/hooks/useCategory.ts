const cacheBuster = new Date().getTime(); // Cache-busting parameter
const apiUrl = process.env.NEXT_PUBLIC_API_URL + "/api/v1";

export const useCategory = () => {
  // get all categories
  const getCategory = async () => {
    const apiEndpoint = `categories`;

    if (!apiUrl) {
      return Promise.reject(
        new Error("API URL is not defined in environment variables")
      );
    }

    const fullUrl = `${apiUrl}/${apiEndpoint}`;

    console.log("Fetching category URL:-", fullUrl); // Ensure this URL is correct

    try {
      const response = await fetch(fullUrl); // Adjust API endpoint
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

  // get all categories
  const getAllCategory = async () => {
    const apiEndpoint = `categories`;

    if (!apiUrl) {
      return Promise.reject(
        new Error("API URL is not defined in environment variables")
      );
    }

    const fullUrl = `${apiUrl}/${apiEndpoint}`;

    console.log("Fetching category URL:-", fullUrl); // Ensure this URL is correct

    try {
      const response = await fetch(fullUrl); // Adjust API endpoint
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

  return { getCategory, getAllCategory };
};
