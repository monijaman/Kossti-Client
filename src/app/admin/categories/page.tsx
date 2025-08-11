'use client'
import CategoryDetails from '@/app/components/admin/categories/CategoryDetails';
import Pagination from '@/app/components/Pagination/index';
import { useCategory } from '@/hooks/useCategory';
import { categoryInt, SearchParams } from '@/lib/types';
import useDebounce from '@/lib/useDebounce';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface PageProps {
    params: {
        slug: string; // Type for the slug
    };
    searchParams: SearchParams; // Include searchParams
}

const ListSpecifications = ({ searchParams }: PageProps) => {
    const [totalPages, setTotalPages] = useState(0);
    const [categories, setCategories] = useState<categoryInt[]>([]);
    const [loading, setLoading] = useState(true);
    const { getCategories } = useCategory();

    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebounce({ value: searchTerm, delay: 500 });

    const page = parseInt(searchParams.page as string, 10) || 1;
    const limit = 10;
    const activeCategory = searchParams.category || '';
    const activeBrands = searchParams.brand || '';

    const locale = searchParams.locale || 'en';

    const fetchCategories = async () => {
        try {
            const categoriesResponse = await getCategories({
                perPage: 10,        // Number of items per page (optional)
                search: searchTerm,   // Search term (optional)
                paginate: 'true',   // 'true' or 'false' to enable/disable pagination
                locale: locale,        // Locale, e.g., 'en', 'bn', etc.
                categoryId: '',      // Category ID (optional, can be empty)
                status: 0,         // Status filter (optional)
                page: page           // current page (optional)
            });

            if (categoriesResponse.success) {
                setCategories(categoriesResponse.data.data);
                setTotalPages(Math.ceil(categoriesResponse.data.total / limit));
                setLoading(false);
            } else {
                console.error('Failed to fetch categories');
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    useEffect(() => {
        if (debouncedSearchTerm) {
            fetchCategories();
        }
    }, [debouncedSearchTerm]);

    const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    return (
        <div className="container mx-auto p-6 bg-white shadow-md rounded-lg p-6 bg-gray-100 min-h-screen">
            <h2 className="text-3xl font-semibold text-gray-800 mb-6">Categories</h2>

            <Link
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
                href="/admin/categories/manage"
            >
                Add New Key
            </Link>

            <div className="my-6 flex justify-between items-center bg-white">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    placeholder="Search categories..."
                    className="border border-gray-300 p-3 w-1/2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Loading Indicator */}
            {loading && <div className="text-center text-lg text-gray-500">Loading categories...</div>}

            {/* Categories List */}
            {!loading && (
                <CategoryDetails
                    categories={categories}
                />
            )}

            {/* Pagination */}
            <Pagination
                category={activeCategory}
                selectedBrands={activeBrands}
                currentPage={page}
                totalPages={totalPages}
            />
        </div>
    );
};

export default ListSpecifications;
