const apiUrl = process.env.NEXT_PUBLIC_API_URL + "/api/v1";

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

  return { getBrands, getPublicBrands };
};
