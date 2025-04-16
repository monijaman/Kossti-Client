import MainLayout from '@/components/layout/MainLayout';
import ProducDetails from '@/components/Products/ProducDetails';
import ProductPhotosPage from '@/components/reviews/ProductPhotos';
import ReviewDetails from '@/components/reviews/ReviewDetails';
import SearchBox from '@/components/Search';
import { getAProductBySlug } from '@/lib/products';
import { cookies } from 'next/headers';
export type PageParams = {
  lang: string;
  slug: string;
  category?: string;
};

export type PageSearchParams = {
  [key: string]: string | string[] | undefined;
};

export type PageProps = {
  params: PageParams;
  searchParams: PageSearchParams;
};

// For type-checking compatibility with generated `.next/types/app/**`
export type PagePropsPromised = {
  params: Promise<PageParams>;
  searchParams: Promise<PageSearchParams>;
};

export const generateMetadata = async ({ params }: PageProps) => {
  const { slug } = params;
  return {
    title: `Product: ${slug}`,
  };
};

const Page = async ({ params, searchParams }: PageProps) => {
  const { slug, lang } = params;
  const cookieStore = await cookies();
  const countryCode = lang || cookieStore.get('country-code')?.value || 'en';
  const searchTerm = searchParams?.searchterm?.toString() || '';
  const { success, data } = await getAProductBySlug(slug, countryCode);

  if (!success || !data) return <div>Product not found.</div>;

  return (
    <MainLayout>
      <SearchBox initialSearchTerm={searchTerm} />
      <h3 className="font-semibold py-4">
        {data.name} - {data.brand} - {data.category}
      </h3>
      <ProductPhotosPage productId={data.id} />
      <ReviewDetails productId={data.id} />
      <ProducDetails product={data} />
    </MainLayout>
  );
};

export default Page;
