"use client"
import Pagination from '@/app/components/Pagination/index';
import ProductDetails from '@/app/components/admin/ProducDetails';
import { apiEndpoints } from '@/lib/constants';
import fetchApi from '@/lib/fetchApi';
import { Product } from '@/lib/types';
import useDebounce from '@/lib/useDebounce';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
const ManageReviews = () => {
    const searchParams = useSearchParams();

    const page = parseInt(searchParams.get('page') || '1', 10);
    const [searchTerm, setSearchTerm] = useState('');

    const debouncedSearchTerm = useDebounce({ value: searchTerm, delay: 500 });
    const limit = 10;
    const activeCategory = searchParams.get('category') || '';
    const activeBrands = searchParams.get('brand') || '';
    const activePriceRange = searchParams.get('price') || '';
    const locale = searchParams.get('locale') || 'en';
    const [products, setProducts] = useState<Product[]>([]);
    const [totalPage, setTotalPage] = useState(0);

    // Fetch products data; re-run when paging, filters or debounced search term change
    useEffect(() => {
        const fetchProductData = async () => {
            // Build query parameters
            const params: Record<string, string | number | null | undefined> = {
                page: page,
                limit: limit,
                locale: locale,
            };

            if (activeCategory) params.category = activeCategory;
            if (activeBrands) params.brand = activeBrands;
            if (activePriceRange) params.priceRange = activePriceRange;
            if (debouncedSearchTerm && debouncedSearchTerm.trim() !== '') {
                params.search = debouncedSearchTerm.trim();
            }

            try {
                const response = await fetchApi(apiEndpoints.getProducts, {
                    method: 'GET',
                    queryParams: params,
                });

                if (response.success && response.data) {
                    const apiResponse = response.data as {
                        data: Product[];
                        meta: { total: number };
                    };
                    setTotalPage(Math.ceil(apiResponse.meta?.total / limit) || 0);
                    setProducts(apiResponse.data || []);
                } else {
                    setProducts([]);
                    setTotalPage(0);
                }
            } catch (error) {
                console.error('Error fetching products:', error);
                setProducts([]);
                setTotalPage(0);
            }
        };

        fetchProductData();
    }, [page, debouncedSearchTerm, activeCategory, activeBrands, activePriceRange, locale]);

    const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };


    return (
        <>
            <h2 className="text-2xl font-bold mb-4"> Products</h2>
            <Link className='bg-blue-500 text-white px-2 py-1 rounded mr-2 my-2' href="/admin/createproduct">Add New Product</Link>

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
            <ProductDetails
                products={products} countryCode='en'
            />
            <Pagination
                currentPage={page}
                totalPages={totalPage}
            />
        </>
    );
};

export default ManageReviews;
