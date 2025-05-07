// src/app/products/page.tsx
import MainLayout from '@/app/components/layout/MainLayout';
import Pagination from '@/app/components/Pagination/index';
import PopularProducts from '@/app/components/Products/PopularProducts';
import ProductReview from '@/app/components/Products/ProductReview';
import { DEFAULT_LOCALE } from '@/lib/constants';
import fetchApi from '@/lib/fetchApi';
import { Product, SearchParams } from '@/lib/types';
import { cookies } from 'next/headers';
import { apiEndpoints } from '@/lib/constants';

type ProductApiResponse = {
  products: Product[];
  totalProducts: number;
};

// Server Component
const Page = async ({ searchParams }: { searchParams: SearchParams }) => {
  // const { getProducts } = useProducts();
  /*
    const getProductsd = async (
      page: number,
      limit: number,
      category?: string,
      brands?: string,
      priceRange?: string,
      searchTerm?: string,
      locale?: string,
      sortby?: string
    ) => {
      const params: Record<string, string> = {
        page: page.toString(),
        limit: limit.toString(),
        // _: cacheBuster.toString(), // Cache-busting parameter
      };
  
      // Add optional parameters only if they are defined
      if (category) params.category = category;
      if (brands) params.brand = brands;
      if (priceRange) params.pricerange = priceRange;
      if (searchTerm) params.searchterm = searchTerm;
      if (locale) params.locale = locale;
      if (sortby) params.sortby = sortby;
  
      // Build the query string
      // const queryString = new URLSearchParams(params).toString();
  
  
      // const fullUrl = `${fetchApi}/products?${queryString}`;
  
      try {
        const dataset = await fetchApi<ProductApiResponse>('/products', {
          method: 'GET',
          queryParams: params,
        });
  
        return dataset;
  
  
      } catch (error) {
        console.error("Error fetching products:", error);
        return { success: false, data: [] };
      }
    };
  */
  const page = parseInt(searchParams.page as string, 10) || 1;
  const limit = 20;
  const activeCategory = searchParams.category || '';
  const activeBrands = searchParams.brand || '';
  const activePriceRange = searchParams.price || '';
  const searchTerm = searchParams.searchterm || '';
  const cookieStore = await cookies();
  const countryCode = cookieStore.get('country-code')?.value || DEFAULT_LOCALE; // Default to 'en' if not found
  const token = cookieStore.get("accessToken")?.value || "";

  const fetchProductData = async (): Promise<{ products: Product[]; totalProducts: number }> => {

    const response = await fetchApi<ProductApiResponse>(apiEndpoints.getProducts, {
      method: 'GET',
      accessToken: token,
      queryParams: {
        page: page.toString(),
        limit: limit.toString(),
        category: activeCategory,
        brand: activeBrands,
        pricerange: activePriceRange,
        searchterm: searchTerm,
        locale: countryCode,
      },
    });

 return {
      products: response.data?.products ?? [],
      totalProducts: response.data?.totalProducts ?? 0,
    };
    

  };

  const dataset = await fetchProductData();
  const totalPages = 0;//Math.ceil(dataset.totalProducts / limit);

  // Prepare sidebarProps from searchParams
  const sidebarProps = {
    activeCategory,
    selectedBrands: activeBrands,
    activePriceRange,
    searchTerm,
  };

  return (
    <MainLayout sidebarProps={sidebarProps}>
      {/* <SearchBox initialSearchTerm={searchTerm} /> */}

      <ProductReview products={dataset?.products ?? []} countryCode={countryCode} />
      <PopularProducts countryCode={countryCode} />
      <Pagination
        category={activeCategory}
        selectedBrands={activeBrands}
        currentPage={page}
        totalPages={totalPages}
      />
    </MainLayout>
  );
};

// Note: `getServerSideProps` is not available in the `app/` directory, so we fetch the data directly here
export default Page;
