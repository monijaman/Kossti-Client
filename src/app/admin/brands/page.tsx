'use client'
import BrandDetails from '@/app/components/admin/brands/BrandDetails';
import Pagination from '@/app/components/Pagination/index';
import { useBrands } from '@/hooks/useBrands';
import useSpecificationsKeys from '@/hooks/useSpecificationsKeys';
import { Brand, SearchParams } from '@/lib/types';
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
    const [brands, setBrands] = useState<Brand[]>([]);
    const [perPage, setPerPage] = useState(10);
    const [loading, setLoading] = useState(true);
    const { getSpecificationsKeys } = useSpecificationsKeys();
    const { getWideBrands } = useBrands();
    const paginate = true;
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebounce({ value: searchTerm, delay: 500 });

    const page = parseInt(searchParams.page as string, 10) || 1;
    const limit = 10;
    const activeCategory = searchParams.category || '';
    const activeBrands = searchParams.brand || '';
    const activePriceRange = searchParams.price || '';
    const locale = searchParams.locale || 'en';

    const fetchBrands = async () => {
        try {
            const brandResponse = await getWideBrands({
                perPage: 10,        // Number of items per page (optional)
                search: searchTerm,   // Search term (optional)
                paginate: 'true',   // 'true' or 'false' to enable/disable pagination
                locale: locale,        // Locale, e.g., 'en', 'bn', etc.
                brandId: '',      // Category ID (optional, can be empty)
                status: 0,         // Status filter (optional)
                page: page           // current page (optional)
            });

            if (brandResponse.success) {

                setBrands(brandResponse.data.data);
                setTotalPages(Math.ceil(brandResponse.data.total / limit));
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
            fetchBrands();
        }
    }, [debouncedSearchTerm]);

    const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    useEffect(() => {
        fetchBrands();
    }, []);

    return (
        <div className="container mx-auto p-6 p-6 bg-gray-100 min-h-screen shadow-md rounded-lg ">
            <h2 className="text-3xl font-semibold text-gray-800 mb-6">Brands</h2>

            <Link
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
                href="/admin/brands/manage"
            >
                Add New Brand
            </Link>

            <div className="my-6 flex justify-between items-center">
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
                <BrandDetails
                    brands={brands}
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
