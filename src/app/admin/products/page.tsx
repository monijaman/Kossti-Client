"use client"
import Pagination from '@/app/components/Pagination/index';
import ProductDetails from '@/app/components/admin/ProducDetails';
import { apiEndpoints } from '@/lib/constants';
import fetchApi from '@/lib/fetchApi';
import { Category, Product } from '@/lib/types';
import useDebounce from '@/lib/useDebounce';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Select, { SingleValue } from 'react-select';

const ManageReviews = () => {
    const searchParams = useSearchParams();
    const router = useRouter();

    const page = parseInt(searchParams.get('page') || '1', 10);
    const [searchTerm, setSearchTerm] = useState('');
    const [categories, setCategories] = useState<Category[]>([]);

    const debouncedSearchTerm = useDebounce({ value: searchTerm, delay: 500 });
    const limit = 10;
    const activeCategory = searchParams.get('category') || '';
    const activeBrands = searchParams.get('brand') || '';
    const activePriceRange = searchParams.get('price') || '';
    const locale = searchParams.get('locale') || 'en';
    const [products, setProducts] = useState<Product[]>([]);
    const [totalPage, setTotalPage] = useState(0);
    const [selectedCategory, setSelectedCategory] = useState<number | null>(
        activeCategory ? parseInt(activeCategory, 10) : null
    );

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

    // Fetch categories
    const fetchCategories = async () => {
        try {
            const response = await fetchApi(`${apiEndpoints.Categories}?limit=1000&offset=0`);
            const apiResponse = response as { success: boolean; data: { categories: Category[], count: number, limit: number, offset: number } };


            if (!apiResponse.success) {
                console.error("Failed to fetch categories.");
                return;
            }

            // console.log("Fetched categories:", apiResponse.data.categories);
            setCategories(apiResponse.data.categories);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    // Function to handle category selection
    const handleCategoryChange = (selectedOption: SingleValue<{ value: number; label: string }>) => {
        if (selectedOption) {
            const categoryId = selectedOption.value;
            setSelectedCategory(categoryId);
            // Update URL with the selected category
            const params = new URLSearchParams(searchParams.toString());
            params.set('category', categoryId.toString());
            params.set('page', '1'); // Reset to page 1 when category changes
            router.push(`?${params.toString()}`);
        } else {
            setSelectedCategory(null);
            // Remove category from URL
            const params = new URLSearchParams(searchParams.toString());
            params.delete('category');
            params.set('page', '1');
            router.push(`?${params.toString()}`);
        }
    };


    useEffect(() => {
        fetchCategories();
    }, []);
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

            <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                </label>
                <div className="flex gap-2">
                    <div className="flex-1">
                        <Select
                            name="category"
                            value={Array.isArray(categories) && categories
                                .filter((cat) => Number(cat.status) === 1) // Only show active categories
                                .map((cat) => ({
                                    value: cat.id,
                                    label: cat.name,
                                }))
                                .find((option) => option.value === selectedCategory) || null}
                            onChange={handleCategoryChange}
                            options={Array.isArray(categories) ? categories
                                .filter((cat) => Number(cat.status) === 1) // Only show active categories
                                .map((cat) => ({
                                    value: cat.id,
                                    label: cat.name,
                                })) : []}
                            className="mt-1 block w-full"
                            placeholder="Select a category"
                            isSearchable
                            isClearable
                        />
                    </div>
                </div>
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
