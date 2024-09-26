'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // For pushing URL changes
import { brandInt, SidebarParams } from '@/lib/types';

const InteractiveBrandFilter = ({ dataset, selectedBrands, activeCategory, searchTerm }: SidebarParams) => {
    const [selected, setSelected] = useState<string[]>(selectedBrands ? selectedBrands.split(',') : []);
    const router = useRouter();

    const handleBrandChange = (brandSlug: string) => {
        setSelected((prevSelected) =>
            prevSelected.includes(brandSlug)
                ? prevSelected.filter((slug) => slug !== brandSlug)
                : [...prevSelected, brandSlug]
        );
    };

    // Update the URL whenever the selected brands change
    useEffect(() => {
        if (!searchTerm) {
            // Construct the query string based on conditions
            let queryString = '/?'; // Start the query string
            const currentParams = new URLSearchParams(window.location.search); // Get current query parameters

            // Add category if it's available
            if (activeCategory) {
                queryString += `category=${activeCategory}`;
                currentParams.set('category', activeCategory);
            }

            // Add brands if selected and check if they differ from the current URL
            if (selected.length) {
                const currentBrands = currentParams.get('brand')?.split(',') || [];
                const newBrands = selected;

                // Only update the brands if there is a difference
                if (JSON.stringify(newBrands.sort()) !== JSON.stringify(currentBrands.sort())) {
                    // If the category is already present, add '&' before the brand
                    queryString += `${activeCategory ? '&' : ''}brand=${newBrands.join(',')}`;
                }
            }

            // Push the updated URL to the browser history only if there are changes
            if (queryString !== '/?') {
                router.push(queryString);
            }
        }
    }, [selected, activeCategory, router, searchTerm]);

    return (
        <>
            <div className="mb-4">
                {dataset && dataset.map((brand: brandInt) => (
                    <div key={brand.id} className="flex items-center mb-2">
                        <input
                            type="checkbox"
                            id={`brand-${brand.id}`}
                            checked={selected.includes(brand.slug)} // Use slug to match the selected brands
                            onChange={() => handleBrandChange(brand.slug)}
                            className="mr-2"
                        />
                        <label htmlFor={`brand-${brand.id}`} className="cursor-pointer">
                            {brand.name}
                        </label>
                    </div>
                ))}
            </div>

            <a href="/" className="text-blue-500 hover:underline mb-4 block">
                Clear Categories
            </a>
        </>
    );
};

export default InteractiveBrandFilter;
