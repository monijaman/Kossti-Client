const apiUrl = process.env.NEXT_PUBLIC_API_URL + "/api/v1"; // Update to match your API structure

interface ProductData {
  products: any[]; // Replace `any` with the actual product type
  totalProducts: number;
}

interface FetchSuccessResponse {
  success: true;
  products: any[];
  totalProducts: number;
}

interface FetchErrorResponse {
  success: false;
  products: [];
  totalProducts: 0;
}

type FetchResponse = FetchSuccessResponse | FetchErrorResponse;

const fetchProductData = async (
  page: number,
  limit: number,
  category?: string,
  brands?: string,
  priceRange?: string,
  searchTerm?: string,
  locale?: string
): Promise<FetchResponse> => {
  const params: Record<string, string> = {
    page: page.toString(),
    limit: limit.toString(),
  };

  if (category) params.category = category;
  if (brands) params.brand = brands;
  if (priceRange) params.pricerange = priceRange;
  if (searchTerm) params.searchterm = searchTerm;
  if (locale) params.locale = locale;

  const queryString = new URLSearchParams(params).toString();
  const fullUrl = `${apiUrl}/products?${queryString}`;

  try {
    const response = await fetch(fullUrl);
    const data = await response.json();

    return {
      success: true,
      products: data.products || [],
      totalProducts: data.totalProducts || 0,
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    return {
      success: false,
      products: [],
      totalProducts: 0,
    };
  }
};

export default fetchProductData;
