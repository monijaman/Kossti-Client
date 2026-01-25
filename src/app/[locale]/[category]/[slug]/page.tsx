import MainLayout from '@/app/components/layout/MainLayout';
import ProducDetails from '@/app/components/Products/ProducDetails';
import ProductPhotosPage from '@/app/components/reviews/ProductPhotos';
import ProductVideos from '@/app/components/reviews/ProductVideos';
import SimilarProducts from '@/app/components/Products/SimilarProducts';
import SearchBox from '@/app/components/Search';
import { DEFAULT_LOCALE } from '@/lib/constants';
import fetchApi from '@/lib/fetchApi';
import { Product, SearchParams } from '@/lib/types';
import { cookies } from 'next/headers';

interface PageProps {
  params: Promise<{
    category: string; // category parameter
    slug: string; // slug parameter
    locale: string;
  }>;
  searchParams: Promise<SearchParams>; // or use a more specific type if needed
}

const Page = async ({ params, searchParams }: PageProps) => {
  const { slug, locale } = await params;
  const cookieStore = await cookies();
  const countryCode = cookieStore.get('country-code')?.value || locale || DEFAULT_LOCALE;
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
      console.log('slugslugslug', slug);
      return response.success ? response.data : null;
    } catch (error) {
      console.error('Error fetching product:', error);
      return null;
    }
  };

  const dataset = await fetchProductData() as Product | null;

  console.log('datasetdatasetdataset', dataset);
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
        {dataset.brand && ` - ${dataset.brand_slug}`}
        {dataset.category && ` - ${dataset.category.name}`}
      </h3>
      <ProductPhotosPage productId={dataset.id} />
      <ProductVideos productId={dataset.id} />
      <ProducDetails product={dataset} countryCode={countryCode} />
      <SimilarProducts countryCode={countryCode} slug={slug} />
    </MainLayout>
  );
};

export default Page;

