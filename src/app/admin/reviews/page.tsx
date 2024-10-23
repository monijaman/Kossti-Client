'use client';

import Link from 'next/link';
import SearchBox from '@/components/Search';
import Reviewetails from '@/components/admin/reviews/Reviewetails';
import { SearchParams, Review } from '@/lib/types';
import { useReviews } from '@/hooks/useReviews';
import GeneralPagination from '@/components/Pagination/general';
import { useEffect, useState } from 'react';

interface PageProps {
  params: {
    slug: string; // Type for the slug
  };
  searchParams: SearchParams; // Include searchParams
}

const ManageReviews = ({ params, searchParams }: PageProps) => {
  const { slug } = params;
  const { getReviews } = useReviews();

  const page = parseInt(searchParams.page as string, 10) || 1;
  const limit = 10;
  const searchTerm = searchParams.searchterm || '';

  // State to hold reviews and total products
  const [reviews, setReviews] = useState<Review[]>([]);
  const [totalProducts, setTotalProducts] = useState<number>(0);

  // Function to fetch review data
  const fetchReviewsData = async () => {
    const response = await getReviews(page, limit, searchTerm);
 

    if (response.success) {
      setReviews(response.data.reviews);


      
    }
  };

  useEffect(() => {
    fetchReviewsData(); // Fetch data when the component mounts
  }, [page, searchTerm]); // Re-fetch when page or search term changes

  const handleDelete = (id: number) => {
    console.log('Delete review with ID:', id);
    // Add your delete logic here
  };

  return (
    <>
      <h2 className="text-2xl font-bold mb-4"> Reviews</h2>
 
      <SearchBox initialSearchTerm={searchTerm} />

      {/* Review management functionalities */}
      <Reviewetails reviews={reviews}   />

      <GeneralPagination
        currentPage={page}
        totalPages={Math.ceil(totalProducts / limit)} // Calculate total pages based on total reviews
      />
    </>
  );
};

export default ManageReviews;
