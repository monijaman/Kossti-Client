
import Link from 'next/link';

import SearchBox from '@/components/Search';
import { useReviews } from '@/hooks/useReviews';
import { SearchParams } from '@/lib/types';
interface PageProps {
  params: {
    slug: string; // Type for the slug
  };
  searchParams: SearchParams; // Include searchParams
}

const ManageReviews = async ({ params, searchParams }: PageProps) => {

  const { slug } = params;
  const { getReviews } = useReviews();


  const page = parseInt(searchParams.page as string, 10) || 1;
  const limit = 10;
  const activeCategory = searchParams.category || '';
  const activeBrands = searchParams.brand || '';
  const activePriceRange = searchParams.price || '';
  const searchTerm = searchParams.searchterm || '';
  const locale = searchParams.locale || 'bn';


  // Mock function to fetch product data
  const fetchReviewsData = async () => {

    const response = await getReviews(page, limit, searchTerm);
    return response.success ? response.data : { reviews: [], totalProducts: 0 };
  };

  // const dataset = await fetchReviewsData();
  // const totalPages = Math.ceil(dataset.totalProducts / limit);


  fetchReviewsData();

  return (
    <>
      <h2 className="text-2xl font-bold mb-4"> Reviews</h2>
      <Link className='bg-blue-500 text-white px-2 py-1 rounded mr-2 my-2' href="/admin/createproduct">Add New Product</Link>
      <SearchBox initialSearchTerm={searchTerm} searchUrl="reviews" />

      {/* Add your review management functionalities here */}
      {/* <Reviewetails
                reviews={dataset.reviews}
            /> */}
      {/* <GeneralPagination
                currentPage={page}
                totalPages={totalPages}
            /> */}
    </>
  );
};

export default ManageReviews;
