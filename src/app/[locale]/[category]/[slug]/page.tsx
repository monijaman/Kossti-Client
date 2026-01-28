import MainLayout from '@/app/components/layout/MainLayout';
import ProducDetails from '@/app/components/Products/ProducDetails';
import ProductPhotosPage from '@/app/components/reviews/ProductPhotos';
import ProductVideos from '@/app/components/reviews/ProductVideos';
import SimilarProducts from '@/app/components/Products/SimilarProducts';
import SearchBox from '@/app/components/Search';
import { DEFAULT_LOCALE, SITE_URL, SITE_NAME, OG_IMAGE_URL } from '@/lib/constants';
import fetchApi from '@/lib/fetchApi';
import { Product, SearchParams } from '@/lib/types';
import { cookies } from 'next/headers';
import { Metadata } from 'next';

interface PageProps {
  params: Promise<{
    category: string; // category parameter
    slug: string; // slug parameter
    locale: string;
  }>;
  searchParams: Promise<SearchParams>; // or use a more specific type if needed
}

// Generate metadata for product page
export async function generateMetadata(props: {
  params: Promise<{
    category: string;
    slug: string;
    locale: string;
  }>;
}): Promise<Metadata> {
  const { slug, locale } = await props.params;

  const isEn = locale === 'en';

  try {
    const response = await fetchApi(`/products-by-slug/${slug}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    const product: Product | null = response.success ? (response.data as Product) : null;

    if (!product) {
      return {
        title: 'Product Not Found | Kossti',
        description: 'The product you are looking for does not exist.',
      };
    }

    const productName = product.name;
    const brandName = typeof product.brand === 'object' ? product.brand.name : product.brand_slug || 'Brand';
    const categoryName = typeof product.category === 'object' ? product.category.name : 'Product';
    const image = product.photo || OG_IMAGE_URL;
    
    // Build SEO-friendly description
    const seoDescription = isEn
      ? `${productName} by ${brandName} - ${categoryName}. Read detailed review, specifications, price, pros & cons on ${SITE_NAME} Bangladesh.`
      : `${productName} ${brandName} দ্বারা - ${categoryName}। বিস্তারিত রিভিউ, স্পেসিফিকেশন, দাম এবং অন্যান্য তথ্য পড়ুন।`;

    const keywordsArray: string[] = isEn
      ? [
          productName,
          brandName,
          categoryName,
          `${productName} review`,
          `${productName} specifications`,
          `${productName} price`,
          `${brandName} ${categoryName}`,
          `best ${categoryName}`,
          'Bangladesh',
          'GoCrit',
        ]
      : [
          productName,
          brandName,
          categoryName,
          `${productName} রিভিউ`,
          `${productName} স্পেসিফিকেশন`,
          `${productName} দাম`,
          `${brandName} ${categoryName}`,
          `সেরা ${categoryName}`,
          'বাংলাদেশ',
          'গোক্রিট',
        ];

    return {
      title: `${productName} - ${brandName} ${categoryName} Review | ${SITE_NAME}`,
      description: seoDescription,
      keywords: keywordsArray,
      openGraph: {
        title: `${productName} - ${brandName} ${categoryName}`,
        description: seoDescription,
        url: `${SITE_URL}/${locale}/${product.category_slug || 'products'}/${slug}`,
        siteName: SITE_NAME,
        type: 'website',
        images: [
          {
            url: image,
            width: 600,
            height: 600,
            alt: productName,
          },
        ],
        locale: isEn ? 'en_US' : 'bn_BD',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${productName} Review | ${SITE_NAME}`,
        description: seoDescription,
        images: [image],
      },
      alternates: {
        canonical: `${SITE_URL}/${locale}/${product.category_slug || 'products'}/${slug}`,
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: `Product Review | ${SITE_NAME}`,
      description: 'Read detailed product reviews and comparisons on Kossti',
    };
  }
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

