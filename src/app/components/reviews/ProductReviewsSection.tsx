

import { apiEndpoints } from '@/lib/constants';
import fetchApi from '@/lib/fetchApi';
import { Review } from '@/lib/types';
import { useCallback, useEffect, useState } from 'react';
import styles from './reviews.module.css';

interface ProductReviewsSectionProps {
    productId: number;
    countryCode?: string;
}

interface ReviewWrapper {
    review: Review;
}

const ProductReviewsSection = ({ productId, countryCode = 'en' }: ProductReviewsSectionProps) => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProductReviews = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            // Use fetchApi helper for consistent API calls (backend exposes /public-reviews)
            const endpoint = apiEndpoints.productReviews(productId, countryCode);
            const response = await fetchApi(endpoint);
            console.log(response)
            // Handle nested response shapes similar to getProducts
            let dataset: Review[] = [];
            if (response.success && response.data) {
                // If API returns { data: { reviews: [...] } }
                if (typeof response.data === 'object' && 'reviews' in response.data) {
                    const reviewsArray = response.data.reviews;
                    // Check if reviews contain nested 'review' objects
                    if (Array.isArray(reviewsArray) && reviewsArray.length > 0 && 'review' in reviewsArray[0]) {
                        dataset = (reviewsArray as ReviewWrapper[]).map((item) => item.review);
                    } else {
                        dataset = Array.isArray(reviewsArray) ? reviewsArray : [];
                    }
                } else if (Array.isArray(response.data)) {
                    // If API returns array directly
                    dataset = response.data as Review[];
                } else if (typeof response.data === 'object' && 'data' in response.data) {
                    // Some endpoints wrap payload in data
                    const inner = response.data.data as Record<string, unknown>;
                    dataset = Array.isArray(inner) ? inner : Array.isArray(inner?.reviews) ? (inner.reviews as Review[]) : [];
                }
            }

            setReviews(dataset);
        } catch (err) {
            console.error('Error fetching product reviews:', err);
            setError(err instanceof Error ? err.message : 'Failed to load reviews');
            setReviews([]);
        } finally {
            setLoading(false);
        }
    }, [productId, countryCode]);

    useEffect(() => {
        fetchProductReviews();
    }, [fetchProductReviews]);

    if (loading) {
        return (
            <div className="my-12 p-8 bg-white rounded-lg border border-gray-200">
                <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
                <p className="text-center text-gray-600 mt-4">Loading reviews...</p>
            </div>
        );
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
        <div className="my-12">
            {/* Reviews Header */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4"> Reviews</h2>

                {/* Rating Summary */}
                <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                    <div className="flex items-start gap-8">
                        {/* Average Rating */}
                        <div className="flex flex-col items-center">
                            <div className="text-5xl font-bold text-orange-500 mb-2">{averageRating}</div>
                            <div className="flex gap-1 mb-2">
                                {[...Array(5)].map((_, i) => (
                                    <svg
                                        key={i}
                                        className={`w-5 h-5 ${i < Math.round(Number(averageRating)) ? 'text-orange-500' : 'text-gray-300'}`}
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>
                            <p className="text-gray-600 text-sm">Based on {reviews.length} reviews</p>
                        </div>

                        {/* Rating Distribution */}
                        <div className="flex-1">
                            {[5, 4, 3, 2, 1].map((stars) => {
                                const count = reviews.filter(r => Math.round(parseFloat(String(r.rating)) || 0) === stars).length;
                                const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                                return (
                                    <div key={stars} className="flex items-center gap-3 mb-3">
                                        <span className="text-sm text-gray-600 w-12">{stars} ★</span>
                                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-orange-500 h-2 rounded-full transition-all"
                                                style={{ width: `${percentage}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-sm text-gray-600 w-10 text-right">{count}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Individual Reviews */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Detailed Reviews</h3>

                {reviews.map((review, index) => (
                    <div key={index} className={styles.reviewCard}>
                        {/* Review Header */}
                        <div className={styles.reviewHeader}>
                            <div className={styles.reviewerInfo}>
                                {/* Avatar */}
                                <div className={styles.avatarCircle}>
                                    R
                                </div>

                                {/* Reviewer Info */}
                                <div>
                                    <p className={styles.reviewerName}>Reviewer</p>
                                    <p className={styles.reviewDate} suppressHydrationWarning>
                                        {review.created_at
                                            ? new Date(review.created_at).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            })
                                            : 'Recently'}
                                    </p>
                                </div>
                            </div>

                            {/* Rating */}
                            <div className={styles.ratingStars}>
                                {[...Array(5)].map((_, i) => (
                                    <svg
                                        key={i}
                                        className={`${styles.star} ${i < Math.round(parseFloat(String(review.rating)) || 0) ? styles.starFilled : styles.starEmpty}`}
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>
                        </div>

                        {/* Price Badge */}
                        {review.price && (
                            <div>
                                <span className={styles.priceBadge}>
                                    Paid ৳{review.price}
                                </span>
                            </div>
                        )}

                        {/* Review Text */}
                        {review.reviews ? (
                            <div
                                className={styles.reviewContent}
                                dangerouslySetInnerHTML={{ __html: review.reviews }}
                            />
                        ) : (
                            <p className={styles.reviewContent}>
                                No review text provided
                            </p>
                        )}

                        {/* Additional Details */}
                        {review.additional_details && typeof review.additional_details === 'string' && (
                            <div className={styles.additionalDetails}>
                                <p className={styles.additionalDetailsTitle}>Additional Details:</p>
                                <p style={{ margin: 0 }}>{review.additional_details}</p>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className={styles.actionButtons}>
                            <button className={`${styles.actionButton} ${styles.helpfulButton}`}>
                                <svg className={styles.actionIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.646 7.23a2 2 0 01-1.789 1.106H5a2 2 0 01-2-2V9a2 2 0 012-2h6.268a2 2 0 011.789 1.106l3.609 7.19a2 2 0 01.146.389z" />
                                </svg>
                                Helpful
                            </button>
                            <button className={`${styles.actionButton} ${styles.unhelpfulButton}`}>
                                <svg className={styles.actionIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.646-7.23a2 2 0 011.789-1.106h10.5a2 2 0 012 2v9a2 2 0 01-2 2h-6.268a2 2 0 01-1.789-1.106l-3.609-7.19a2 2 0 01-.146-.389z" />
                                </svg>
                                Not Helpful
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Load More Button */}
            {
                reviews.length > 5 && (
                    <div className="mt-8 text-center">
                        <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors">
                            Load More Reviews
                        </button>
                    </div>
                )
            }
        </div >
    );
};

export default ProductReviewsSection;
