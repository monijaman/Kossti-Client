import VideoAndLinks from '@/components/reviews/SourceMedia';
import { apiEndpoints } from '@/lib/constants';
import fetchApi from '@/lib/fetchApi';
import { Review } from '@/lib/types';
import { cookies } from 'next/headers';
interface revieResponse {
  success: boolean,
  data?: Review | null | undefined;
}

interface PopularProductsProps {
  productId: number;
}

const ReviewDetails = async ({ productId }: PopularProductsProps) => {
  
  const countryCode = (await cookies()).get('country-code')?.value || 'en'; // Default to 'en' if not found
 
  // Fetch specifications based on product ID and country code
  const fetchSpecifications = async (): Promise<revieResponse> => {
    return await fetchApi(apiEndpoints.getPublicReviewsByProductId(productId, countryCode))
 
  };

  // Await the fetch to get the actual data
  const review = await fetchSpecifications();


  return (
    <div>

      {review.success &&  review.data ? (
        <div className="p-4 bg-white border rounded shadow-md">

          <div className="mb-4">
            <span className="text-gray-600">Review: </span>
            <div className="text-gray-800" dangerouslySetInnerHTML={{ __html: review.data.reviews }} />
          </div>

          <div className="mb-4">
            <span className="text-gray-600">Price: </span>
            <span className="font-bold text-lg">${review.data.price}</span>
          </div>
          <div className="mb-4">
            <span className="text-gray-600">Rating: </span>
            <span className="font-bold text-lg">{review.data.rating} / 5</span>
          </div>

          <VideoAndLinks dataset={review.data.additional_details} productId={productId} />
        </div>
      ) : (
        <p className="text-red-500">Error fetching specifications.</p>
      )}

    </div>
  );
};

export default ReviewDetails;
