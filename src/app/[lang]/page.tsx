import MainLayout from '@/components/layout/MainLayout';
import Pagination from '@/components/Pagination/index';
import PopularProducts from '@/components/Products/PopularProducts';
import ProductReview from '@/components/Products/ProductReview';
import SearchBox from '@/components/Search';
import { useProducts } from '@/hooks/useProducts';
import { DEFAULT_LOCALE } from '@/lib/constants';
import { SearchParams } from "@/lib/types";
import { cookies } from 'next/headers';
interface PageProps {
  params: {
    lang: string; // Type for the slug
  },
  searchParams: SearchParams
}

// Define the type for valid locale keys
const Page = async ({ searchParams, params }: PageProps) => {

  // const Page = async ({ params }: PageProps) => {
  const { lang } = params;


  const { getProducts } = useProducts();

  const page = parseInt(searchParams.page as string, 10) || 1;
  const limit = 20;
  const activeCategory = searchParams.category || '';
  const activeBrands = searchParams.brand || '';
  const activePriceRange = searchParams.price || '';
  const searchTerm = searchParams.searchterm || '';
  const countryCode = cookies().get('country-code')?.value || DEFAULT_LOCALE; // Default to 'en' if not found

  const fetchProductData = async () => {
    const response = await getProducts(page, limit, activeCategory, activeBrands, activePriceRange, searchTerm, countryCode);
    return response.success ? response.data : { products: [], totalProducts: 0 };
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
    <>


      <MainLayout sidebarProps={sidebarProps}>
        <SearchBox initialSearchTerm={searchTerm} countryCode={countryCode} />

        <ProductReview products={dataset.products} countryCode={countryCode} />
        <Pagination
          category={activeCategory}
          selectedBrands={activeBrands}
          currentPage={page}
          totalPages={totalPages}
        />
        <PopularProducts countryCode={countryCode} />
      </MainLayout>
    </>
  );
};

export default Page;
