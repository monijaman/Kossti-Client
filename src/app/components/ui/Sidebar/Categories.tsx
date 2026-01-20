import { categoryInt } from '@/lib/types';

interface CategoriesProps {
  categories: categoryInt[];
  activeCategory?: string;
  locale: string;
  clearCategoryText: string;
}

const Categories = ({ categories, activeCategory, locale, clearCategoryText }: CategoriesProps) => {
  const getCurrentQueryString = () => {
    // Preserve other query parameters when selecting a category
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      params.delete('page'); // Reset to page 1 when changing category
      return params.toString() ? `&${params.toString()}` : '';
    }
    return '';
  };

  const clearCategoryUrl = `/${locale}`;
  // console.log('Categories:', categories);
  return (
    <>
      <h2 className="text-lg font-semibold mb-4">Categories</h2>
      <div className="mb-4">
        <div className="mb-4">
          {categories &&
            categories.map((categoryItem: categoryInt, index: number) => {
              return (
                <a
                  key={categoryItem.id || index} // Fallback to index if category.id is undefined
                  href={`/${locale}?category=${categoryItem.slug}`}
                  className={`block px-4 py-2 rounded-md cursor-pointer hover:bg-gray-200 transition duration-300 ${activeCategory === categoryItem.slug ? 'bg-gray-300 text-gray-800' : 'bg-white text-gray-700'}`}
                >
                  {categoryItem.name}
                </a>
              );
            })}
        </div>
      </div>
      <a
        href={clearCategoryUrl}
        className="text-blue-500 hover:underline mb-4 block"
      >
        {clearCategoryText}
      </a>
    </>
  );
};

export default Categories;
