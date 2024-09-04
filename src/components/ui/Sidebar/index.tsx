import { FC } from 'react';

interface SidebarProps {
  activeCategory?: string;
  activeBranch?: string;
  activePriceRange?: string;
}

const Sidebar: FC<SidebarProps> = ({ activeCategory, activeBranch, activePriceRange }) => {
  const clearCategoryUrl = `/?branch=${activeBranch || ''}${activePriceRange ? `&price=${activePriceRange}` : ''}`;
  const clearBranchUrl = `/?category=${activeCategory || ''}${activePriceRange ? `&price=${activePriceRange}` : ''}`;
  const clearPriceRangeUrl = `/?category=${activeCategory || ''}${activeBranch || ''}`;

  return (
    <aside className="w-[300px] bg-gray-100 p-4">
      <h2 className="text-lg font-semibold mb-4">Categories</h2>
      <div className="mb-4">
        <a
          href={`/?category=category1${activeBranch ? `&branch=${activeBranch}` : ''}${activePriceRange ? `&price=${activePriceRange}` : ''}`}
          className={`block px-4 py-2 rounded-md ${activeCategory === 'category1' ? 'bg-blue-100' : 'bg-gray-200'}`}
        >
          Category 1
        </a>
        <a
          href={`/?category=category2${activeBranch ? `&branch=${activeBranch}` : ''}${activePriceRange ? `&price=${activePriceRange}` : ''}`}
          className={`block px-4 py-2 rounded-md ${activeCategory === 'category2' ? 'bg-blue-100' : 'bg-gray-200'}`}
        >
          Category 2
        </a>
        <a
          href={`/?category=category3${activeBranch ? `&branch=${activeBranch}` : ''}${activePriceRange ? `&price=${activePriceRange}` : ''}`}
          className={`block px-4 py-2 rounded-md ${activeCategory === 'category3' ? 'bg-blue-100' : 'bg-gray-200'}`}
        >
          Category 3
        </a>
      </div>
      <a href={clearCategoryUrl} className="text-blue-500 hover:underline mb-4 block">
        Clear Categories
      </a>

      <h2 className="text-lg font-semibold mb-4">Branch</h2>
      <div className="mb-4">
        <a
          href={`/?branch=branch1${activeCategory ? `&category=${activeCategory}` : ''}${activePriceRange ? `&price=${activePriceRange}` : ''}`}
          className={`block px-4 py-2 rounded-md ${activeBranch === 'branch1' ? 'bg-blue-100' : 'bg-gray-200'}`}
        >
          Branch 1
        </a>
        <a
          href={`/?branch=branch2${activeCategory ? `&category=${activeCategory}` : ''}${activePriceRange ? `&price=${activePriceRange}` : ''}`}
          className={`block px-4 py-2 rounded-md ${activeBranch === 'branch2' ? 'bg-blue-100' : 'bg-gray-200'}`}
        >
          Branch 2
        </a>
        <a
          href={`/?branch=branch3${activeCategory ? `&category=${activeCategory}` : ''}${activePriceRange ? `&price=${activePriceRange}` : ''}`}
          className={`block px-4 py-2 rounded-md ${activeBranch === 'branch3' ? 'bg-blue-100' : 'bg-gray-200'}`}
        >
          Branch 3
        </a>
      </div>
      <a href={clearBranchUrl} className="text-blue-500 hover:underline mb-4 block">
        Clear Branches
      </a>

      <h2 className="text-lg font-semibold mb-4">Price Range</h2>
      <div className="mb-4">
        <a
          href={`/?price=0-50${activeCategory ? `&category=${activeCategory}` : ''}${activeBranch ? `&branch=${activeBranch}` : ''}`}
          className={`block px-4 py-2 rounded-md ${activePriceRange === '0-50' ? 'bg-blue-100' : 'bg-gray-200'}`}
        >
          $0 - $50
        </a>
        <a
          href={`/?price=51-100${activeCategory ? `&category=${activeCategory}` : ''}${activeBranch ? `&branch=${activeBranch}` : ''}`}
          className={`block px-4 py-2 rounded-md ${activePriceRange === '51-100' ? 'bg-blue-100' : 'bg-gray-200'}`}
        >
          $51 - $100
        </a>
        <a
          href={`/?price=101-200${activeCategory ? `&category=${activeCategory}` : ''}${activeBranch ? `&branch=${activeBranch}` : ''}`}
          className={`block px-4 py-2 rounded-md ${activePriceRange === '101-200' ? 'bg-blue-100' : 'bg-gray-200'}`}
        >
          $101 - $200
        </a>
        <a
          href={`/?price=200+${activeCategory ? `&category=${activeCategory}` : ''}${activeBranch ? `&branch=${activeBranch}` : ''}`}
          className={`block px-4 py-2 rounded-md ${activePriceRange === '200+' ? 'bg-blue-100' : 'bg-gray-200'}`}
        >
          $200+
        </a>
      </div>
      <a href={clearPriceRangeUrl} className="text-blue-500 hover:underline block">
        Clear Price Range
      </a>
    </aside>
  );
};

export default Sidebar;
