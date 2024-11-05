import { useReviews } from '@/hooks/useReviews';

interface PopularProductsProps {
  productId: number;
}

const ReviewDetails = async ({ productId }: PopularProductsProps) => {
  const { getPublicReviewsByProductId } = useReviews();
  const locale = 'bn';

  const fetchSpecifications = async () => {
    const response = await getPublicReviewsByProductId(productId, locale);

    return response;
  }

  // Await the fetch to get the actual data
  const review = await fetchSpecifications();

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
        </div>
      ) : (
        <p className="text-red-500">Error fetching specifications.</p>
      )}

    </div>
  );
};

export default ReviewDetails;
