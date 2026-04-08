

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
            <div className="my-12 p-8 bg-gray-50 border border-gray-200 rounded-lg text-center">
                <svg className="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
                <p className="text-gray-600 font-medium">No reviews available yet</p>
            </div>
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
                                {review.price && (
                                    <span className="ml-2 text-xs font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">৳{review.price}</span>
                                )}
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
