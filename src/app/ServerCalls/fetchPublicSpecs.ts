const apiUrl = process.env.NEXT_PUBLIC_API_URL + "/api/v1"; // Replace with your API structure

const fetchPublicSpecs = async (productId: number, locale: string) => {
  const apiEndpoint = `get-public-spec/${productId}?locale=${locale}`;
  if (!apiUrl) {
    throw new Error("API URL is not defined in environment variables");
  }

  const fullUrl = `${apiUrl}/${apiEndpoint}`;

  try {
    const response = await fetch(fullUrl, { cache: "no-store" }); // Use `no-store` for fresh data
    if (!response.ok) {
      throw new Error(`Failed to fetch specifications: ${response.statusText}`);
    }
    const dataset = await response.json();

    return {
      success: true,
      ...dataset,
    };
  } catch (error) {
    console.error("Error fetching specifications:", error);
    return { success: false, dataset: [] };
  }
};

export default fetchPublicSpecs;
