import { cookies } from 'next/headers';
import MainLayout from '@/components/layout/MainLayout';
import Pagination from '@/components/Pagination/index';
import PopularProducts from '@/components/Products/PopularProducts';
import ProductReview from '@/components/Products/ProductReview';
import SearchBox from '@/components/Search';
import { DEFAULT_LOCALE } from '@/lib/constants';
import fetchApi from '@/lib/fetchApiCall';
import { Product, SearchParams } from '@/lib/types';

type ProductApiResponse = {
  products: Product[];
  totalProducts: number;
};

// Server Component
const Page = async ({ searchParams }: { searchParams: Promise<SearchParams> }) => {
  // const { getProducts } = useProducts();

  const getProducts = async (
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


  const {page, category, brand, price, searchterm} = await searchParams;

  const actuvepage = parseInt(page as string, 10) || 1;
  const limit = 20;
  const activeCategory = category || '';
  const activeBrands = brand || '';
  const activePriceRange = price || '';
  const searchTerm = searchterm || '';
  const cookieStore = await cookies();
  const countryCode = cookieStore.get('country-code')?.value || DEFAULT_LOCALE; // Default to 'en' if not found

  const fetchProductData = async () => {
    const response = await getProducts(actuvepage, limit, activeCategory, activeBrands, activePriceRange, searchTerm, countryCode);
    return { products: [], totalProducts: 0 };
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
      <SearchBox initialSearchTerm={searchTerm} />

      <ProductReview products={dataset?.products} countryCode={countryCode} />
      <PopularProducts countryCode={countryCode} />
      <Pagination
        category={activeCategory}
        selectedBrands={activeBrands}
        currentPage={actuvepage}
        totalPages={totalPages}
      />
    </MainLayout>
  );
};

// Note: `getServerSideProps` is not available in the `app/` directory, so we fetch the data directly here
export default Page;
