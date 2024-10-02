import { FC } from 'react';
import { SearchParams, ProductApiResponse, Product } from '@/lib/types';
import { useProducts } from '@/hooks/useProducts';
import MainLayout from '@/components/layout/MainLayout';
import ProductReview from '@/components/Products/ProductReview';
import Pagination from '@/components/Pagination/index';
import SearchBox from '@/components/Search';
import ProducDetails from '@/components/Products/ProducDetails';
interface PageProps {
  params: {
    slug: string; // Type for the slug
  };
  searchParams: SearchParams; // Include searchParams
}


const Page = async ({ params, searchParams }: PageProps) => {

  // const Page = async ({ params }: PageProps) => {
  const { slug } = params;

  const { getAProductBySlug } = useProducts()
console.log(3333333333);
  
  const activeCategory = searchParams.category || '';
  const activeBrands = searchParams.brand || '';
  const activePriceRange = searchParams.price || '';
  const searchTerm = searchParams.searchterm || '';
  const locale = searchParams.locale || 'bn';

  // Prepare sidebarProps from searchParams
  const sidebarProps = {
    activeCategory,
    selectedBrands: activeBrands,
    activePriceRange,
    searchTerm,
  };

  // Mock function to fetch product data
  const fetchProductData = async () => {
    const response = await getAProductBySlug(slug, locale);
  
    if (!response.success) {
      throw new Error('Failed to fetch product data');
    }
  
    // Ensure response.data exists and has at least one item
    const product = Array.isArray(response.data) && response.data.length > 0 ? response.data[0] : null;
  
    if (!product) {
      throw new Error('No product found');
    }
  
    return product;
  };
  

  // Fetch product data based on the slug
  const productData: Product = await fetchProductData(); // Notice the array type here
 
  return (
    <MainLayout sidebarProps={sidebarProps}>
      <SearchBox initialSearchTerm={searchTerm} />
      <ProducDetails product={productData} />

    </MainLayout>

  );
};

export default Page;
