import fetchPublicReviewsByProductId from '@/app/ServerCalls/fetchPublicReviewsByProductId';
import VideoAndLinks from '@/components/reviews/SourceMedia';
import { Review } from '@/lib/types';
import { cookies } from 'next/headers';

interface revieResponse {
  success: boolean,
  data: Review,
}

interface PopularProductsProps {
  productId: number;
}

const ReviewDetails = async ({ productId }: PopularProductsProps) => {
  const countryCode = (await cookies()).get('country-code')?.value || 'en'; // Default to 'en' if not found

  const review = await fetchPublicReviewsByProductId(productId, countryCode);

  console.log('reviewreview', productId)

  return (
    <div>

      {review.success ? (
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
