import Link from 'next/link'
 
import SearchBox from '@/components/Search';
  import Reviewetails from '@/components/admin/reviews/Reviewetails';
import { SearchParams, ProductApiResponse, Product } from '@/lib/types';
import { useReviews } from '@/hooks/useReviews';
import ProductDetails from '@/components/admin/ProducDetails';
import GeneralPagination from '@/components/Pagination/general';
import { useEffect } from 'react';
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
    // const fetchReviewsData = async () => {
    //     const response = await getReviews(page, limit,  searchTerm);
    //     return response.success ? response.data : { reviews: [], totalProducts: 0 };
    // };

 //   const dataset = await fetchReviewsData();
  //  const totalPages = Math.ceil(dataset.totalProducts / limit);
//console.log('michael', dataset)
    const handleDelete = (id: number) => {
        console.log('Delete product with ID:', id);
        // Add your delete logic here
    };


   
        const fetchReviews = async () => {
          try {
            const response = await fetch(
              'http://localhost:3000/api/get?action=reviews&page=1&limit=10'
            );
            if (!response.ok) {
              throw new Error('Failed to fetch reviews');
            }
            const data = await response.json();

            console.log('------------------------datadata', data)
         
          } catch (error) {
             
          } finally {
            
          }
        };
    
        fetchReviews();
 


    return (
        <>
            <h2 className="text-2xl font-bold mb-4"> Reviews</h2>
            <Link className='bg-blue-500 text-white px-2 py-1 rounded mr-2 my-2' href="/admin/createproduct">Add New Product</Link>
            <SearchBox initialSearchTerm={searchTerm} />

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
