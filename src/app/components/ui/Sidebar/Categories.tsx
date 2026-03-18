import { categoryInt } from '@/lib/types';
import Link from 'next/link';

interface CategoriesProps {
  categories: categoryInt[];
  activeCategory?: string;
  locale: string;
  clearCategoryText: string;
  heading?: string;
}

const Categories = ({ categories, activeCategory, locale, clearCategoryText, heading = 'Categories' }: CategoriesProps) => {
  const clearCategoryUrl = `/${locale}`;

  return (
    <>
      <h2 className="text-lg font-semibold mb-4">{heading}</h2>
      <div className="mb-4">
        <div className="mb-4">
          {categories &&
            categories.map((categoryItem: categoryInt, index: number) => {
              return (
                <Link
                  key={categoryItem.id || index}
                  href={`/${locale}?category=${categoryItem.slug}`}
                  className={`block px-4 py-2 rounded-md cursor-pointer hover:bg-gray-200 transition duration-300 ${activeCategory === categoryItem.slug ? 'bg-gray-300 text-gray-800' : 'bg-white text-gray-700'}`}
                >
                  {categoryItem.translated_name || categoryItem.name} ({categoryItem.total || 0})
                </Link>
              );
            })}
        </div>
      </div>
      <Link
        href={clearCategoryUrl}
        className="text-blue-500 hover:underline mb-4 block"
      >
        {clearCategoryText}
      </Link>
    </>
  );
};

export default Categories;
