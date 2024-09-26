import { FC } from 'react';
import ProductReview from '@/components/Products/ProductReview';
import Pagination from '@/components/Pagination/index';
import { useProducts } from '@/hooks/useProducts';
import SearchBox from '@/components/Search';
import { SearchParams, ProductApiResponse } from '@/lib/types';
import MainLayout from '@/components/layout/MainLayout';

const Page = async ({ searchParams }: { searchParams: SearchParams }) => {
  const { getProducts } = useProducts();

  const page = parseInt(searchParams.page as string, 10) || 1;
  const limit = 10;
  const activeCategory = searchParams.category || '';
  const activeBrands = searchParams.brand || '';
  const activePriceRange = searchParams.price || '';
  const searchTerm = searchParams.searchterm || '';
  const locale = searchParams.locale || 'bn';

  const fetchProductData = async () => {
    const response = await getProducts(page, limit, activeCategory, activeBrands, activePriceRange, searchTerm, locale);
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

export default Page;
