import PageWrapper from '@/components/layout/Wrapper';
import Pagination from '@/components/Pagination/index';
import PopularProducts from '@/components/Products/PopularProducts';
import ProductReview from '@/components/Products/ProductReview';
import SearchBox from '@/components/Search';
import { useProducts } from '@/hooks/useProducts';
import { DEFAULT_LOCALE } from "@/lib/constants";

import { cookies } from 'next/headers';
interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

// Define the type for valid locale keys
const Page = async (props: PageProps) => {

  // const Page = async ({ params }: PageProps) => {
  const searchParams = await props.searchParams;

  const { getProducts } = useProducts();

  const page = parseInt(searchParams.page as string, 10) || 1;
  const limit = 20;
  // Ensure values are strings
  const activeCategory = Array.isArray(searchParams.category)
    ? searchParams.category.join(',')
    : searchParams.category || '';

  const activeBrands = Array.isArray(searchParams.brand)
    ? searchParams.brand.join(',')
    : searchParams.brand || '';

  const activePriceRange = Array.isArray(searchParams.price)
    ? searchParams.price.join(',')
    : searchParams.price || '';
  const searchTerm = Array.isArray(searchParams.searchterm)
    ? searchParams.searchterm.join(',')
    : searchParams.searchterm || ''; const countryCode = (await cookies()).get('country-code')?.value || DEFAULT_LOCALE;; // Default to 'en' if not found

  const fetchProductData = async () => {
    const response = await getProducts(page, limit, activeCategory, activeBrands, activePriceRange, searchTerm, countryCode);
    return response.success ? response.data : { products: [], totalProducts: 0 };
  };

  const dataset = await fetchProductData();
  const totalPages = Math.ceil(dataset.totalProducts / limit);

  // Prepare sidebarProps from searchParams


  return (
    <>


      <PageWrapper >
        <SearchBox initialSearchTerm={searchTerm} />

        <ProductReview products={dataset.products} countryCode={countryCode} />
        <Pagination
          category={activeCategory}
          selectedBrands={activeBrands}
          currentPage={page}
          totalPages={totalPages}
        />
        <PopularProducts countryCode={countryCode} />
      </PageWrapper>
    </>
  );
};

export default Page;
