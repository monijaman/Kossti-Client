const apiUrl = process.env.NEXT_PUBLIC_API_URL + "/api/v1";

// Reusable function to fetch products
const fetchProductData = async (
  page: number,
  limit: number,
  category?: string,
  brands?: string,
  priceRange?: string,
  searchTerm?: string,
  locale?: string,
  sortby?: string
) => {
  const params: Record<string, string> = {
    page: page.toString(),
    limit: limit.toString(),
  };

  // Add optional parameters only if they are defined
  if (category) params.category = category;
  if (brands) params.brand = brands;
  if (priceRange) params.pricerange = priceRange;
  if (searchTerm) params.searchterm = searchTerm;
  if (locale) params.locale = locale;
  if (sortby) params.sortby = sortby;

  // Build the query string
  const queryString = new URLSearchParams(params).toString();

  // Ensure API URL is defined
  if (!apiUrl) {
    return Promise.reject(
      new Error("API URL is not defined in environment variables")
    );
  }

  const fullUrl = `${apiUrl}/products?${queryString}`;

  try {
    const response = await fetch(fullUrl);
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

export default fetchProductData;
