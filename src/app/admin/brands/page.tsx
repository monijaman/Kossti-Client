'use client'
import BrandDetails from '@/app/components/admin/brands/BrandDetails';
import Pagination from '@/app/components/Pagination/index';
import { useBrands } from '@/hooks/useBrands';
import { Brand, SearchParams } from '@/lib/types';
import useDebounce from '@/lib/useDebounce';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

interface PageProps {
    params: {
        slug: string; // Type for the slug
    };
    searchParams: SearchParams; // Include searchParams
}

const Brands = ({ searchParams }: PageProps) => {
    const [totalPages, setTotalPages] = useState(0);
    const [brands, setBrands] = useState<Brand[]>([]);

    const [loading, setLoading] = useState(true);

    const { getWideBrands } = useBrands();
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebounce({ value: searchTerm, delay: 500 });

    const page = parseInt(searchParams.page as string, 10) || 1;
    const limit = 10;
    const locale = searchParams.locale || 'en';

    const fetchBrandsBase = useCallback(async (searchQuery: string = '') => {
        try {
            setLoading(true);
            const brandResponse = await getWideBrands({
                perPage: limit,        // Number of items per page (optional)
                search: searchQuery,   // Search term (optional)
                paginate: 'true',   // 'true' or 'false' to enable/disable pagination
                locale: locale,        // Locale, e.g., 'en', 'bn', etc.
                brandId: '',      // Category ID (optional, can be empty)
                status: null,         // Status filter (optional)
                page: page           // current page (optional)
            });

            if (brandResponse.success && brandResponse.data) {
                const data = brandResponse.data as { data?: Brand[], total?: number } | Brand[];

                if (Array.isArray(data)) {
                    setBrands(data);
                    setTotalPages(Math.ceil(data.length / limit));
                } else {
                    const brandList = data.data || [];
                    const total = data.total || brandList.length;
                    setBrands(brandList);
                    setTotalPages(Math.ceil(total / limit));
                }
            }

        } catch (error) {
            console.error('Error fetching brands:', error);
        } finally {
            setLoading(false);
        }
    }, [getWideBrands, locale, page, limit]);

    useEffect(() => {
        fetchBrandsBase('');
    }, [fetchBrandsBase]); // Initial load

    useEffect(() => {
        if (debouncedSearchTerm !== undefined) {
            fetchBrandsBase(debouncedSearchTerm);
        }
    }, [debouncedSearchTerm, fetchBrandsBase]); // Search term changes

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

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
                    placeholder="Search brands..."
                    className="border border-gray-300 p-3 w-1/2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Loading Indicator */}
            {loading && <div className="text-center text-lg text-gray-500">Loading brands...</div>}

            {/* Brands List */}
            {!loading && (
                <BrandDetails
                    brands={brands}
                />
            )}

            {/* Pagination */}
            <Pagination
                currentPage={page}
                totalPages={totalPages}
            />
        </div>
    );
};

export default Brands;
