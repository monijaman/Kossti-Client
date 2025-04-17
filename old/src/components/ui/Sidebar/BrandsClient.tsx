"use client"
// components/BrandsList.tsx
import InteractiveBrandFilter from '@/components/ui/Sidebar/InteractiveBrandFilter';
import { useBrands } from '@/hooks/useBrands';
import { Brand, SidebarParams } from '@/lib/types';
import { useEffect, useState } from 'react';

const BrandsListClient = ({ activeCategory, selectedBrands, searchTerm, countryCode }: SidebarParams) => {
    const { getCategoryRelBrands } = useBrands();
    const [brands, setBrands] = useState<Brand[]>();
    const fetchbrands = async () => {
        // Fetch brand data server-side

        if (activeCategory) {
            const response = await getCategoryRelBrands({
                category_id: undefined,
                category_slug: activeCategory,
                locale: countryCode,
            });

            setBrands(response.success ? response.data.data : []);
        }
    }

    useEffect(() => {
        fetchbrands();
    }, [activeCategory, countryCode])

    const categories = activeCategory || '';
    const searchterm = searchTerm || '';
    return (
        brands && brands?.length > 0 ?
            <div>
                <h2 className="text-lg font-semibold mb-4">Brands</h2>
                <InteractiveBrandFilter
                    dataset={brands}
                    selectedBrands={selectedBrands}
                    activeCategory={categories}
                    searchTerm={searchterm}
                />
            </div>
            : null
    );
};

export default BrandsListClient;
