// src/app/products/page.tsx
import MainLayout from '@/components/layout/MainLayout';
import Pagination from '@/components/Pagination/index';
import ProductReview from '@/components/Products/ProductReview';
import SearchBox from '@/components/Search';
import { useProducts } from '@/hooks/useProducts';
import { SearchParams } from '@/lib/types';
import { cookies } from 'next/headers';


// Server Component
const Page = async ({ searchParams }: { searchParams: SearchParams }) => {
  const { getProducts } = useProducts();

  const page = parseInt(searchParams.page as string, 10) || 1;
  const limit = 20;
  const activeCategory = searchParams.category || '';
  const activeBrands = searchParams.brand || '';
  const activePriceRange = searchParams.price || '';
  const searchTerm = searchParams.searchterm || '';
  const countryCode = cookies().get('country-code')?.value || 'en'; // Default to 'en' if not found

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


      <ProductReview products={dataset.products} />
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
