import MainLayout from '@/components/layout/MainLayout';
import ProducDetails from '@/components/Products/ProducDetails';
import ReviewDetails from '@/components/reviews/ReviewDetails';
import SearchBox from '@/components/Search';
import { useProducts } from '@/hooks/useProducts';
import { SearchParams } from '@/lib/types';
import { cookies } from 'next/headers';


interface PageProps {
  params: {
    category: string; // category parameter
    slug: string; // slug parameter
  };
  searchParams: SearchParams; // or use a more specific type if needed
}

const Page = async ({ params, searchParams }: PageProps) => {
  const { getAProductBySlug } = useProducts();
  const { slug } = params
  const countryCode = cookies().get('country-code')?.value; // Default to 'en' if not found

  const searchTerm = searchParams.searchterm || '';

  const fetchProductData = async () => {
    const response = await getAProductBySlug(slug, countryCode);
    return response.success ? response.data : { products: [], totalProducts: 0 };
  };

  const dataset = await fetchProductData();

  return (
    <MainLayout >
      <SearchBox initialSearchTerm={searchTerm} />
      <h3 className="font-semibold py-4"> {dataset.name} - {dataset.brand} -    {dataset.category}</h3>

      <ReviewDetails productId={dataset.id} />
      <ProducDetails product={dataset} />
    </MainLayout>
  );
};

export default Page;

