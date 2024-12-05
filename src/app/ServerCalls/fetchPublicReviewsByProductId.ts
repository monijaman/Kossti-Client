const apiUrl = process.env.NEXT_PUBLIC_API_URL + "/api/v1"; // Update to match your API structure

const fetchPublicReviewsByProductId = async (id: number, locale?: string) => {
  const params: Record<string, string> = {};

  if (locale) params.locale = locale;

  const queryString = new URLSearchParams(params).toString();

  if (!apiUrl) {
    throw new Error("API URL is not defined in environment variables");
  }

  const fullUrl = `${apiUrl}/public-reviews/${id}/?${queryString}`;

  try {
    const response = await fetch(fullUrl); // Use `no-store` to prevent caching
    if (!response.ok) {
      throw new Error(`Failed to fetch reviews: ${response.statusText}`);
    }
    const dataset = await response.json();

    return {
      success: true,
      data: dataset.reviews,
    };
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return { success: false, data: [] };
  }
};

export default fetchPublicReviewsByProductId;
