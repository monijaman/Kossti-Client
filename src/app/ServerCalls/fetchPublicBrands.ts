// src/api/brands.ts
const apiUrl = process.env.NEXT_PUBLIC_API_URL + "/api/v1"; // Update to match your API structure

export const getPublicBrands = async () => {
  if (!apiUrl) {
    return Promise.reject(
      new Error("API URL is not defined in environment variables")
    );
  }

  const apiEndpoint = `public-brands`;
  const fullUrl = `${apiUrl}/${apiEndpoint}`;

  try {
    const response = await fetch(fullUrl);

    if (!response.ok) {
      throw new Error(`Failed to fetch brands: ${response.statusText}`);
    }

    const dataset = await response.json();

    return {
      success: true,
      data: dataset,
    };
  } catch (error) {
    console.error("Error fetching brands:", error);
    return {
      success: false,
      data: [],
    };
  }
};
