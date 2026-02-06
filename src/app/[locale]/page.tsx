// src/app/products/page.tsx
import MainLayout from '@/app/components/layout/MainLayout';
import Pagination from '@/app/components/Pagination/index';
import CategoryBrands from '@/app/components/Products/CategoryBrands';
import PopularProducts from '@/app/components/Products/PopularProducts';
import ProductReview from '@/app/components/Products/ProductReview';
import SearchBox from '@/app/components/Search';
import { apiEndpoints, DEFAULT_LOCALE, OG_IMAGE_URL, SITE_NAME, SITE_URL } from '@/lib/constants';
import fetchApi from '@/lib/fetchApi';
import { Product, SearchParams } from '@/lib/types';
import { Metadata } from 'next';
import { cookies } from 'next/headers';
import { Suspense } from 'react';

// Enable Incremental Static Regeneration (ISR) - revalidate every 3600 seconds (1 hour)
export const revalidate = 3600;

// Generate metadata for the home page
export async function generateMetadata(props: {
  params: Promise<{
    locale: string;
  }>;
}): Promise<Metadata> {
  const { locale } = await props.params;

  const isEn = locale === 'en';

  return {
    title: isEn
      ? `${SITE_NAME} - Best Product Reviews & Comparisons in Bangladesh`
      : `${SITE_NAME} - বাংলাদেশে সেরা পণ্য রিভিউ এবং তুলনা`,
    description: isEn
      ? 'Read honest, detailed product reviews and comparisons for motorcycles, phones, electronics and more in Bangladesh. Find the best products with expert ratings and user feedback.'
      : 'বাংলাদেশে মোটরসাইকেল, ফোন, ইলেকট্রনিক্স এবং আরও অনেক পণ্যের সৎ এবং বিস্তারিত রিভিউ এবং তুলনা পড়ুন। বিশেষজ্ঞ রেটিং এবং ব্যবহারকারীর প্রতিক্রিয়া সহ সেরা পণ্য খুঁজে নিন।',
    keywords: isEn
      ? [
        'product reviews',
        'product comparison',
        'best products',
        'motorcycle reviews',
        'phone reviews',
        'electronics reviews',
        'Bangladesh products',
        'product ratings',
        'customer reviews',
        'product guide',
      ]
      : [
        'পণ্য রিভিউ',
        'পণ্য তুলনা',
        'সেরা পণ্য',
        'মোটরসাইকেল রিভিউ',
        'ফোন রিভিউ',
        'ইলেকট্রনিক্স রিভিউ',
        'বাংলাদেশের পণ্য',
        'পণ্য রেটিং',
        'গ্রাহক রিভিউ',
        'পণ্য গাইড',
      ],
    openGraph: {
      title: isEn
        ? `${SITE_NAME} - Best Product Reviews & Comparisons`
        : `${SITE_NAME} - সেরা পণ্য রিভিউ এবং তুলনা`,
      description: isEn
        ? 'Read honest product reviews and comparisons for Bangladesh'
        : 'বাংলাদেশের জন্য নির্ভরযোগ্য পণ্য রিভিউ এবং তুলনা পড়ুন',
      url: `${SITE_URL}/${locale}`,
      siteName: SITE_NAME,
      type: 'website',
      locale: isEn ? 'en_US' : 'bn_BD',
      images: [
        {
          url: OG_IMAGE_URL,
          width: 1200,
          height: 630,
          alt: isEn ? `${SITE_NAME} - Product Reviews` : `${SITE_NAME} - পণ্য রিভিউ`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: isEn
        ? `${SITE_NAME} - Best Product Reviews & Comparisons`
        : `${SITE_NAME} - সেরা পণ্য রিভিউ এবং তুলনা`,
      description: isEn
        ? 'Read honest product reviews and comparisons'
        : 'সৎ পণ্য রিভিউ এবং তুলনা পড়ুন',
      images: [OG_IMAGE_URL],
    },
    robots: 'index, follow',
    alternates: {
      canonical: `${SITE_URL}/${locale}`,
    },
  };
}



type ProductApiResponse = {
  data: Product[];
  meta: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
    from: number;
    to: number;
    has_next_page: boolean;
    has_prev_page: boolean;
  };
  filters: {
    locale: string;
    category: string;
    brand: string;
    price_range: string;
    search_term: string;
    sort_by: string;
  };
};
interface PageProps {
  searchParams: Promise<SearchParams>;
  params: Promise<{
    locale: string;
  }>;
}

// Server Component
const Page = async ({ searchParams, params }: PageProps) => {
  const resolvedSearchParams = await searchParams;
  const { locale } = await params;

  const page = parseInt(resolvedSearchParams.page as string, 10) || 1;
  const limit = 20;
  const activeCategory = resolvedSearchParams.category || '';
  const activeBrands = resolvedSearchParams.brand || '';
  const activePriceRange = resolvedSearchParams.price || '';
  const searchTerm = resolvedSearchParams.searchterm || '';
  const cookieStore = await cookies();
  const countryCode = cookieStore.get('country-code')?.value || locale || DEFAULT_LOCALE;
  const token = cookieStore.get("accessToken")?.value || "";

  // Fetch all data in parallel for better performance
  const [productData] = await Promise.all([
    // Main products fetch
    fetchApi<ProductApiResponse>(apiEndpoints.getProducts, {
      method: 'GET',
      accessToken: token,
      queryParams: {
        locale: countryCode,
        page: page.toString(),
        limit: limit.toString(),
        category: activeCategory,
        brand: activeBrands,
        priceRange: activePriceRange,
        search: searchTerm,
        sortby: 'popular',
      },
    }),
    // CategoryBrands and PopularProducts now fetch their own data
    // We just initiate them in parallel with the main fetch
  ]);

  const products = productData.data?.data ?? [];
  const totalProducts = productData.data?.meta?.total ?? 0;
  const totalPages = Math.ceil(totalProducts / limit);

  // Prepare sidebarProps from searchParams
  const sidebarProps = {
    activeCategory,
    selectedBrands: activeBrands,
    activePriceRange,
    searchTerm,
  };

  return (
    <MainLayout sidebarProps={sidebarProps}>
      <SearchBox initialSearchTerm={searchTerm} countryCode={countryCode} />

      <Suspense fallback={<CategoryBrandsSkeleton />}>
        <CategoryBrands categorySlug={activeCategory} countryCode={countryCode} />
      </Suspense>

      <ProductReview products={products} countryCode={countryCode} />

      <Suspense fallback={<PopularProductsSkeleton />}>
        <PopularProducts countryCode={countryCode} activeCategory={activeCategory} currentPage={page} />
      </Suspense>

      <Pagination
        currentPage={page}
        totalPages={totalPages}
      />
    </MainLayout>
  );
};

// Loading skeletons
const CategoryBrandsSkeleton = () => (
  <div className="category-brands-section my-6 animate-pulse">
    <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="h-16 bg-gray-200 rounded-lg"></div>
      ))}
    </div>
  </div>
);

const PopularProductsSkeleton = () => (
  <div className="my-8 animate-pulse">
    <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="space-y-3">
          <div className="h-48 bg-gray-200 rounded-lg"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      ))}
    </div>
  </div>
);

export default Page;
