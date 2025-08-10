import BrandsListClient from '@/app/components/ui/Sidebar/BrandsClient';
import { SidebarParams } from '@/lib/types';
import { cookies } from 'next/headers';
import Categories from './Categories';

async function fetchCategories(countryCode: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  
  if (!apiUrl) {
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

    const fullUrl = `${apiUrl}/api/wide-categories?${queryParams.toString()}`;
    const response = await fetch(fullUrl);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.categories || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
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
