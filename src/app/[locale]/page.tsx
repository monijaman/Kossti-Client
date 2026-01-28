// src/app/products/page.tsx
import MainLayout from '@/app/components/layout/MainLayout';
import Pagination from '@/app/components/Pagination/index';
import CategoryBrands from '@/app/components/Products/CategoryBrands';
import PopularProducts from '@/app/components/Products/PopularProducts';
import ProductReview from '@/app/components/Products/ProductReview';
import SearchBox from '@/app/components/Search';
import { apiEndpoints, DEFAULT_LOCALE, SITE_URL, SITE_NAME, OG_IMAGE_URL } from '@/lib/constants';
import fetchApi from '@/lib/fetchApi';
import { Product, SearchParams } from '@/lib/types';
import { Metadata } from 'next';

// Enable Incremental Static Regeneration (ISR) - revalidate every 60 seconds
export const revalidate = 60;
import { cookies } from 'next/headers';

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
  // const { getProducts } = useProducts();
  const resolvedSearchParams = await searchParams;
  const { locale } = await params;

  const page = parseInt(resolvedSearchParams.page as string, 10) || 1;
  const limit = 20;
  const activeCategory = resolvedSearchParams.category || '';
  const activeBrands = resolvedSearchParams.brand || '';
  const activePriceRange = resolvedSearchParams.price || '';
  const searchTerm = resolvedSearchParams.searchterm || '';
  const cookieStore = await cookies();
  const countryCode = cookieStore.get('country-code')?.value || locale || DEFAULT_LOCALE; // Use locale as fallback
  const token = cookieStore.get("accessToken")?.value || "";

  const fetchProductData = async (): Promise<{ products: Product[]; totalProducts: number }> => {

    const response = await fetchApi<ProductApiResponse>(apiEndpoints.getProducts, {
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
    });
    console.log('API Response:', response); // Debugging line to check the response structure
    // Handle Laravel-compatible response format
    return {
      products: response.data?.data ?? [], // Laravel format uses 'data' field
      totalProducts: response.data?.meta?.total ?? 0, // Laravel format uses 'meta.total'
    };


  };

  const dataset = await fetchProductData();
  const totalPages = Math.ceil(dataset.totalProducts / limit);

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
      <CategoryBrands categorySlug={activeCategory} countryCode={countryCode} />

      <ProductReview products={dataset?.products ?? []} countryCode={countryCode} />
      <PopularProducts countryCode={countryCode} activeCategory={activeCategory} currentPage={page} />
      <Pagination
        currentPage={page}
        totalPages={totalPages}
      />
    </MainLayout>
  );
};

// Note: `getServerSideProps` is not available in the `app/` directory, so we fetch the data directly here
export default Page;
