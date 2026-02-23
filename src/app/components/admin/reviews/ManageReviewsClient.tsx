'use client';

import GeneralPagination from '@/app/components/Pagination/general';
import Reviewetails from '@/app/components/admin/reviews/Reviewetails';
import { useReviews } from '@/hooks/useReviews';
import { Category } from '@/lib/types';
import { apiEndpoints } from '@/lib/constants';
import fetchApi from '@/lib/fetchApi';
import useDebounce from '@/lib/useDebounce';
import { useCallback, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Select, { SingleValue } from 'react-select';

interface ReviewData {
  id: number;
  product_id: number;
  rating: string;
  reviews: string;
  [key: string]: string | number;
}

interface SearchParams {
  page?: string;
  category?: string;
  searchTerm?: string;
}

interface ManageReviewsClientProps {
    searchParams: SearchParams;
}

const ManageReviewsClient = ({ searchParams }: ManageReviewsClientProps) => {
    const { getReviews } = useReviews();
    const router = useRouter();
    const currentSearchParams = useSearchParams();
    
    const [searchTerm, setSearchTerm] = useState('');
    const [categories, setCategories] = useState<Category[]>([]);
    const [page, setPage] = useState<number>(
        searchParams.page ? parseInt(searchParams.page as string, 10) : 1
    );
    const [selectedCategory, setSelectedCategory] = useState<number | null>(
        searchParams.category ? parseInt(searchParams.category as string, 10) : null
    );

    const debouncedSearchTerm = useDebounce({ value: searchTerm, delay: 500 });
    const limit = 10;

    // State to hold reviews and total products
    const [reviews, setReviews] = useState<ReviewData[]>([]);
    const [totalReviews, setTotalReviews] = useState<number>(0);

    // Fetch categories
    const fetchCategories = useCallback(async () => {
        try {
            const response = await fetchApi(`${apiEndpoints.Categories}?limit=1000&offset=0`);
            const apiResponse = response as { success: boolean; data: { categories: Category[] } };
            if (apiResponse.success) {
                setCategories(apiResponse.data.categories);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    }, []);

    // Function to fetch review data
    const fetchReviewsData = useCallback(async () => {
        const response = await getReviews(page, limit, debouncedSearchTerm, selectedCategory);
        if (response.success) {
            setReviews(response.data.reviews);
            setTotalReviews(response.data.totalReviews);
        }
    }, [page, limit, debouncedSearchTerm, selectedCategory]);

    // Handle category change
    const handleCategoryChange = (selectedOption: SingleValue<{ value: number; label: string }>) => {
        if (selectedOption) {
            const categoryId = selectedOption.value;
            setSelectedCategory(categoryId);
            setPage(1);
            const params = new URLSearchParams(currentSearchParams.toString());
            params.set('category', categoryId.toString());
            params.set('page', '1');
            router.push(`?${params.toString()}`);
        } else {
            setSelectedCategory(null);
            setPage(1);
            const params = new URLSearchParams(currentSearchParams.toString());
            params.delete('category');
            params.set('page', '1');
            router.push(`?${params.toString()}`);
        }
    };

    const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(currentSearchParams.toString());
        params.set('page', newPage.toString());
        router.push(`?${params.toString()}`);
        setPage(newPage);
    };

    // Fetch categories only on mount
    useEffect(() => {
        fetchCategories();
    }, []);

    // Fetch reviews when dependencies change
    useEffect(() => {
        fetchReviewsData();
    }, [page, limit, debouncedSearchTerm, selectedCategory]);

    
    return (
        <>
            <h2 className="text-2xl font-bold mb-4"> Reviews</h2>

            <div className='py-4'>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    placeholder="Search reviews..."
                    className="border border-gray-300 p-2 w-full rounded"
                />
            </div>

            <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                    Filter by Category
                </label>
                <div className="flex gap-2">
                    <div className="flex-1">
                        <Select
                            name="category"
                            value={Array.isArray(categories) && categories
                                .filter((cat) => Number(cat.status) === 1)
                                .map((cat) => ({
                                    value: cat.id,
                                    label: cat.name,
                                }))
                                .find((option) => option.value === selectedCategory) || null}
                            onChange={handleCategoryChange}
                            options={Array.isArray(categories) ? categories
                                .filter((cat) => Number(cat.status) === 1)
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

            {/* Review management functionalities */}
            <Reviewetails reviews={reviews} />

            <GeneralPagination
                currentPage={page}
                totalPages={Math.ceil(totalReviews / limit)} // Calculate total pages based on total reviews
                onPageChange={handlePageChange}
                queryParams={Object.fromEntries(currentSearchParams.entries())}
            />
        </>
    );
};

export default ManageReviewsClient;