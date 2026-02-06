import { useTranslation } from "@/hooks/useLocale";
import { apiEndpoints } from "@/lib/constants";
import fetchApi from "@/lib/fetchApi";
import { Product } from "@/lib/types";
import ProducShortDetails from "./ProducShortDetails";

interface pageProps {
  countryCode: string;
  activeCategory?: string;
  currentPage?: number;
}

type ProductApiResponse = {
  data: Product[];
  meta: {
    total: number;
  };
};

// Server Component - fetches data on the server
const PopularProducts = async ({ countryCode, activeCategory = '', currentPage = 1 }: pageProps) => {
  const translation = useTranslation(countryCode);
  const limit = 16;

  // Fetch data on the server
  const response = await fetchApi<ProductApiResponse>(apiEndpoints.getProducts, {
    method: 'GET',
    queryParams: {
      locale: countryCode,
      page: currentPage.toString(),
      limit: limit.toString(),
      category: activeCategory,
      brand: '',
      priceRange: '',
      search: '',
      sortby: 'popular',
    },
    next: { revalidate: 60 }, // Cache for 60 seconds
  });

  const dataset = response.data?.data ?? [];

  return (
    <>
      <h2 className="page-title text-2xl font-bold text-gray-800 mb-6 mt-8">
        {translation.popupar_product}
        {activeCategory && (
          <span className="text-base font-normal text-gray-600 block mt-2">
            Category: {activeCategory}
          </span>
        )}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {dataset.map((product) => (
          <ProducShortDetails key={product.id} product={product} countryCode={countryCode} />
        ))}
      </div>
    </>
  );
};

export default PopularProducts;
