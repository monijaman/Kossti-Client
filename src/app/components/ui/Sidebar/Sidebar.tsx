import BrandsListClient from '@/app/components/ui/Sidebar/BrandsClient';
import { Brand, SidebarParams } from '@/lib/types';
import { cookies } from 'next/headers';
import Categories from './Categories';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;


const Sidebar = async ({ activeCategory, selectedBrands, searchTerm }: SidebarParams) => {
  const countryCode = (await cookies()).get('country-code')?.value ?? 'en';
  const apiBaseUrl = API_BASE_URL;


  async function fetchCategories(countryCode: string) {
    if (!apiBaseUrl) {
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

      const fullUrl = `${apiBaseUrl}/wide-categories?${queryParams.toString()}`;
      const response = await fetch(fullUrl, { next: { revalidate: 300 } }); // Cache categories for 5 minutes

      if (!response.ok) {
        // Try with /api prefix as fallback
        console.log('Trying /wide-categories...');
        const altResponse = await fetch(`${apiBaseUrl}/wide-categories`);
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

  async function fetchBrandsByCategory(categorySlug?: string) {
    if (!apiBaseUrl || !categorySlug) {
      return [] as Brand[];
    }

    try {
      const response = await fetch(
        `${apiBaseUrl}/category-brands?category_slug=${categorySlug}`,
        { next: { revalidate: 300 } }
      );

      if (!response.ok) {
        return [] as Brand[];
      }

      const data = (await response.json()) as { brands?: Brand[] };
      return data.brands || [];
    } catch {
      return [] as Brand[];
    }
  }

  // Fetch categories and brands data in parallel
  const [categories, brands] = await Promise.all([
    fetchCategories(countryCode),
    fetchBrandsByCategory(activeCategory),
  ]);


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
        initialBrands={brands}
      />
    </aside>
  );
};

export default Sidebar;
