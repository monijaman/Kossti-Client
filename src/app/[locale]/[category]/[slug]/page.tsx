import MainLayout from '@/app/components/layout/MainLayout';
import ProducDetails from '@/app/components/Products/ProducDetails';
import ProductPhotosPage from '@/app/components/reviews/ProductPhotos';
import ReviewDetails from '@/app/components/reviews/ReviewDetails';
import SearchBox from '@/app/components/Search';
import fetchApi from '@/lib/fetchApi';
import { Product, SearchParams } from '@/lib/types';

interface PageProps {
  params: Promise<{
    category: string; // category parameter
    slug: string; // slug parameter
  }>;
  searchParams: Promise<SearchParams>; // or use a more specific type if needed
}

const Page = async ({ params, searchParams }: PageProps) => {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;

  const searchTerm = resolvedSearchParams.searchterm || '';

  const fetchProductData = async () => {

    try {
      const response = await fetchApi(`/products-by-slug/${slug}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      return response.success ? response.data : null;
    } catch (error) {
      console.error('Error fetching product:', error);
      return null;
    }
  };

  const dataset = await fetchProductData() as Product | null;

  if (!dataset) {
    return (
      <MainLayout>
        <SearchBox initialSearchTerm={searchTerm} />
        <div className="text-center py-8">
          <h3 className="text-lg font-semibold">Product not found</h3>
          <p>The product you&apos;re looking for doesn&apos;t exist.</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <SearchBox initialSearchTerm={searchTerm} />
      <h3 className="font-semibold py-4">
        {dataset.name}
        {dataset.brand && ` - ${dataset.brand}`}
        {dataset.category && ` - ${dataset.category}`}
      </h3>
      <ProductPhotosPage productId={dataset.id} />
      <ReviewDetails productId={dataset.id} />
      <ProducDetails product={dataset} />
    </MainLayout>
  );
};

export default Page;

