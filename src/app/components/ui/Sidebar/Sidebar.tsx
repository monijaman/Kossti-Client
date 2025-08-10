import BrandsListClient from '@/app/components/ui/Sidebar/BrandsClient';
import { SidebarParams } from '@/lib/types';
import { cookies } from 'next/headers';
import Categories from './Categories';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

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
    const response = await fetch(fullUrl);

    if (!response.ok) {
      // Try with /api prefix as fallback
      console.log('Trying /wide-categories...');
      const altResponse = await fetch(`${API_BASE_URL}/wide-categories`);
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

const Sidebar = async ({ activeCategory, selectedBrands, searchTerm }: SidebarParams) => {
  const countryCode = (await cookies()).get('country-code')?.value ?? 'en';

  // Fetch categories data
  const categories = await fetchCategories(countryCode);

  return (
    <aside className="w-[300px] bg-gray-100 p-4">
      <Categories
        categories={categories}
        activeCategory={activeCategory}
        locale={countryCode}
        clearCategoryText="Clear Category"
      />
      <BrandsListClient
        selectedBrands={selectedBrands}
        activeCategory={activeCategory}
        searchTerm={searchTerm}
        countryCode={countryCode}
      />
    </aside>
  );
};

export default Sidebar;
