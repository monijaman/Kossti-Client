import fetchProductBySlug from '@/app/ServerCalls/fetchProductBySlug';
import PageWrapper from '@/components/layout/Wrapper';
import ProducDetails from '@/components/Products/ProducDetails';
import ProductPhotosPage from '@/components/reviews/ProductPhotos';
import ReviewDetails from '@/components/reviews/ReviewDetails';
import SearchBox from '@/components/Search';
import { cookies } from 'next/headers';

interface PageProps {
  params: Promise<{
    category: string; // category parameter
    slug: string; // slug parameter
  }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

const Page = async (props: PageProps) => {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const { slug } = params
  const countryCode = (await cookies()).get('country-code')?.value; // Default to 'en' if not found


  // Fetch product data
  const dataset = await fetchProductBySlug(slug, countryCode);
  const searchTerm =
    Array.isArray(searchParams.searchterm)
      ? searchParams.searchterm.join(',') // Convert array to a comma-separated string
      : searchParams.searchterm || ''; // Use string directly or fallback to an empty string
  return (
    <PageWrapper searchParams={searchParams}>
      <SearchBox initialSearchTerm={searchTerm} />
      <h3 className="font-semibold py-4"> {dataset.name} - {dataset.brand} -    {dataset.category}</h3>
      <ProductPhotosPage productId={dataset.id} />
      <ReviewDetails productId={dataset.id} />
      <ProducDetails product={dataset} />
    </PageWrapper>
  );
};

export default Page;

