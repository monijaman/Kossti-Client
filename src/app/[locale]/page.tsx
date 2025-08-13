// src/app/products/page.tsx
import MainLayout from '@/app/components/layout/MainLayout';
import Pagination from '@/app/components/Pagination/index';
import PopularProducts from '@/app/components/Products/PopularProducts';
import ProductReview from '@/app/components/Products/ProductReview';
import SearchBox from '@/app/components/Search';
import { apiEndpoints, DEFAULT_LOCALE } from '@/lib/constants';
import fetchApi from '@/lib/fetchApi';
import { Product, SearchParams } from '@/lib/types';
import { cookies } from 'next/headers';

type ProductApiResponse = {
  data: Product[];
  meta: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
    from: number;
    to: number;
    has_next_page: boolean;
    has_prev_page: boolean;
  };
  filters: {
    locale: string;
    category: string;
    brand: string;
    price_range: string;
    search_term: string;
    sort_by: string;
  };
};
interface PageProps {
  searchParams: Promise<SearchParams>;
  params: Promise<{
    locale: string;
  }>;
}

// Server Component
const Page = async ({ searchParams, params }: PageProps) => {
  // const { getProducts } = useProducts();
  const resolvedSearchParams = await searchParams;
  const { locale } = await params;

  const page = parseInt(resolvedSearchParams.page as string, 10) || 1;
  const limit = 20;
  const activeCategory = resolvedSearchParams.category || '';
  const activeBrands = resolvedSearchParams.brand || '';
  const activePriceRange = resolvedSearchParams.price || '';
  const searchTerm = resolvedSearchParams.searchterm || '';
  const cookieStore = await cookies();
  const countryCode = cookieStore.get('country-code')?.value || locale || DEFAULT_LOCALE; // Use locale as fallback
  const token = cookieStore.get("accessToken")?.value || "";

  const fetchProductData = async (): Promise<{ products: Product[]; totalProducts: number }> => {

    const response = await fetchApi<ProductApiResponse>(apiEndpoints.getProducts, {
      method: 'GET',
      accessToken: token,
      queryParams: {
        locale: countryCode,
        page: page.toString(),
        limit: limit.toString(),
        category: activeCategory,
        brand: activeBrands,
        priceRange: activePriceRange,
        searchterm: searchTerm,
        sortby: '', // Add sorting if needed
      },
    });
    console.log('API Response:', response); // Debugging line to check the response structure
    // Handle Laravel-compatible response format
    return {
      products: response.data?.data ?? [], // Laravel format uses 'data' field
      totalProducts: response.data?.meta?.total ?? 0, // Laravel format uses 'meta.total'
    };


  };

  const dataset = await fetchProductData();
  const totalPages = Math.ceil(dataset.totalProducts / limit);

  // Prepare sidebarProps from searchParams
  const sidebarProps = {
    activeCategory,
    selectedBrands: activeBrands,
    activePriceRange,
    searchTerm,
  };

  return (
    <MainLayout sidebarProps={sidebarProps}>
      <SearchBox initialSearchTerm={searchTerm} countryCode={countryCode} />

      <ProductReview products={dataset?.products ?? []} countryCode={countryCode} />
      <PopularProducts countryCode={countryCode} />
      <Pagination
        currentPage={page}
        totalPages={totalPages}
      />
    </MainLayout>
  );
};

// Note: `getServerSideProps` is not available in the `app/` directory, so we fetch the data directly here
export default Page;
