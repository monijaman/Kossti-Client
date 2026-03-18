'use client';

import { Review } from '@/lib/types';

interface FeaturedReviewsProps {
    reviews: Review[];
    countryCode?: string;
}

const FeaturedReviewsListing = ({ reviews, countryCode = 'en' }: FeaturedReviewsProps) => {
    if (!reviews || reviews.length === 0) {
        return null;
    }

    // Display top 4 reviews
    const featuredReviews = reviews.slice(0, 4);

    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="mb-16">
                    <div className="flex items-end justify-between mb-4">
                        <div>
                            <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-2">
                                ✨ Featured
                            </p>
                            <h2 className="font-display text-4xl md:text-5xl font-black text-gray-900 leading-tight tracking-tight">
                                Expert Reviews
                            </h2>
                        </div>
                    </div>
                    <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
                </div>

                {/* Featured Reviews Grid - 4 Column */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {featuredReviews.map((review, index) => (
                        <div
                            key={review.id || index}
                            className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 cursor-pointer"
                        >
                            {/* Card Background Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 z-0" />

                            {/* Image/Product Area */}
                            <div className="relative h-56 bg-gradient-to-br from-blue-200 via-purple-100 to-pink-100 overflow-hidden z-10">
                                <div className="w-full h-full flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="text-5xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                            ★
                                        </div>
                                        <p className="text-2xl font-bold text-gray-900 mt-2">
                                            {review.rating?.toFixed(1) || 'R'}
                                        </p>
                                    </div>
                                </div>

                                {/* Top Badge */}
                                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur px-4 py-2 rounded-full shadow-md">
                                    <span className="text-xs font-bold text-gray-900">REVIEW #{index + 1}</span>
                                </div>
                            </div>

                            {/* Content Area */}
                            <div className="relative p-6 z-20">
                                {/* Title */}
                                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                                    Product Insight
                                </h3>

                                {/* Description */}
                                <p className="text-sm text-gray-600 leading-relaxed line-clamp-3 mb-4">
                                    {review.reviews
                                        ? review.reviews.replace(/<[^>]*>/g, '').substring(0, 90) + '...'
                                        : 'Detailed review analysis'}
                                </p>

                                {/* Price Tag */}
                                {review.price && (
                                    <div className="mb-4 flex items-baseline gap-1">
                                        <span className="text-xs text-gray-500 font-medium">Price:</span>
                                        <span className="text-lg font-black text-green-600">
                                            ${review.price.toFixed(2)}
                                        </span>
                                    </div>
                                )}

                                {/* Divider */}
                                <div className="h-px bg-gray-200 mb-4" />

                                {/* Footer - Author Info */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                                            {index + 1}
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold text-gray-900">
                                                Expert Review
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {new Date(review.created_at).toLocaleDateString('en', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-gray-400 group-hover:text-blue-600 transition-colors">
                                        <svg
                                            className="w-6 h-6"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M13 7l5 5m0 0l-5 5m5-5H6"
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Hover Accent Line */}
                            <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-500 z-30" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturedReviewsListing;
