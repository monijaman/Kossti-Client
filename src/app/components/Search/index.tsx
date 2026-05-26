"use client";

import { useProducts } from '@/hooks/useProducts';
import { DEFAULT_LOCALE } from '@/lib/constants';
import { Product, SearchBoxProps } from '@/lib/types';
import useDebounce from '@/lib/useDebounce';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Search, X, TrendingUp } from 'lucide-react';

const SuggestionThumbnail = ({ src, alt }: { src?: string; alt: string }) => {
    const [imageSrc, setImageSrc] = useState(src && src.trim() ? src : '/noimage.webp');

    useEffect(() => {
        setImageSrc(src && src.trim() ? src : '/noimage.webp');
    }, [src]);

    return (
        <div className="relative h-[72px] w-[72px] min-w-[72px] flex-shrink-0 overflow-hidden rounded-2xl border border-kossti-cream bg-kossti-cream-light shadow-sm">
            <Image
                src={imageSrc}
                alt={alt}
                fill
                unoptimized
                onError={() => setImageSrc('/noimage.webp')}
                className="object-contain p-2.5"
            />
        </div>
    );
};

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
        <div className="relative w-full search-container text-left">
            {/* Search Input Container */}
            <label
                htmlFor="search-input"
                className="flex min-h-[72px] items-center overflow-hidden rounded-2xl border border-kossti-cream bg-white text-left shadow-[0_12px_30px_rgba(61,40,23,0.08)] transition-shadow focus-within:shadow-[0_16px_36px_rgba(61,40,23,0.12)] cursor-text"
            >
                <input
                    id="search-input"
                    type="text"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    placeholder={countryCode === 'en' ? 'I am looking for...' : 'পণ্য, ব্র্যান্ড, ক্যাটাগরি খুঁজুন...'}
                    className="flex-1 self-stretch px-5 py-4 text-left text-base leading-6 text-gray-700 placeholder:text-gray-400 focus:outline-none md:px-6 md:py-5 md:text-lg"
                />

                {searchTerm && (
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            setSearchTerm('');
                            setShowSuggestions(false);
                            setSuggestions([]);
                        }}
                        className="px-3 text-gray-400 hover:text-kossti-dark transition-colors shrink-0"
                    >
                        <X className="w-5 h-5" />
                    </button>
                )}

                <button
                    type="button"
                    onClick={() => {}}
                    className="flex shrink-0 items-center justify-center self-stretch border-l border-kossti-cream px-5 py-4 transition-colors md:px-6 md:py-5"
                    style={{ backgroundColor: '#3d2817' }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#5a3d2e')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#3d2817')}
                >
                    <Search className="w-5 h-5 text-white" />
                </button>
            </label>

            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-50 mt-3 w-full overflow-hidden rounded-[22px] border border-kossti-cream bg-white shadow-[0_24px_60px_rgba(61,40,23,0.14)]">
                    {/* Header */}
                    <div className="border-b border-kossti-cream bg-kossti-cream-light px-4 py-3 text-left md:px-5">
                        <div className="flex items-center gap-2 text-sm font-semibold text-kossti-dark">
                            <TrendingUp className="w-4 h-4" />
                            <span>{countryCode === 'en' ? 'Suggested Products' : 'প্রস্তাবিত পণ্য'}</span>
                        </div>
                    </div>

                    <ul className="max-h-[420px] overflow-y-auto">
                        {suggestions.map((product) => (
                            <li
                                key={product.id}
                                className="border-b border-gray-100 last:border-b-0"
                            >
                                <Link
                                    href={
                                        searchUrl
                                            ? `/${locale}/${searchUrl}/${product.id}`
                                            : `/${locale}/${product.category_slug || 'products'}/${product.slug || `product-${product.id}`}`
                                    }
                                    className="group flex w-full items-center gap-4 px-4 py-4 text-left transition-colors hover:bg-kossti-cream-light/70 md:px-5"
                                    onClick={() => {
                                        setShowSuggestions(false);
                                    }}
                                >
                                    {/* Image */}
                                    <SuggestionThumbnail
                                        src={product.photo}
                                        alt={product.name}
                                    />

                                    {/* Text */}
                                    <div className="min-w-0 flex-1 text-left">
                                        <span className="block truncate text-base font-semibold text-kossti-dark transition-colors group-hover:text-kossti-brown">
                                            {product.translated_name || product.name}
                                        </span>
                                        <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-gray-500">
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
                                    <div className="flex flex-shrink-0 flex-col items-end gap-2">
                                        {product.average_rating && (
                                            <div className="flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-amber-700">
                                                <span className="text-sm">★</span>
                                                <span className="text-sm font-semibold">
                                                    {product.average_rating.toFixed(1)}
                                                </span>
                                            </div>
                                        )}
                                        <span className="text-xs font-medium uppercase tracking-wide text-kossti-brown">
                                            {countryCode === 'en' ? 'View Review' : 'রিভিউ দেখুন'}
                                        </span>
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