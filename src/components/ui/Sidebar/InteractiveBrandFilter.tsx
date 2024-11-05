'use client';

import Checkbox from '@/components/ui/checkbox';
import { brandInt, SidebarParams } from '@/lib/types';
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

    return (
        <>
            <div className="mb-4">
                {dataset && dataset.map((brand: brandInt) => (
                    <div key={brand.id} className="flex items-center mb-2">

                        <Checkbox
                            key={brand.id}
                            name={brand.slug}
                            value={selected.includes(brand.slug)} // Check if the brand is selected
                            updateValue={handleBrandChange}
                            label={brand.name}
                        />

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
