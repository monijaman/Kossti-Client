import { FC } from 'react';
import ProductReview from '@/components/Products/ProductReview';
import Pagination from '@/components/Pagination/index';
import { useProducts } from '@/hooks/useProducts';
import SearchBox from '@/components/Search';
import { SearchParams, ProductApiResponse } from '@/lib/types';
import MainLayout from '@/components/layout/MainLayout';
import ProducDetails from '@/components/Products/ProducDetails';
interface PageProps {
  params: {
    category: string; // category parameter
    slug: string; // slug parameter
  };
  searchParams: SearchParams; // or use a more specific type if needed
}

const Page = async ({ params, searchParams }: PageProps) => {
  const { getAProductBySlug } = useProducts();
  const { slug, category } = params
 
  const searchTerm = searchParams.searchterm || '';
  const locale = searchParams.locale || 'bn';

  const fetchProductData = async () => {
    const response = await getAProductBySlug(slug, locale);
    return response.success ? response.data : { products: [], totalProducts: 0 };
  };

  const dataset = await fetchProductData();

 


  return (
    <MainLayout >
      <SearchBox initialSearchTerm={searchTerm} />

      <ProducDetails product={dataset} />

    </MainLayout>
  );
};

export default Page;

