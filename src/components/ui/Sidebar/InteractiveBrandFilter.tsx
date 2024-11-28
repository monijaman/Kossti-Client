'use client';

import { Brand, SidebarParams } from '@/lib/types';
import { useRouter } from 'next/navigation'; // For pushing URL changes
import { useEffect, useState } from 'react';
const InteractiveBrandFilter = ({ dataset, selectedBrands, activeCategory, searchTerm }: SidebarParams) => {
    const [selected, setSelected] = useState<string[]>([]);
    const router = useRouter();
    // Update the URL whenever the selected brands change
    useEffect(() => {
        if (!searchTerm) {
            const currentParams = new URLSearchParams(window.location.search); // Get current query parameters

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
            // Generate the new query string
            const newQueryString = `/?${currentParams.toString()}`;

            // Only update the URL if there is a real change
            if (newQueryString !== `/?${window.location.search}`) {
                router.replace(newQueryString); // Use replace to avoid looping
            }
        }
    }, [selected, activeCategory, router, searchTerm]);

    const handleBrandChange = (isChecked: boolean, brandSlug: string) => {
        setSelected((prevSelected) =>
            isChecked
                ? [...prevSelected, brandSlug]
                : prevSelected.filter((slug) => slug !== brandSlug)
        );
    };



    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const brandQuery = params.get('brand'); // Get brand query parameter

        if (brandQuery) {
            setSelected(brandQuery.split(',')); // Set selected brands
        }
    }, []); // Run once on component mount



    return (
        <>

            <div className="mb-4">
                {dataset && dataset.map((brand: Brand) => (
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
                        <span className="ml-2">{brand.name || 'Unknown Brand'}</span>
                    </div>


                ))}
            </div>

            <a href="/" className="text-blue-500 hover:underline mb-4 block">
                Clear Brands
            </a>
        </>
    );
};

export default InteractiveBrandFilter;
