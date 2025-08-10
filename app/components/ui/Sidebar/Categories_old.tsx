"use client";

import { useTranslation } from "@/hooks/useLocale";
import { apiEndpoints, DEFAULT_LOCALE } from "@/lib/constants";
import fetchApi from "@/lib/fetchApi";
import { categoryInt } from '@/lib/types';
import { useEffect, useState } from 'react';

interface CategoriesProps {
  category?: string;
  locale: string;
}

const Categories = ({ category, locale }: CategoriesProps) => {
  const [dataset, setDataset] = useState<categoryInt[]>([]);
  const [loading, setLoading] = useState(true);

  const countryCode = locale || DEFAULT_LOCALE;
  const translation = useTranslation(countryCode);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetchApi<{ categories: categoryInt[] }>(apiEndpoints.getWideCategories, {
          queryParams: {
            perPage: 10,
            search: '',
            paginate: 'false',
            locale: countryCode,
            categoryId: '',
            status: 1
          },
        });

        const categories: categoryInt[] =
          response.success && response.data?.categories
            ? response.data.categories
            : [];

        setDataset(categories);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setDataset([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [countryCode]);

  const activeCategory = category || "";
  const clearCategoryUrl = `/`;

  if (loading) {
    return <div className="text-gray-500 text-sm">Loading categories...</div>;
  }
  return (
    <>
      <div className="mb-4">
        {dataset &&
          dataset.map((categoryItem: categoryInt, index: number) => {
            return (
              <a
                key={categoryItem.id || index}
                href={`/${countryCode}?category=${categoryItem.slug}`}
                className={`block px-3 py-2 mb-2 rounded-md cursor-pointer hover:bg-gray-100 transition duration-300 text-sm ${activeCategory === categoryItem.slug ? 'bg-blue-100 text-blue-800 border-l-4 border-blue-500' : 'text-gray-700'}`}
              >
                {categoryItem.name} {categoryItem.total ? `(${categoryItem.total})` : ''}
              </a>
            );
          })}
      </div>
      {activeCategory && (
        <a
          href={clearCategoryUrl}
          className="text-blue-500 hover:underline text-sm block mt-4"
        >
          {translation.clear_Category}
        </a>
      )}
    </>
  );
};

export default Categories;
