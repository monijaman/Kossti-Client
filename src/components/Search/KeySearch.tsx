"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SpecificationKey, SearchBoxProps } from '@/lib/types';
import useSpecificationsKeys from '@/hooks/useSpecificationsKeys';
import Link from 'next/link';
import { combineSlices } from '@reduxjs/toolkit';

const KeySearch = ({ initialSearchTerm = '' }: SearchBoxProps) => {
    const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
    const [suggestions, setSuggestions] = useState<SpecificationKey[]>([]); // Suggestions for search
    const [showSuggestions, setShowSuggestions] = useState(false); // Toggle suggestion dropdown
    const router = useRouter();
    const { getSpecificationsKeys } = useSpecificationsKeys()




    // Handle search input change and update suggestions
    const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const searchTerm = e.target.value;
        setSearchTerm(searchTerm);

        // Fetch product suggestions
        if (searchTerm.length > 0) {
            try {
                const page = 1; // Default page

                const paginate = false;
                const locale = 'en';

                // Make the getProducts call to fetch suggestions
                const response = await getSpecificationsKeys(page, searchTerm, paginate);

                // Assuming that response.data contains products array
       
                if (response) {
                    setSuggestions(response); // Store suggestions
                    setShowSuggestions(true)
                }
            } catch (error) {
                console.error('Error fetching suggestions:', error);
            }
        } else {
            setSuggestions([]); // Clear suggestions when input is empty
        }
    };

    // Handle suggestion click
    const handleSuggestionClick = (SpecificationKey: SpecificationKey) => {
        setSearchTerm(SpecificationKey.specification_key);
        setShowSuggestions(false);
        router.push(`/?searchterm=${SpecificationKey.id}`); // Navigate based on the selected suggestion
    };

    return (
        <div className="relative w-full">
            <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search products..."
                className="border border-gray-300 p-2 w-full rounded"
            />

            {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-10 bg-white border border-gray-300 rounded w-full mt-1 shadow-lg">
                    <ul>
                        {suggestions.map((key) => (
                            <li
                                key={key.id}
                                className="p-2 hover:bg-gray-100 cursor-pointer"
                            // onClick={() => handleSuggestionClick(product)}
                            >
                                <Link href={`keys/manage/${key.id}`}>
                                    {key.specification_key}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default KeySearch;