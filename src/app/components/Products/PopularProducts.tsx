import { useTranslation } from "@/hooks/useLocale";
import { apiEndpoints } from "@/lib/constants";
import fetchApi from "@/lib/fetchApi";
import { Product } from "@/lib/types";
import ProducShortDetails from "./ProducShortDetails";
import SectionHeader from "../Home/SectionHeader";
import { TrendingUp } from "lucide-react";

interface pageProps {
  countryCode: string;
  activeCategory?: string;
  currentPage?: number;
  excludeProductIds?: number[];
}

type ProductApiResponse = {
  data: Product[];
  meta: {
    total: number;
  };
};

// Server Component - fetches data on the server
const PopularProducts = async ({ countryCode, activeCategory = '', currentPage = 1, excludeProductIds = [] }: pageProps) => {
  const translation = useTranslation(countryCode);
  const limit = 16;

  // Fetch popular products for the current page with limit=16
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
      exclude: excludeProductIds.join(','), // Exclude Latest Reviews products
    },
    next: { revalidate: 0 }, // Always fresh so priority order is up to date
  });

  // Handle API errors gracefully
  if (!response.success) {
    console.error('[PopularProducts Error] Failed to fetch popular products:', response.error);
    return (
      <section className="mb-12">
        <SectionHeader
          title={translation.popupar_product}
          icon={TrendingUp}
          gradientColor="from-purple-600 to-pink-600"
        />
        <div className="text-center py-12 bg-purple-50 rounded-2xl">
          <p className="text-gray-600">
            {countryCode === 'en' ? 'Unable to load popular products. Please try again later.' : 'জনপ্রিয় পণ্য লোড করতে অক্ষম। পরে আবার চেষ্টা করুন।'}
          </p>
        </div>
      </section>
    );
  }

  const dataset = response.data?.data ?? [];

  return (
    <section className="mb-12">
      <SectionHeader
        title={translation.popupar_product}
        subtitle={countryCode === 'en' ? 'Most viewed and highly rated products' : 'সর্বাধিক দেখা এবং উচ্চ রেটযুক্ত পণ্য'}
        icon={TrendingUp}
        gradientColor="from-purple-600 to-pink-600"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {dataset.map((product) => (
          <ProducShortDetails key={product.id} product={product} countryCode={countryCode} />
        ))}
      </div>
    </section>
  );
};

export default PopularProducts;
