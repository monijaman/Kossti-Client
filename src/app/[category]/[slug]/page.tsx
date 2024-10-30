import { FC } from 'react';
import ProductReview from '@/components/Products/ProductReview';
import Pagination from '@/components/Pagination/index';
import { useProducts } from '@/hooks/useProducts';
import SearchBox from '@/components/Search';
import { SearchParams, ProductApiResponse } from '@/lib/types';
import MainLayout from '@/components/layout/MainLayout';

interface PageProps {
  params: {
    category: string; // category parameter
    slug: string; // slug parameter
  };
  searchParams: SearchParams; // or use a more specific type if needed
}

const Page = async ({ params, searchParams }: PageProps) => {
  const { getProducts } = useProducts();
  const { slug, category } = params
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
      <h2>{category} - {slug}</h2>

    </MainLayout>
  );
};

export default Page;

 