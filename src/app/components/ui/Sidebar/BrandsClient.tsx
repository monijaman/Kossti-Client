"use client"
// components/BrandsList.tsx
import InteractiveBrandFilter from '@/app/components/ui/Sidebar/InteractiveBrandFilter';
import { useBrands } from '@/hooks/useBrands';
import { Brand, SidebarParams } from '@/lib/types';
import { useEffect, useState } from 'react';

const BrandsListClient = ({ activeCategory, selectedBrands, searchTerm, countryCode, initialBrands }: SidebarParams) => {
    const { getCategoryRelBrands } = useBrands();
    const [brands, setBrands] = useState<Brand[]>(initialBrands || []);

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
                    // API returns: fetchApi wraps as { success, status, data: { brands: [...] } }
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const raw = response.data as any;
                    const brandList: Brand[] =
                        Array.isArray(raw) ? raw :
                        Array.isArray(raw?.brands) ? raw.brands :
                        Array.isArray(raw?.data?.brands) ? raw.data.brands :
                        Array.isArray(raw?.data) ? raw.data :
                        [];
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
