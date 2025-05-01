const apiUrl = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL;

export async function getAProductBySlug(slug: string, locale?: string) {
  const params: Record<string, string> = {};

  if (locale) params.locale = locale;

  const queryString = new URLSearchParams(params).toString();
  const fullUrl = `${apiUrl}/products/${slug}?${queryString}`;

  if (!apiUrl) {
    throw new Error("API URL is not defined in environment variables");
  }

  try {
    const response = await fetch(fullUrl, {
      cache: "no-store", // for fresh SSR data; use 'force-cache' if it's static
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch product: ${response.statusText}`);
    }

    const dataset = await response.json();

    return {
      success: true,
      data: dataset.products,
      totalProducts: dataset.totalProducts,
    };
  } catch (error) {
    console.error("Error fetching product by slug:", error);
    return { success: false, data: [], totalProducts: 0 };
  }
}
