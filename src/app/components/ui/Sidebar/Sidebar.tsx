import BrandsListClient from '@/app/components/ui/Sidebar/BrandsClient';
import { useTranslation } from '@/hooks/useLocale';
import { SidebarParams } from '@/lib/types';
import { cookies } from 'next/headers';
import Categories from './Categories';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;


const Sidebar = async ({ activeCategory, selectedBrands, searchTerm, countryCode: propCountryCode }: SidebarParams) => {
  const cookieCode = (await cookies()).get('country-code')?.value;
  // Props from URL locale take priority over the cookie
  const countryCode = propCountryCode || cookieCode || 'bn';
  const t = useTranslation(countryCode);


  async function fetchCategories(countryCode: string) {
    if (!API_BASE_URL) {
      return [];
    }

    try {
      const queryParams = new URLSearchParams({
        per_page: '100',
        search: '',
        paginate: 'false',
        locale: countryCode,
        category_id: '',
        status: '1',
        page: ''
      });

      const fullUrl = `${API_BASE_URL}/wide-categories?${queryParams.toString()}`;
      const response = await fetch(fullUrl, { cache: 'no-store' });

      if (!response.ok) {
        // Try with /api prefix as fallback
        console.log('Trying /wide-categories...');
        const altResponse = await fetch(`${API_BASE_URL}/wide-categories?locale=${countryCode}`, { cache: 'no-store' });
        if (altResponse.ok) {
          const data = await altResponse.json();
          return data.categories || [];
        }
        throw new Error(`Both endpoints failed. Status: ${response.status}`);
      }

      const data = await response.json();
      return data.categories || [];
    } catch (error) {
      console.error('Categories fetch error:', error);
      return [];
    }
  }

  // Fetch categories data
  const categories = await fetchCategories(countryCode);


  return (
    <aside className="w-[300px] bg-gray-100 p-4">
      <Categories
        categories={categories}
        activeCategory={activeCategory}
        locale={countryCode}
        heading={t.categories_heading || 'Categories'}
        clearCategoryText={t.clear_Category}
      />
      <BrandsListClient
        selectedBrands={selectedBrands}
        activeCategory={activeCategory}
        searchTerm={searchTerm}
        countryCode={countryCode}
        brandsHeading={t.brands_heading || 'Brands'}
      />
    </aside>
  );
};

export default Sidebar;
