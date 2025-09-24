"use client";
import useSpecificationsKeys from '@/hooks/useSpecificationsKeys';
import { SearchBoxProps, SpecificationKey } from '@/lib/types';
import useDebounce from '@/lib/useDebounce';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

const KeySearch = ({ initialSearchTerm = '' }: SearchBoxProps) => {
    const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
    const [suggestions, setSuggestions] = useState<SpecificationKey[]>([]); // Suggestions for search
    const [showSuggestions, setShowSuggestions] = useState(false); // Toggle suggestion dropdown
    const { getSpecificationsKeys } = useSpecificationsKeys()
    const debouncedSearchTerm = useDebounce({ value: searchTerm, delay: 500 });

    // Handle search input change and update suggestions
    const fetchdata = useCallback(async () => {

        // Fetch product suggestions
        if (searchTerm.length > 0) {
            try {
                const page = 1; // Default page

                // Make the getProducts call to fetch suggestions
                const response = await getSpecificationsKeys({ page, searchTerm });

                // Assuming that response.data contains products array

                if (response && response.data) {
                    setSuggestions(response.data); // Store suggestions
                    setShowSuggestions(true)
                }
            } catch (error) {
                console.error('Error fetching suggestions:', error);
            }
        } else {
            setSuggestions([]); // Clear suggestions when input is empty
        }
    }, [searchTerm, getSpecificationsKeys]);

    useEffect(() => {
        if (debouncedSearchTerm) {
            fetchdata();
        } else {
            setShowSuggestions(false)
            setSuggestions([]); // Clear suggestions when input is empty
        }
    }, [debouncedSearchTerm, fetchdata]);

    // Handle search input change and update suggestions
    const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const searchTerm = e.target.value;
        setSearchTerm(searchTerm);

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
                                className="p-2 hover:bg-gray-100 cursor-pointer">
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