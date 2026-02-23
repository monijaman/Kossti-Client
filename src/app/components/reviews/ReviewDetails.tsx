import DetailedReviewsList from '@/app/components/reviews/DetailedReviewsList';
import OurRating from '@/app/components/reviews/OurRating';
import ProsCons from '@/app/components/reviews/ProsCons';
import { Review } from '@/lib/types';
import ProductReviewsSection from './ProductReviewsSection';
interface ReviewDetailsProps {
  reviews: Review[];
  productId: number;
}

const ReviewDetails = ({ reviews, productId }: ReviewDetailsProps) => {
  if (!reviews || reviews.length === 0) {
    return null;
  }

  return (
    <div className="my-12">
      <OurRating reviews={reviews} />
      <ProsCons />
      <DetailedReviewsList reviews={reviews} productId={productId} />
      <ProductReviewsSection productId={productId} />
    </div>
  );
};

export default ReviewDetails;

