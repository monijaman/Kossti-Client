

import { apiEndpoints } from '@/lib/constants';
import fetchApi from '@/lib/fetchApi';
import { Review } from '@/lib/types';
import styles from './reviews.module.css';

interface ProductReviewsSectionProps {
    productId: number;
    countryCode?: string;
}

interface ReviewWrapper {
    review: Review;
}

const ProductReviewsSection = async ({ productId, countryCode = 'en' }: ProductReviewsSectionProps) => {
    // Fetch reviews at the top level
    let reviews: Review[] = [];
    let error: string | null = null;
    try {
        const endpoint = apiEndpoints.productReviews(productId, countryCode);
        const response = await fetchApi(endpoint);
        // Handle nested response shapes similar to getProducts
        if (response.success && response.data) {
            if (typeof response.data === 'object' && 'reviews' in response.data) {
                const reviewsArray = response.data.reviews;
                if (Array.isArray(reviewsArray) && reviewsArray.length > 0 && 'review' in reviewsArray[0]) {
                    reviews = (reviewsArray as ReviewWrapper[]).map((item) => item.review);
                } else {
                    reviews = Array.isArray(reviewsArray) ? reviewsArray : [];
                }
            } else if (Array.isArray(response.data)) {
                reviews = response.data as Review[];
            } else if (typeof response.data === 'object' && 'data' in response.data) {
                const inner = response.data.data as Record<string, unknown>;
                reviews = Array.isArray(inner) ? inner : Array.isArray(inner?.reviews) ? (inner.reviews as Review[]) : [];
            }
        }
    } catch (err: any) {
        error = err instanceof Error ? err.message : 'Failed to load reviews';
        reviews = [];
    }

    if (error) {
        return (
            <div className="my-12 p-8 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800">Error loading reviews: {error}</p>
            </div>
        );
    }

    if (!reviews || reviews.length === 0) {
        return (
            <section className="my-12" aria-label="Reviews">
                <h2 className="text-xl font-bold text-gray-900 mb-4">User Reviews</h2>
                <div className="p-8 bg-gray-50 border border-gray-200 rounded-lg">
                    <p className="text-gray-700 font-medium mb-2">Be the first to review this product</p>
                    <p className="text-gray-500 text-sm mb-4">
                        Share your experience to help other buyers make an informed decision. Your review can cover build quality, performance, value for money, and anything else you found useful or lacking.
                    </p>
                    <p className="text-xs text-gray-400">
                        Our editorial team also publishes in-depth professional reviews. Check back soon for a full verdict, pros &amp; cons, and buying advice.
                    </p>
                </div>
            </section>
        );
    }

    // Calculate average rating
    const averageRating = reviews.length > 0
        ? (reviews.reduce((sum, review) => sum + (parseFloat(String(review.rating)) || 0), 0) / reviews.length).toFixed(1)
        : 0;

    return (
        <div className="my-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Reviews</h2>
            <div className="flex flex-col gap-3">
                {reviews.map((review, index) => (
                    <div key={index} className={styles.reviewCard}>
                        {/* Row 1: avatar + name/date + stars */}
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2.5">
                                <div className={styles.avatarCircle}>R</div>
                                <div>
                                    <p className={styles.reviewerName}>Reviewer</p>
                                    <p className={styles.reviewDate} suppressHydrationWarning>
                                        {review.created_at
                                            ? new Date(review.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
                                            : 'Recently'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <svg key={i} className={`w-4 h-4 ${i < Math.round(parseFloat(String(review.rating)) || 0) ? 'text-orange-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                                {/* Price - hidden, activate when ready */}
                                {/* {review.price && (
                                    <span className="ml-2 text-xs font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">৳{review.price}</span>
                                )} */}
                            </div>
                        </div>

                        {/* Review Body */}
                        {review.reviews ? (
                            <div className={styles.reviewContent} dangerouslySetInnerHTML={{ __html: review.reviews }} />
                        ) : (
                            <p className="text-sm text-gray-400 italic">No review text provided</p>
                        )}

                        {/* Additional details */}
                        {review.additional_details && typeof review.additional_details === 'string' && (
                            <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500">
                                {review.additional_details}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductReviewsSection;
