"use client";

import { useProducts } from '@/hooks/useProducts';
import { DEFAULT_LOCALE } from '@/lib/constants';
import { Product, SearchBoxProps } from '@/lib/types';
import useDebounce from '@/lib/useDebounce';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
const SearchBox = ({ initialSearchTerm = '', searchUrl = '' }: SearchBoxProps) => {
    const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
    const [suggestions, setSuggestions] = useState<Product[]>([]); // Suggestions for search
    const [showSuggestions, setShowSuggestions] = useState(false); // Toggle suggestion dropdown
    const { getProducts } = useProducts()
    const debouncedSearchTerm = useDebounce({ value: searchTerm, delay: 500 });
    const [locale, setLocale] = useState(DEFAULT_LOCALE); // Initialize with default locale
    useEffect(() => {
        if (debouncedSearchTerm) {
            fetchData();
        } else {
            setShowSuggestions(false)
            setSuggestions([]); // Clear suggestions when input is empty
        }
    }, [debouncedSearchTerm]);

    useEffect(() => {
        // Safely access localStorage on the client side
        const storedLocale = localStorage.getItem('locale');
        if (storedLocale) {
            setLocale(storedLocale);
        }
    }, []); // Run only on component mount



    // Handle search input change and update suggestions
    const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const searchTag = e.target.value;
        setSearchTerm(searchTag)

    };


    // Handle search input change and update suggestions
    const fetchData = async () => {

        // Fetch product suggestions
        if (debouncedSearchTerm) {
            try {
                const page = 1; // Default page
                const productsPerPage = 5; // Limit number of suggestions
                const activeCategory = '';
                const activeBrands = '';
                const activePriceRange = '';

                // Make the getProducts call to fetch suggestions
                const response = await getProducts(page, productsPerPage, activeCategory, activeBrands, activePriceRange, debouncedSearchTerm, locale);

                // Assuming that response.data contains products array
                if (response.success && response.data) {
                    setSuggestions(response.data.products); // Store suggestions
                    setShowSuggestions(true)

                }
            } catch (error) {
                console.error('Error fetching suggestions:', error);
            }
        } else {

            setShowSuggestions(false)
            setSuggestions([]); // Clear suggestions when input is empty
        }
    };


    return (
        <div className="relative w-full pb-4">
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
                        {suggestions.map((product) => (
                            <li
                                key={product.id}
                                className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
                            >
                                <Link
                                    href={
                                        searchUrl
                                            ? `/${locale}/${searchUrl}/${product.id}`
                                            : `/${locale}/${product.category_slug}/${product.slug}`
                                    }
                                    className="flex items-center space-x-4"
                                >
                                    {/* Image */}
                                    <Image
                                        src={product.photo}
                                        alt={product.name}
                                        width={50}
                                        height={50}
                                        className="rounded"
                                    />

                                    {/* Text */}
                                    <span className="text-gray-800 font-medium">{product.name}</span>
                                    <span className="text-gray-800 font-medium">{product.brand}</span>
                                    <span className="text-gray-800 font-medium">{product.category}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>

                </div>
            )}
        </div>
    );
};

export default SearchBox;