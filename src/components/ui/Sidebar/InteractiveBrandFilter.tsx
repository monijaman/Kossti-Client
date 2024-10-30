'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // For pushing URL changes
import { brandInt, SidebarParams } from '@/lib/types';
import Checkbox from '@/components/ui/checkbox';
const InteractiveBrandFilter = ({ dataset, selectedBrands, activeCategory, searchTerm }: SidebarParams) => {


    const [selected, setSelected] = useState<string[]>([]);
    const router = useRouter();

    // useEffect(() => {
    //     if (selectedBrands) {
    //         setSelected(selectedBrands.split(','));
    //     }
    // }, [selectedBrands]);


    // const [checkboxes, setCheckboxes] = useState<{ [key: string]: boolean }>([]);



    const [checkboxes, setCheckboxes] = useState<{ [key: string]: boolean }>({
        brandBox: false, // Initialize with a checkbox state
    });




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


    // Update function to handle checkbox state change
    const updateCheckboxValue = (newValue: boolean, name: string) => {

        setCheckboxes((prevCheckboxes) => ({
            ...prevCheckboxes,
            [name]: newValue,
        }));
    };

    const handleBrandChanges = (brandSlug: string) => {

        setSelected((prevSelected) =>
            prevSelected.includes(brandSlug)
                ? prevSelected.filter((slug) => slug !== brandSlug)
                : [...prevSelected, brandSlug]
        );
    };


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
                        {/* <Checkbox
                            name={`brand`}
                            checked={selected.includes(brand.slug)} // Use slug to match the selected brands
                            onChange={() => handleBrandChange(brand.slug)}
                            className="mr-2"
                        /> */}
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
                Clear Categories
            </a>
        </>
    );
};

export default InteractiveBrandFilter;
