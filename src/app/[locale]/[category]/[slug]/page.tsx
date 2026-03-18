import MainLayout from '@/app/components/layout/MainLayout';
import ProducDetails from '@/app/components/Products/ProducDetails';
import SearchBox from '@/app/components/Search';
import { DEFAULT_LOCALE, OG_IMAGE_URL, SITE_NAME, SITE_URL } from '@/lib/constants';
import fetchApi from '@/lib/fetchApi';
import { Product, SearchParams } from '@/lib/types';
import { Metadata } from 'next';
import { cookies } from 'next/headers';
import { Suspense, lazy } from 'react';

// Lazy load non-critical components for better performance while keeping SEO-critical content server-rendered
const ProductVideos = lazy(() => import('@/app/components/reviews/ProductVideos'));
const SimilarProducts = lazy(() => import('@/app/components/Products/SimilarProducts'));

// Skeleton loaders for lazy components
const ProductVideosSkeleton = () => (
  <div className="mb-8">
    <h2 className="text-2xl font-bold mb-4">Product Videos</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {[1, 2].map(i => (
        <div key={i} className="h-64 bg-gradient-to-r from-gray-200 to-gray-100 animate-pulse rounded-lg"></div>
      ))}
    </div>
  </div>
);

const SimilarProductsSkeleton = () => (
  <div className="mb-8">
    <h2 className="text-2xl font-bold mb-4">Similar Products</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[1, 2, 3, 4, 5, 6].map(i => (
        <div key={i} className="h-64 bg-gradient-to-r from-gray-200 to-gray-100 animate-pulse rounded-lg"></div>
      ))}
    </div>
  </div>
);

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
        languages: {
          'en': `${SITE_URL}/en/${product.category_slug || 'products'}/${slug}`,
          'bn': `${SITE_URL}/bn/${product.category_slug || 'products'}/${slug}`,
        },
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
  // Use URL locale as primary source — cookie is only a fallback
  const countryCode = locale || cookieStore.get('country-code')?.value || DEFAULT_LOCALE;
  const resolvedSearchParams = await searchParams;

  const searchTerm = resolvedSearchParams.searchterm || '';

  const fetchProductData = async () => {

    try {
      const response = await fetchApi(`/products-by-slug/${slug}`, {
        method: 'GET',
        queryParams: { locale: countryCode },
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
      {/* JSON-LD Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: dataset.name,
            image: dataset.photo || OG_IMAGE_URL,
            description: dataset.description || `${dataset.name} review and specifications`,
            brand: {
              '@type': 'Brand',
              name: typeof dataset.brand === 'object' ? dataset.brand.name : dataset.brand_slug || 'Brand',
            },
            category: typeof dataset.category === 'object' ? dataset.category.name : 'Product',
            ...(dataset.price && {
              offers: {
                '@type': 'Offer',
                price: dataset.price,
                priceCurrency: 'BDT',
                availability: 'https://schema.org/InStock',
              },
            }),
          }),
        }}
      />

      <SearchBox initialSearchTerm={searchTerm} countryCode={countryCode} />

      {/* SEO-Critical Components - Keep Synchronous */}
      <ProducDetails product={dataset} countryCode={countryCode} />

      {/* Non-Critical Components - Lazy Load */}
      <Suspense fallback={<ProductVideosSkeleton />}>
        <ProductVideos productId={dataset.id} />
      </Suspense>

      <Suspense fallback={<SimilarProductsSkeleton />}>
        <SimilarProducts countryCode={countryCode} slug={slug} />
      </Suspense>
    </MainLayout>
  );
};

export default Page;

