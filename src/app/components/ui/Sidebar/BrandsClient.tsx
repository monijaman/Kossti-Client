"use client"
// components/BrandsList.tsx
import InteractiveBrandFilter from '@/app/components/ui/Sidebar/InteractiveBrandFilter';
import { useBrands } from '@/hooks/useBrands';
import { Brand, SidebarParams } from '@/lib/types';
import { useEffect, useState } from 'react';

const BrandsListClient = ({ activeCategory, selectedBrands, searchTerm, countryCode }: SidebarParams) => {
    const { getCategoryRelBrands } = useBrands();
    const [brands, setBrands] = useState<Brand[]>([]);

    useEffect(() => {
        const fetchbrands = async () => {
            // Fetch brand data server-side

            if (activeCategory) {
                const response = await getCategoryRelBrands({
                    category_id: undefined,
                    category_slug: activeCategory,
                    locale: countryCode,
                });

                if (response.success && response.data) {
                    const data = response.data as { data?: Brand[] } | Brand[];
                    const brandList = Array.isArray(data) ? data : (data.data || []);
                    setBrands(brandList);
                } else {
                    setBrands([]);
                }
            }
        };

        fetchbrands();
    }, [activeCategory, countryCode])

    const categories = activeCategory || '';
    const searchterm = searchTerm || '';
    return (
        brands.length > 0 ? (
            <div>
                <h2 className="text-lg font-semibold mb-4">Brands</h2>
                <InteractiveBrandFilter
                    dataset={brands}
                    selectedBrands={selectedBrands}
                    activeCategory={categories}
                    searchTerm={searchterm}
                />
            </div>
        ) : null
    );
};

export default BrandsListClient;
