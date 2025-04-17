import MainLayout from '@/components/layout/MainLayout';
import ProducDetails from '@/components/Products/ProducDetails';
import ProductPhotosPage from '@/components/reviews/ProductPhotos';
import ReviewDetails from '@/components/reviews/ReviewDetails';
import SearchBox from '@/components/Search';
import { getAProductBySlug } from '@/lib/products';
import { cookies } from 'next/headers';

type PageParams = {
  lang: string;
  slug: string;
  category?: string;
};

type PageSearchParams = {
  [key: string]: string | string[] | undefined;
};

// 🟩 Only `generateMetadata` should use promised arguments
export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<PageParams>;
  searchParams: Promise<PageSearchParams>;
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  return {
    title: `Viewing ${resolvedParams.slug}`,
  };
}

// 🟩 Your Page function gets resolved values, not Promises
export default async function Page({
  params,
  searchParams,
}: {
  params: PageParams;
  searchParams: PageSearchParams;
}) {
  const { slug, lang } = params;

  const cookieStore = await cookies();
  const countryCode = lang || cookieStore.get('country-code')?.value || 'en';
  const searchTerm = searchParams?.searchterm?.toString() || '';

  const { success, data } = await getAProductBySlug(slug, countryCode);

  if (!success || !data) {
    return <div>Product not found.</div>;
  }

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
}
