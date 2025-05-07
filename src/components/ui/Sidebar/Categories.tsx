'use client';

import { useCategory } from "@/hooks/useCategory";
import { getTranslation } from "@/lib/serverTranslation";
import { DEFAULT_LOCALE } from "@/lib/constants";
import { categoryInt, SearchParams } from '@/lib/types';
import { useEffect, useState } from 'react';

const Categories = ({ category }: SearchParams) => {
  const { getCategories } = useCategory();
  const [dataset, setDataset] = useState<categoryInt[]>([]);
  const [loading, setLoading] = useState(true);

  // const countryCode = (await cookies()).get('country-code')?.value || DEFAULT_LOCALE; // Default to 'en' if not found
  const countryCode = DEFAULT_LOCALE; // Default to 'en' if not found

  const translation = getTranslation(countryCode);

  useEffect(() => {
    // Fetch the category data
    const fetchCategories = async () => {
      setLoading(true);
      const response = await getCategories({
        perPage: 10,        // Number of items per page (optional)
        search: '',   // Search term (optional)
        paginate: 'false',   // 'true' or 'false' to enable/disable pagination
        locale: countryCode,        // Locale, e.g., 'en', 'bn', etc.
        categoryId: '',      // Category ID (optional, can be empty)
        status: 1            // Status filter (optional)
      });

      setDataset(response.success ? response.data.data : []);
      setLoading(false);
    };

    fetchCategories();
  }, []); // Depend on countryCode and getCategories to re-fetch if needed

  const activeCategory = category || '';
  const clearCategoryUrl = `/`;

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <h2 className="text-lg font-semibold mb-4">{translation.title}</h2>
      <div className="mb-4">
        <div className="mb-4">
          {dataset && dataset.map((category: categoryInt, index: number) => {
            return (
              <a
                key={category.id || index} // Fallback to index if category.id is undefined
                href={`/${countryCode}?category=${category.slug}`}
                className={`block px-4 py-2 rounded-md cursor-pointer hover:bg-gray-200 transition duration-300 ${activeCategory === category.slug ? 'bg-gray-300 text-gray-800' : 'bg-white text-gray-700'}`}
              >
                {category.name} ({category.total})
              </a>
            );
          })}
        </div>
      </div>
      <a
        href={clearCategoryUrl}
        className="text-blue-500 hover:underline mb-4 block"
      >
        {translation.clear_Category}
      </a>
    </>
  );
};

export default Categories;
