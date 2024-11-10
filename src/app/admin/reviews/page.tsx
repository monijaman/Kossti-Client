'use client';

import GeneralPagination from '@/components/Pagination/general';
import Reviewetails from '@/components/admin/reviews/Reviewetails';
import { useReviews } from '@/hooks/useReviews';
import { Product, Review, SearchParams } from '@/lib/types';
import useDebounce from '@/lib/useDebounce';
import { useEffect, useState } from 'react';

interface PageProps {
  params: {
    slug: string; // Type for the slug
  };
  searchParams: SearchParams; // Include searchParams
}

interface reviweData {
  id: number;
  review: Review;
  product: Product;
}



const ManageReviews = ({ params, searchParams }: PageProps) => {
  const { slug } = params;
  const { getReviews } = useReviews();
  const [searchTerm, setSearchTerm] = useState('');

  const debouncedSearchTerm = useDebounce({ value: searchTerm, delay: 500 });
  const page = parseInt(searchParams.page as string, 10) || 1;
  const limit = 10;

  // State to hold reviews and total products
  const [reviews, setReviews] = useState<reviweData[]>([]);
  const [totalReviews, setTotalReviews] = useState<number>(0);

  // Function to fetch review data
  const fetchReviewsData = async () => {
    const response = await getReviews(page, limit, searchTerm);
    if (response.success) {
      setReviews(response.data.reviews);
      setTotalReviews(response.data.totalReviews);
    }
  };



  useEffect(() => {
    if (debouncedSearchTerm) {
      fetchReviewsData();
    }
  }, [debouncedSearchTerm]);

  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    fetchReviewsData();
  }, []);


  return (
    <>
      <h2 className="text-2xl font-bold mb-4"> Reviews</h2>

      <div className='py-4'>
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search products..."
          className="border border-gray-300 p-2 w-full rounded"
        />
      </div>

      {/* Review management functionalities */}
      <Reviewetails reviews={reviews} />


      <GeneralPagination
        currentPage={page}
        totalPages={Math.ceil(totalReviews / limit)} // Calculate total pages based on total reviews
      />
    </>
  );
};

export default ManageReviews;
