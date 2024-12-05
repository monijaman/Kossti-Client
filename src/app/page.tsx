// src/app/products/page.tsx
import MainLayout from '@/components/layout/MainLayout';
import Pagination from '@/components/Pagination/index';
import PopularProducts from '@/components/Products/PopularProducts';
import ProductReview from '@/components/Products/ProductReview';
import SearchBox from '@/components/Search';
import { useProducts } from '@/hooks/useProducts';
import { DEFAULT_LOCALE } from '@/lib/constants';
import { SearchParams } from '@/lib/types';
import { cookies } from 'next/headers';
// Server Component
const Page = async (props: { searchParams: Promise<SearchParams> }) => {
  const searchParams = await props.searchParams;
  const { getProducts } = useProducts();

  const page = parseInt(searchParams.page as string, 10) || 1;
  const limit = 20;
  const activeCategory = searchParams.category || '';
  const activeBrands = searchParams.brand || '';
  const activePriceRange = searchParams.price || '';
  const searchTerm = searchParams.searchterm || '';
  const countryCode = (await cookies()).get('country-code')?.value || DEFAULT_LOCALE; // Default to 'en' if not found

  const fetchProductData = async () => {
    const response = await getProducts(page, limit, activeCategory, activeBrands, activePriceRange, searchTerm, countryCode);
    return response.success ? response.data : { products: [], totalProducts: 0 };
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
      <SearchBox initialSearchTerm={searchTerm} />

      <ProductReview products={dataset.products} countryCode={countryCode} />
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
