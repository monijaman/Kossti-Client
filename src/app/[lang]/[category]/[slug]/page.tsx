import MainLayout from '@/components/layout/MainLayout';
import ProducDetails from '@/components/Products/ProducDetails';
import ProductPhotosPage from '@/components/reviews/ProductPhotos';
import ReviewDetails from '@/components/reviews/ReviewDetails';
import SearchBox from '@/components/Search';
import { useProducts } from '@/hooks/useProducts';
import { SearchParams } from '@/lib/types';
import { cookies } from 'next/headers';

interface PageProps {
  params: Promise<{
    category: string; // category parameter
    slug: string; // slug parameter
  }>;
  searchParams: Promise<SearchParams>; // or use a more specific type if needed
}

const Page = async (props: PageProps) => {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const { getAProductBySlug } = useProducts();
  const { slug } = params
  const countryCode = (await cookies()).get('country-code')?.value; // Default to 'en' if not found

  const searchTerm = searchParams.searchterm || '';

  const fetchProductData = async () => {
    const response = await getAProductBySlug(slug, countryCode);
    return response.success ? response.data : { products: [], totalProducts: 0 };
  };

  const dataset = await fetchProductData();

  return (
    <MainLayout>
      <SearchBox initialSearchTerm={searchTerm} />
      <h3 className="font-semibold py-4"> {dataset.name} - {dataset.brand} -    {dataset.category}</h3>
      <ProductPhotosPage productId={dataset.id} />
      <ReviewDetails productId={dataset.id} />
      <ProducDetails product={dataset} />
    </MainLayout>
  );
};

export default Page;

