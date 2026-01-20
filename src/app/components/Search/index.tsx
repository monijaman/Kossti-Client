"use client";

import { useProducts } from '@/hooks/useProducts';
import { DEFAULT_LOCALE } from '@/lib/constants';
import { Product, SearchBoxProps } from '@/lib/types';
import useDebounce from '@/lib/useDebounce';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const SearchBox = ({ initialSearchTerm = '', searchUrl = '', countryCode = DEFAULT_LOCALE }: SearchBoxProps) => {
    const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
    const [suggestions, setSuggestions] = useState<Product[]>([]); // Suggestions for search
    const [showSuggestions, setShowSuggestions] = useState(false); // Toggle suggestion dropdown
    const { getProducts } = useProducts()
    const debouncedSearchTerm = useDebounce({ value: searchTerm, delay: 500 });
    const [locale, setLocale] = useState(countryCode || DEFAULT_LOCALE); // Use countryCode prop as default
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
                if (response.success && response.data && typeof response.data === 'object' && 'products' in response.data) {
                    setSuggestions(response.data.products); // Store suggestions
                    setShowSuggestions(true)

                } else {
                    setSuggestions([]);
                    setShowSuggestions(false);
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
        <div className="relative w-full search-container">
            <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search Product"
                className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />

            {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-10 bg-white border border-gray-300 rounded-lg w-full mt-1 shadow-lg">
                    <ul>
                        {suggestions.map((product) => (
                            <li
                                key={product.id}
                                className="flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                            >
                                <Link
                                    href={
                                        searchUrl
                                            ? `/${locale}/${searchUrl}/${product.id}`
                                            : `/${locale}/${product.category_slug}/${product.slug}`
                                    }
                                    className="flex items-center space-x-4 w-full"
                                >
                                    {/* Image */}
                                    <Image
                                        src={product.photo || '/noimage.webp'}
                                        alt={product.name}
                                        width={50}
                                        height={50}
                                        className="rounded-lg object-cover"
                                    />

                                    {/* Text */}
                                    <div className="flex-1">
                                        <span className="text-gray-800 font-medium block">{product.name}</span>
                                        <span className="text-gray-600 text-sm">{product.brand?.name} • {product.category?.name}</span>
                                    </div>
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