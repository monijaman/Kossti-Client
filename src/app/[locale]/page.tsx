// src/app/products/page.tsx
import MainLayout from '@/app/components/layout/MainLayout';
import Pagination from '@/app/components/Pagination/index';
import CategoryBrands from '@/app/components/Products/CategoryBrands';
import PopularProducts from '@/app/components/Products/PopularProducts';
import ProductReview from '@/app/components/Products/ProductReview';
import SearchBox from '@/app/components/Search';
import { apiEndpoints, DEFAULT_LOCALE } from '@/lib/constants';
import fetchApi from '@/lib/fetchApi';
import { Product, SearchParams } from '@/lib/types';
import { cookies } from 'next/headers';
import { Suspense } from 'react';

// Enable Incremental Static Regeneration (ISR) - revalidate every 60 seconds
export const revalidate = 60;

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
  const resolvedSearchParams = await searchParams;
  const { locale } = await params;

  const page = parseInt(resolvedSearchParams.page as string, 10) || 1;
  const limit = 20;
  const activeCategory = resolvedSearchParams.category || '';
  const activeBrands = resolvedSearchParams.brand || '';
  const activePriceRange = resolvedSearchParams.price || '';
  const searchTerm = resolvedSearchParams.searchterm || '';
  const cookieStore = await cookies();
  const countryCode = cookieStore.get('country-code')?.value || locale || DEFAULT_LOCALE;
  const token = cookieStore.get("accessToken")?.value || "";

  // Fetch all data in parallel for better performance
  const [productData] = await Promise.all([
    // Main products fetch
    fetchApi<ProductApiResponse>(apiEndpoints.getProducts, {
      method: 'GET',
      accessToken: token,
      queryParams: {
        locale: countryCode,
        page: page.toString(),
        limit: limit.toString(),
        category: activeCategory,
        brand: activeBrands,
        priceRange: activePriceRange,
        search: searchTerm,
        sortby: 'popular',
      },
    }),
    // CategoryBrands and PopularProducts now fetch their own data
    // We just initiate them in parallel with the main fetch
  ]);

  const products = productData.data?.data ?? [];
  const totalProducts = productData.data?.meta?.total ?? 0;
  const totalPages = Math.ceil(totalProducts / limit);

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

      <Suspense fallback={<CategoryBrandsSkeleton />}>
        <CategoryBrands categorySlug={activeCategory} countryCode={countryCode} />
      </Suspense>

      <ProductReview products={products} countryCode={countryCode} />

      <Suspense fallback={<PopularProductsSkeleton />}>
        <PopularProducts countryCode={countryCode} activeCategory={activeCategory} currentPage={page} />
      </Suspense>

      <Pagination
        currentPage={page}
        totalPages={totalPages}
      />
    </MainLayout>
  );
};

// Loading skeletons for better UX
const CategoryBrandsSkeleton = () => (
  <div className="category-brands-section my-6 animate-pulse">
    <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="h-16 bg-gray-200 rounded-lg"></div>
      ))}
    </div>
  </div>
);

const PopularProductsSkeleton = () => (
  <div className="my-8 animate-pulse">
    <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="space-y-3">
          <div className="h-48 bg-gray-200 rounded-lg"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      ))}
    </div>
  </div>
);

// Note: `getServerSideProps` is not available in the `app/` directory, so we fetch the data directly here
export default Page;
