const apiUrl = process.env.NEXT_PUBLIC_API_URL + "/api/v1";

export const getPublicSpecs = async (productId: number, locale: string) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL; // Ensure the API URL is defined in environment variables
  if (!apiUrl) {
    throw new Error("API URL is not defined in environment variables");
  }

  const apiEndpoint = `get-public-spec/${productId}?locale=${locale}`;
  const fullUrl = `${apiUrl}/${apiEndpoint}`;

  try {
    const response = await fetch(fullUrl, { cache: "no-store" }); // Disable caching for fresh data
    if (!response.ok) {
      throw new Error(`Failed to fetch specifications: ${response.statusText}`);
    }

    const dataset = await response.json();
    return { success: true, dataset };
  } catch (error) {
    console.error("Error fetching public specifications:", error);
    return { success: false, dataset: [] };
  }
};
