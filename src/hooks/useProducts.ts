const cacheBuster = new Date().getTime(); // Cache-busting parameter
const apiUrl = process.env.NEXT_PUBLIC_API_URL + "/api/v1";

export const useProducts = () => {
  const getProducts = async (
    page: number,
    productsPerPage: number,
    category?: string,
    branch?: string,
    priceRange?: string
  ) => {
    const params: Record<string, string> = {
      page: page.toString(),
      productsPerPage: productsPerPage.toString(),
    };

    if (category) params.category = category;
    if (branch) params.branch = branch;
    if (priceRange) params.priceRange = priceRange;

    const queryString = new URLSearchParams(params).toString();
    // const apiEndpoint = `api/get?action=products&${queryString}`;

    const apiEndpoint = `products?page=${page}&productsPerPage=${productsPerPage}&category=${category}&branch=${branch}&priceRange=${priceRange}&_=${cacheBuster}`;
    // const apiEndpoint = `/api/v1/products?page=1&productsPerPage=10&category=&branch=&priceRange=`;

    if (!apiUrl) {
      return Promise.reject(
        new Error("API URL is not defined in environment variables")
      );
    }

    const fullUrl = `${apiUrl}/${apiEndpoint}`;

    console.log("Fetching URL:", fullUrl); // Ensure this URL is correct

    try {
      const response = await fetch(fullUrl); // Adjust API endpoint
      const dataset = await response.json();

      return {
        success: true,
        data: dataset,
        totalProducts: dataset.totalProducts,
      };
    } catch (error) {
      console.error("Error fetching products:", error);
      return { success: false, data: [] };
    }
  };

  return { getProducts };
};
