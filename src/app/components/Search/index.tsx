"use client";

import { useProducts } from '@/hooks/useProducts';
import { DEFAULT_LOCALE } from '@/lib/constants';
import { Product, SearchBoxProps } from '@/lib/types';
import useDebounce from '@/lib/useDebounce';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Search, X, TrendingUp } from 'lucide-react';

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
        // Only fall back to localStorage when no explicit countryCode prop was passed
        if (!countryCode || countryCode === DEFAULT_LOCALE) {
            const storedLocale = localStorage.getItem('locale');
            if (storedLocale) {
                setLocale(storedLocale);
            }
        } else {
            setLocale(countryCode);
        }
    }, [countryCode]); // re-sync when prop changes

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
        <div className="relative w-full search-container mb-8">
            {/* Search Input Container */}
            <div className="relative">
                {/* Search Icon */}
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <Search className="w-5 h-5" />
                </div>

                {/* Input Field */}
                <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    placeholder={countryCode === 'en' ? 'Search for products, brands, categories...' : 'পণ্য, ব্র্যান্ড, ক্যাটাগরি খুঁজুন...'}
                    className="w-full pl-12 pr-12 py-4 md:py-5 text-base md:text-lg border-2 border-gray-200 rounded-2xl bg-white focus:outline-none focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition-all duration-300 shadow-sm hover:shadow-md"
                />

                {/* Clear Button */}
                {searchTerm && (
                    <button
                        onClick={() => {
                            setSearchTerm('');
                            setShowSuggestions(false);
                            setSuggestions([]);
                        }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                )}
            </div>

            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-50 bg-white border-2 border-purple-100 rounded-2xl w-full mt-2 shadow-2xl overflow-hidden">
                    {/* Header */}
                    <div className="px-4 py-3 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-purple-100">
                        <div className="flex items-center gap-2 text-sm font-semibold text-purple-700">
                            <TrendingUp className="w-4 h-4" />
                            <span>{countryCode === 'en' ? 'Suggested Products' : 'প্রস্তাবিত পণ্য'}</span>
                        </div>
                    </div>

                    <ul className="max-h-96 overflow-y-auto">
                        {suggestions.map((product) => (
                            <li
                                key={product.id}
                                className="flex items-center p-4 hover:bg-purple-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors group"
                            >
                                <Link
                                    href={
                                        searchUrl
                                            ? `/${locale}/${searchUrl}/${product.id}`
                                            : `/${locale}/${product.category_slug || 'products'}/${product.slug || `product-${product.id}`}`
                                    }
                                    className="flex items-center gap-4 w-full"
                                    onClick={() => {
                                        setShowSuggestions(false);
                                    }}
                                >
                                    {/* Image */}
                                    <div className="relative w-14 h-14 flex-shrink-0 bg-gray-50 rounded-xl overflow-hidden">
                                        <Image
                                            src={product.photo || '/noimage.webp'}
                                            alt={product.name}
                                            fill
                                            className="object-contain p-1"
                                        />
                                    </div>

                                    {/* Text */}
                                    <div className="flex-1 min-w-0">
                                        <span className="text-gray-900 font-semibold block truncate group-hover:text-purple-600 transition-colors">
                                            {product.translated_name || product.name}
                                        </span>
                                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                            {product.brand?.name && (
                                                <>
                                                    <span className="truncate">{product.brand.translated_name || product.brand.name}</span>
                                                    <span className="text-gray-300">•</span>
                                                </>
                                            )}
                                            <span className="truncate">{product.category?.name}</span>
                                        </div>
                                    </div>

                                    {/* Rating */}
                                    {product.average_rating && (
                                        <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg">
                                            <span className="text-amber-500 text-sm">★</span>
                                            <span className="text-sm font-semibold text-gray-700">
                                                {product.average_rating.toFixed(1)}
                                            </span>
                                        </div>
                                    )}
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