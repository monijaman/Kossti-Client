const apiUrl = process.env.NEXT_PUBLIC_API_URL + "/api/v1"; // Replace with your actual API URL

const fetchProductBySlug = async (slug: string, locale?: string) => {
  const params: Record<string, string> = {};

  // Add optional parameters only if they are defined
  if (locale) params.locale = locale;

  // Build the query string
  const queryString = new URLSearchParams(params).toString();

  // Ensure API URL is defined
  if (!apiUrl) {
    throw new Error("API URL is not defined in environment variables");
  }

  const fullUrl = `${apiUrl}/products/${slug}?${queryString}`;

  try {
    const response = await fetch(fullUrl, { cache: "no-store" }); // Prevent caching for fresh data
    if (!response.ok) {
      throw new Error(`Failed to fetch product: ${response.statusText}`);
    }
    const dataset = await response.json();
    return dataset;
  } catch (error) {
    console.error("Error fetching product by slug:", error);
    return {};
  }
};

export default fetchProductBySlug;
