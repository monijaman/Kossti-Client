import BrandsListClient from '@/app/components/ui/Sidebar/BrandsClient';
import { InArticleAd } from '@/app/components/Ads/AdUnit';
import { useTranslation } from '@/hooks/useLocale';
import { SidebarParams } from '@/lib/types';
import Categories from './Categories';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;


const Sidebar = async ({ activeCategory, selectedBrands, searchTerm, countryCode }: SidebarParams) => {
  // Use provided countryCode or fallback to 'bn'
  const locale = countryCode || 'bn';
  const t = useTranslation(locale);


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
      // Cache for 10 minutes (600 seconds) - revalidate after that time
      const response = await fetch(fullUrl, {
        next: { revalidate: 600, tags: ['categories'] }
      });

      if (!response.ok) {
        // Try with /api prefix as fallback
        console.log('Trying /wide-categories...');
        const altResponse = await fetch(`${API_BASE_URL}/wide-categories?locale=${countryCode}`, {
          next: { revalidate: 600, tags: ['categories'] }
        });
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
  const categories = await fetchCategories(locale);


  return (
    <aside className="w-full md:w-[300px] bg-gray-100 p-3 md:p-4 border-b md:border-b-0 md:border-r border-gray-300">
      <Categories
        categories={categories}
        activeCategory={activeCategory}
        locale={locale}
        heading={t.categories_heading || 'Categories'}
        clearCategoryText={t.clear_Category}
      />
      <InArticleAd className="my-4" />
      <BrandsListClient
        selectedBrands={selectedBrands}
        activeCategory={activeCategory}
        searchTerm={searchTerm}
        countryCode={locale}
        brandsHeading={t.brands_heading || 'Brands'}
      />
    </aside>
  );
};

export default Sidebar;
