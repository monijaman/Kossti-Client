"use client";

import { useProducts } from '@/hooks/useProducts';
import { Product, SearchBoxProps } from '@/lib/types';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const SearchBox = ({ initialSearchTerm = '' }: SearchBoxProps) => {
    const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
    const [suggestions, setSuggestions] = useState<Product[]>([]); // Suggestions for search
    const [showSuggestions, setShowSuggestions] = useState(false); // Toggle suggestion dropdown
    const router = useRouter();
    const { getProducts } = useProducts()




    // Handle search input change and update suggestions
    const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const searchTerm = e.target.value;
        setSearchTerm(searchTerm);

        // Fetch product suggestions
        if (searchTerm.length > 0) {
            try {
                const page = 1; // Default page
                const productsPerPage = 5; // Limit number of suggestions
                const activeCategory = '';
                const activeBrands = '';
                const activePriceRange = '';
                const paginate = '0';
                const locale = 'en';

                // Make the getProducts call to fetch suggestions
                const response = await getProducts(page, productsPerPage, activeCategory, activeBrands, activePriceRange, searchTerm, locale);

                // Assuming that response.data contains products array
                if (response.success && response.data) {
                    setSuggestions(response.data.products); // Store suggestions
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
    const handleSuggestionClick = (product: Product) => {
        setSearchTerm(product.name);
        setShowSuggestions(false);
        router.push(`/?searchterm=${product.name}`); // Navigate based on the selected suggestion
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
                        {suggestions.map((product) => (
                            <li
                                key={product.id}
                                className="p-2 hover:bg-gray-100 cursor-pointer"
                            // onClick={() => handleSuggestionClick(product)}
                            >
                                <Link href={`/${product.category_slug}/${product.slug}`}>
                                    {product.name}
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