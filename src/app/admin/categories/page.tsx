'use client'
// pages/specifications/index.js
import CategoryDetails from '@/components/admin/categories/CategoryDetails';
import Pagination from '@/components/Pagination/index';
import { useCategory } from '@/hooks/useCategory';
import useSpecificationsKeys from '@/hooks/useSpecificationsKeys';
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

const ListSpecifications = ({ params, searchParams }: PageProps) => {

    const [totalPages, setTotalPages] = useState(0);
    const [categories, setCategories] = useState<categoryInt[]>([]);
    const [perPage, setPerPage] = useState(10);
    const [loading, setLoading] = useState(true);
    const { getSpecificationsKeys } = useSpecificationsKeys();
    const { getCategories } = useCategory();
    const paginate = true;
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebounce({ value: searchTerm, delay: 500 });


    const page = parseInt(searchParams.page as string, 10) || 1;
    const limit = 10;
    const activeCategory = searchParams.category || '';
    const activeBrands = searchParams.brand || '';
    const activePriceRange = searchParams.price || '';
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

                // setSpecifications(response);
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



    // Handle search input change and update suggestions
    const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    useEffect(() => {
        fetchCategories();
    }, [searchTerm, perPage]);

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4"> Categories</h2>
            <Link className='bg-blue-500 text-white px-2 py-2 px-4 rounded mr-2 my-2' href="/admin/categories/manage">Add New Key</Link>
            <div className='py-4'>

                <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    placeholder="Search products..."
                    className="border border-gray-300 p-2 w-full rounded"
                />
            </div>
            {/* Add your review management functionalities here */}
            <CategoryDetails
                categories={categories}
            />
            <Pagination
                category={activeCategory}
                selectedBrands={activeBrands}
                currentPage={page}
                totalPages={totalPages}
            />
        </div>
    );
}


export default ListSpecifications;
