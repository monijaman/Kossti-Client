'use client'
import BrandDetails from '@/app/components/admin/brands/BrandDetails';
import Pagination from '@/app/components/Pagination/index';
import { useBrands } from '@/hooks/useBrands';
import { Brand, brandInt, SearchParams } from '@/lib/types';
import useDebounce from '@/lib/useDebounce';
import Link from 'next/link';
import { use, useCallback, useEffect, useState } from 'react';

interface PageProps {
    params: Promise<{
        slug: string; // Type for the slug
    }>;
    searchParams: Promise<SearchParams>; // Include searchParams as Promise
}


interface BrandList {
    brands: brandInt[];
    total: number;
    count?: number;
}

const BrandPage = ({ searchParams }: PageProps) => {
    // Unwrap searchParams using React.use()
    const resolvedSearchParams = use(searchParams);

    const [totalPages, setTotalPages] = useState(0);
    const [brands, setBrands] = useState<Brand[]>([]);

    const [loading, setLoading] = useState(true);

    const { getWideBrands } = useBrands();
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebounce({ value: searchTerm, delay: 500 });

    const page = parseInt(resolvedSearchParams.page as string, 10) || 1;
    const limit = 10;
    const locale = resolvedSearchParams.locale || 'en';

    const userType = typeof window !== 'undefined' ? localStorage.getItem('userType') : null;

    const fetchBrandsBase = useCallback(async (searchQuery: string = '') => {
        try {
            setLoading(true);
            const brandResponse = await getWideBrands({
                limit: limit,        // Number of items per page (optional)
                search: searchQuery,   // Search term (optional)
                paginate: true,   // 'true' or 'false' to enable/disable pagination
                locale: locale,        // Locale, e.g., 'en', 'bn', etc.
                brandId: '',      // Category ID (optional, can be empty)
                status: null,         // Status filter (optional)
                page: page           // current page (optional)
            });

            if (brandResponse.success && brandResponse.data) {
                const data = brandResponse.data as BrandList | brandInt[];
                let resolvedBrands: brandInt[] = [];
                let totalCount = 0;

                if (Array.isArray(data)) {
                    resolvedBrands = data;
                    totalCount = data.length;
                } else if (Array.isArray((data as BrandList).brands)) {
                    resolvedBrands = (data as BrandList).brands;
                    totalCount = (data as BrandList).total ?? (data as BrandList).count ?? resolvedBrands.length;
                } else if (Array.isArray((data as any).data?.brands)) {
                    resolvedBrands = (data as any).data.brands;
                    totalCount = (data as any).data.total ?? (data as any).data.count ?? resolvedBrands.length;
                }

                setBrands(resolvedBrands);
                setTotalPages(Math.ceil(totalCount / limit));
            } else {
                setBrands([]);
                setTotalPages(0);
            }
        } catch (error) {
            console.error('Error fetching brands:', error);
            setBrands([]);
            setTotalPages(0);
        } finally {
            setLoading(false);
        }
    }, [getWideBrands, locale, page, limit]);

    useEffect(() => {
        fetchBrandsBase('');
    }, []); // Initial load

    useEffect(() => {
        if (debouncedSearchTerm !== undefined) {
            fetchBrandsBase(debouncedSearchTerm);
        }
    }, [debouncedSearchTerm]); // Search term changes

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    return (
        <div className="container mx-auto p-6 p-6 bg-gray-100 min-h-screen shadow-md rounded-lg ">
            <h2 className="text-3xl pp font-semibold text-gray-800 mb-6">Brands</h2>

            {userType !== 'reviewer' && (
                <Link
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
                    href="/admin/brand/manage"
                >
                    Add New Brand
                </Link>
            )}

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

export default BrandPage;
