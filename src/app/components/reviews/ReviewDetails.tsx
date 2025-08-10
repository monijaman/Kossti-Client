import VideoAndLinks from '@/app/components/reviews/SourceMedia';
import { apiEndpoints } from '@/lib/constants';
import fetchApi from '@/lib/fetchApi';
import { Review } from '@/lib/types';
import { cookies } from 'next/headers';
interface ReviewResponse {
  success: boolean;
  data?: Review[];
  message?: string;
}

interface PopularProductsProps {
  productId: number;
}

const ReviewDetails = async ({ productId }: PopularProductsProps) => {

  const countryCode = (await cookies()).get('country-code')?.value || 'en'; // Default to 'en' if not found

  // Fetch reviews based on product ID and country code
  const fetchReviews = async (): Promise<ReviewResponse> => {
    try {
      const response = await fetchApi(apiEndpoints.getPublicReviewsByProductId(productId, countryCode));
      console.log('Fetched reviews:', response);
      return {
        success: response.success,
        data: response.data as Review[]
      };

    } catch (error) {
      console.error('Error fetching reviews:', error);
      return { success: false, data: [] };
    }
  };

  // Await the fetch to get the actual data
  const reviewResponse = await fetchReviews();
  console.log('ReviewResponse:', reviewResponse);
  console.log('ReviewResponse.data:', reviewResponse.data);
  console.log('Type of reviewResponse.data:', typeof reviewResponse.data);
  console.log('Is reviewResponse.data an array?', Array.isArray(reviewResponse.data));

  // Handle the case where the API response has nested data structure
  let reviewsData = reviewResponse.data;
  if (reviewResponse.data && typeof reviewResponse.data === 'object' && 'data' in reviewResponse.data) {
    reviewsData = (reviewResponse.data as { data: Review[] }).data;
  }

  const reviews: Review[] = Array.isArray(reviewsData) ? reviewsData : [];
  return (
    <div>
      {reviewResponse.success ? (
        <div className="space-y-4">
          {reviews.map((review, index) => (
            <div key={review.id || index} className="p-4 bg-white border rounded shadow-md">
              <div className="mb-4">
                <h4 className="text-lg font-semibold text-gray-800">Review #{index + 1}</h4>
                <span className="text-sm text-gray-500">Posted on: {new Date(review.created_at).toLocaleDateString()}</span>
              </div>

              <div className="mb-4">
                <span className="text-gray-600">Review: </span>
                <p className="text-gray-800" dangerouslySetInnerHTML={{ __html: review.reviews }} />
              </div>

              <div className="mb-4">
                <span className="text-gray-600">Price: </span>
                <span className="font-bold text-lg text-green-600">${review.price.toFixed(2)}</span>
              </div>

              <div className="mb-4">
                <span className="text-gray-600">Rating: </span>
                <span className="font-bold text-lg text-yellow-500">{review.rating} / 5</span>
              </div>

              <div className="mb-4">
                <span className="text-gray-600">Additional Details: </span>
                {typeof review.additional_details === 'string' ? (
                  <p className="text-gray-700">{review.additional_details}</p>
                ) : (
                  <VideoAndLinks
                    dataset={review.additional_details.map(item => ({
                      ...item,
                      youtubeUrl: item.youtubeUrl || '' // Ensure youtubeUrl is always a string
                    }))}
                    productId={productId}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No reviews available for this product.</p>
      )}
    </div>
  );
};

export default ReviewDetails;
