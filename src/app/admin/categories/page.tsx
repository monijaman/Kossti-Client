
'use client'
import CategoryDetails from '@/app/components/admin/categories/CategoryDetails';
import Pagination from '@/app/components/Pagination/index';
import Input from '@/app/components/ui/input';
import { useCategory } from '@/hooks/useCategory';
import { categoryInt } from '@/lib/types';
import useDebounce from '@/lib/useDebounce';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

// API returns { data: { categories: categoryInt[], total: number } }
interface CategoryList {
    data: {
        categories: categoryInt[];
        total: number;
    };
}
const ListSpecifications = () => {
    // API returns object with data array and total count

    const [totalPages, setTotalPages] = useState(0);
    const [categories, setCategories] = useState<categoryInt[]>([]);
    const [loading, setLoading] = useState(true);
    const { getCategories } = useCategory();

    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebounce({ value: searchTerm, delay: 500 });

    const searchParams = useSearchParams();
    const page = parseInt(searchParams.get('page') ?? '1', 10);
    const limit = 10;
    const activeCategory = searchParams.get('category') ?? '';
    const activeBrands = searchParams.get('brand') ?? '';
    const locale = searchParams.get('locale') ?? 'en';
    const status = searchParams.get('status') ?? null;
    // Fetch categories with current search, page, and locale
    const fetchCategories = useCallback(async () => {

        try {
            const categoriesResponse = await getCategories({
                perPage: 10,        // Number of items per page (optional)
                search: searchTerm,   // Search term (optional)
                paginate: true,   // 'true' or 'false' to enable/disable pagination
                locale: locale,        // Locale, e.g., 'en', 'bn', etc.
                categoryId: '',      // Category ID (optional, can be empty)
                page: page,           // current page (optional)
                status: status,       // Status filter (optional)
            });


            if (categoriesResponse.success && categoriesResponse.data) {
                // Direct access to data since useCategory already unwraps it
                const dataObj = categoriesResponse.data as CategoryList;
                setCategories(dataObj.data.categories);
                setTotalPages(Math.ceil(dataObj.data.total / limit));
                setLoading(false);

                console.log('Fetched categories:', dataObj.data);
            } else {
                console.error('Failed to fetch categories');
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    }, [searchTerm, page, locale, getCategories]);

    useEffect(() => {
        if (debouncedSearchTerm) fetchCategories();
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
                <Input
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
                currentPage={page}
                totalPages={totalPages}
                additionalParams={{
                    category: activeCategory,
                    brand: activeBrands,
                    locale: locale,
                    search: searchTerm,
                }}
            />
        </div>
    );
};

export default ListSpecifications;
