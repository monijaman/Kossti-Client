'use client';

import { Brand, SidebarParams } from '@/lib/types';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // For pushing URL changes
import { useEffect, useRef, useState } from 'react';

interface InteractiveBrandFilterProps extends SidebarParams {
    countryCode?: string;
}

const InteractiveBrandFilter = ({ dataset, selectedBrands, activeCategory, searchTerm, countryCode = 'bn' }: InteractiveBrandFilterProps) => {
    const [selected, setSelected] = useState<string[]>(
        selectedBrands ? selectedBrands.split(',').filter(Boolean) : []
    );
    const router = useRouter();
    // Track whether the change to `selected` came from a user interaction (checkbox click)
    // vs. a prop-driven sync (category navigation). Only push URL changes for user interactions.
    const userInteracted = useRef(false);

    // Sync selected brands when selectedBrands prop changes (e.g., category navigation clears brands)
    useEffect(() => {
        userInteracted.current = false;
        setSelected(selectedBrands ? selectedBrands.split(',').filter(Boolean) : []);
    }, [selectedBrands]);

    // Update the URL only when the user manually toggles a brand checkbox
    useEffect(() => {
        if (!searchTerm && userInteracted.current) {
            const currentParams = new URLSearchParams(window.location.search);

            // Update or remove the category parameter
            if (activeCategory) {
                currentParams.set('category', activeCategory);
            } else {
                currentParams.delete('category');
            }

            // Update or remove the brand parameter based on selected items
            if (selected.length) {
                currentParams.set('brand', selected.join(','));
            } else {
                currentParams.delete('brand');
            }

            const newQueryString = `/${countryCode}?${currentParams.toString()}`;
            if (newQueryString !== `/${countryCode}?${window.location.search.replace('?', '')}`) {
                router.replace(newQueryString);
            }
        }
    }, [selected, activeCategory, router, searchTerm, countryCode]);

    const handleBrandChange = (isChecked: boolean, brandSlug: string) => {
        userInteracted.current = true;
        setSelected((prevSelected) =>
            isChecked
                ? [...prevSelected, brandSlug]
                : prevSelected.filter((slug) => slug !== brandSlug)
        );
    };

    return (
        <>
            <div className="mb-4">
                {dataset && dataset
                    .filter((brand: Brand) => brand.total && brand.total > 0)
                    .map((brand: Brand) => (
                        <div
                            key={brand.id}
                            className={`flex items-center mb-2 p-2 rounded-md cursor-pointer 
                        ${selected.includes(brand.slug || '') ? 'bg-gray-300 text-gray-800' : 'bg-white text-gray-700'}
                        hover:bg-gray-200 transition duration-300`}
                            onClick={() => handleBrandChange(!selected.includes(brand.slug ?? ''), brand.slug ?? '')}
                        >
                            {/* Circle with a more subtle background color when selected */}
                            <div
                                className={`w-5 h-5 rounded-full ${selected.includes(brand.slug || '') ? 'bg-gray-300' : 'border-2 border-gray-400'}`}

                            />
                            <span className="ml-2">{brand.translated_name || brand.name || 'Unknown Brand'} ({brand.total})</span>
                        </div>


                    ))}
            </div>

            <Link href={`/${countryCode}`} className="text-blue-500 hover:underline mb-4 block">
                Clear Brands
            </Link>
        </>
    );
};

export default InteractiveBrandFilter;
