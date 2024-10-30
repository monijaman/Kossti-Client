import { FC } from 'react';
import Categories from './Categories';
import Brands from './Brands';
import { brandInt, SidebarParams } from '@/lib/types';

const Sidebar = async ({ activeCategory, selectedBrands, activePriceRange, searchTerm }: SidebarParams) => {

  const clearPriceRangeUrl = `/?category=${activeCategory || ''}${selectedBrands || ''}`;


  return (
    <aside className="w-[300px] bg-gray-100 p-4">

      <Categories category={activeCategory} />
      <Brands selectedBrands={selectedBrands} activeCategory={activeCategory} searchTerm={searchTerm} />
 
    </aside>
  );
};

export default Sidebar;
