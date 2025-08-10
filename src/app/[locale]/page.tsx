// src/app/products/page.tsx
import MainLayout from '@/app/components/layout/MainLayout';
import Pagination from '@/app/components/Pagination/index';
import PopularProducts from '@/app/components/Products/PopularProducts';
import ProductReview from '@/app/components/Products/ProductReview';
import { apiEndpoints, DEFAULT_LOCALE } from '@/lib/constants';
import fetchApi from '@/lib/fetchApi';
import { Product, SearchParams } from '@/lib/types';
import { cookies } from 'next/headers';

type ProductApiResponse = {
  products: Product[];
  totalProducts: number;
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
        page: page.toString(),
        limit: limit.toString(),
        category: activeCategory,
        brand: activeBrands,
        pricerange: activePriceRange,
        searchterm: searchTerm,
        locale: countryCode,
      },
    });

    return {
      products: response.data?.products ?? [],
      totalProducts: response.data?.totalProducts ?? 0,
    };


  };

  const dataset = await fetchProductData();
  const totalPages = 0;//Math.ceil(dataset.totalProducts / limit);

  // Prepare sidebarProps from searchParams
  const sidebarProps = {
    activeCategory,
    selectedBrands: activeBrands,
    activePriceRange,
    searchTerm,
  };

  return (
    <MainLayout sidebarProps={sidebarProps}>
      {/* <SearchBox initialSearchTerm={searchTerm} /> */}

      <ProductReview products={dataset?.products ?? []} countryCode={countryCode} />
      <PopularProducts countryCode={countryCode} />
      <Pagination
        category={activeCategory}
        selectedBrands={activeBrands}
        currentPage={page}
        totalPages={totalPages}
      />
    </MainLayout>
  );
};

// Note: `getServerSideProps` is not available in the `app/` directory, so we fetch the data directly here
export default Page;
