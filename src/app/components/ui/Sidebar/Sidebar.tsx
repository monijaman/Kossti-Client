"use client";

import BrandsListClient from '@/app/components/ui/Sidebar/BrandsClient';
import { InArticleAd } from '@/app/components/Ads/AdUnit';
import { useTranslation } from '@/hooks/useLocale';
import { categoryInt, SidebarParams } from '@/lib/types';
import { useEffect, useState } from 'react';
import Categories from './Categories';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;


const Sidebar = ({ activeCategory, selectedBrands, searchTerm, countryCode }: SidebarParams) => {
  // Use provided countryCode or fallback to 'bn'
  const locale = countryCode || 'bn';
  const t = useTranslation(locale);
  const [categories, setCategories] = useState<categoryInt[]>([]);


  useEffect(() => {
    let cancelled = false;

    const fetchCategories = async () => {
      if (!API_BASE_URL) {
        setCategories([]);
        return;
      }

      try {
        const queryParams = new URLSearchParams({
          per_page: '100',
          search: '',
          paginate: 'false',
          locale,
          category_id: '',
          status: '1',
          page: ''
        });

        const fullUrl = `${API_BASE_URL}/wide-categories?${queryParams.toString()}`;
        const response = await fetch(fullUrl);

        if (!response.ok) {
          const altResponse = await fetch(`${API_BASE_URL}/wide-categories?locale=${locale}`);
          if (altResponse.ok) {
            const data = await altResponse.json();
            if (!cancelled) {
              setCategories(data.categories || []);
            }
            return;
          }
          throw new Error(`Both endpoints failed. Status: ${response.status}`);
        }

        const data = await response.json();
        if (!cancelled) {
          setCategories(data.categories || []);
        }
      } catch (error) {
        console.error('Categories fetch error:', error);
        if (!cancelled) {
          setCategories([]);
        }
      }
    };

    fetchCategories();
    return () => {
      cancelled = true;
    };
  }, [locale]);


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
