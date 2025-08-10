import { useCategory } from "@/hooks/useCategory";
import { useTranslation } from "@/hooks/useLocale";
import { DEFAULT_LOCALE } from "@/lib/constants";
import { categoryInt } from '@/lib/types';
import { cookies } from 'next/headers';

interface CategoriesProps {
  category?: string;
  locale: string;
}

const Categories = async ({ category, locale }: CategoriesProps) => {
  const { getCategories } = useCategory();
  const countryCode = locale || DEFAULT_LOCALE;
  const translation = useTranslation(countryCode);

  // Fetch the category data using the async function
  const response = await getCategories({
    perPage: 10,        // Number of items per page (optional)
    search: '',   // Search term (optional)
    paginate: 'false',   // 'true' or 'false' to enable/disable pagination
    locale: countryCode,        // Locale, e.g., 'en', 'bn', etc.
    categoryId: '',      // Category ID (optional, can be empty)
    status: 1            // Status filter (optional)
  });

  const dataset = response.success ? response.data.categories : [];

  // Handle undefined searchParams with a default empty string
  const activeCategory = category || "";
  const clearCategoryUrl = `/`;

  return (
    <>
      <h2 className="text-lg font-semibold mb-4">{translation.category}</h2>
      <div className="mb-4">
        <div className="mb-4">
          {dataset &&
            dataset.map((categoryItem: categoryInt, index: number) => {
              return (
                <a
                  key={categoryItem.id || index} // Fallback to index if category.id is undefined
                  href={`/${countryCode}?category=${categoryItem.slug}`}
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
        {translation.clear_category}
      </a>
    </>
  );
};

export default Categories;
