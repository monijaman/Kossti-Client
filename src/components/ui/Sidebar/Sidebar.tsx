import BrandsListClient from '@/components/ui/Sidebar/BrandsClient';
import { SidebarParams } from '@/lib/types';
import { cookies } from 'next/headers';
import Categories from './Categories';

const Sidebar = async ({ activeCategory, selectedBrands, activePriceRange, searchTerm }: SidebarParams) => {

  const clearPriceRangeUrl = `/?category=${activeCategory || ''}${selectedBrands || ''}`;
  const countryCode = cookies().get('country-code')?.value || 'en'; // Default to 'en' if not found


  return (
    <aside className="w-[300px] bg-gray-100 p-4">

      <Categories category={activeCategory} locale={countryCode} />



      <BrandsListClient selectedBrands={selectedBrands} activeCategory={activeCategory} searchTerm={searchTerm} countryCode={countryCode} />


    </aside>
  );
};

export default Sidebar;
