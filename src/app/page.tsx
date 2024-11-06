// src/app/products/page.tsx
import MainLayout from '@/components/layout/MainLayout';
import Pagination from '@/components/Pagination/index';
import ProductReview from '@/components/Products/ProductReview';
import SearchBox from '@/components/Search';
import { useProducts } from '@/hooks/useProducts';
import { SearchParams } from '@/lib/types';
import { headers } from 'next/headers';

interface PageProps {
  searchParams: SearchParams;
  country: string;
}

// Function to determine the country based on IP address
const getCountryFromIP = () => {
  const ip = headers().get('x-forwarded-for') || headers().get('remoteAddress') || '127.0.0.1';
  return ip
  // const geo = geoip.lookup(ip as string);
  // return geo ? geo.country : 'Unknown';
};

const Page = async ({ searchParams }: { searchParams: SearchParams }) => {
  const country = getCountryFromIP();
  const { getProducts } = useProducts();

  const page = parseInt(searchParams.page as string, 10) || 1;
  const limit = 10;
  const activeCategory = searchParams.category || '';
  const activeBrands = searchParams.brand || '';
  const activePriceRange = searchParams.price || '';
  const searchTerm = searchParams.searchterm || '';
  // const locale = searchParams.locale || (country === 'BD' ? 'bn' : 'en');
  const locale = searchParams.locale || 'bn';

  const fetchProductData = async () => {
    const response = await getProducts(page, limit, activeCategory, activeBrands, activePriceRange, searchTerm, locale);
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
    <MainLayout sidebarProps={sidebarProps}>
      <SearchBox initialSearchTerm={searchTerm} />
      <ProductReview products={dataset.products} />

      {country}
      <Pagination
        category={activeCategory}
        selectedBrands={activeBrands}
        currentPage={page}
        totalPages={totalPages}
      />
    </MainLayout>
  );
};

export default Page;
