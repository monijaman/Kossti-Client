"use client"
// components/BrandsList.tsx
import InteractiveBrandFilter from '@/components/ui/Sidebar/InteractiveBrandFilter';
import { useBrands } from '@/hooks/useBrands';
import { useTranslation } from "@/hooks/useLocale";
import { DEFAULT_LOCALE } from '@/lib/constants';
import { Brand, SidebarParams } from '@/lib/types';
import { useEffect, useState } from 'react';

const BrandsListClient = ({ activeCategory, selectedBrands, searchTerm, countryCode }: SidebarParams) => {
    const { getCategoryRelBrands } = useBrands();
    const [brands, setBrands] = useState<Brand[]>();
    const translation = useTranslation(countryCode ?? DEFAULT_LOCALE);

    const fetchbrands = async () => {
        // Fetch brand data server-side
        const response = await getCategoryRelBrands({
            category_id: undefined,
            category_slug: activeCategory,
            locale: countryCode,
        });

        setBrands(response.success ? response.data.data : []);

    }

    useEffect(() => {
        fetchbrands();
    }, [activeCategory, countryCode])

    const categories = activeCategory || '';
    const searchterm = searchTerm || '';
    return (
        brands && brands?.length > 0 ?
            <div>
                <h2 className="text-lg font-semibold mb-4">{translation.brand}</h2>
                <InteractiveBrandFilter
                    dataset={brands}
                    selectedBrands={selectedBrands}
                    activeCategory={categories}
                    searchTerm={searchterm}
                    countryCode={countryCode}
                />
            </div>
            : null
    );
};

export default BrandsListClient;
