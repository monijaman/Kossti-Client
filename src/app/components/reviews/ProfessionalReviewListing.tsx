'use client';

import { Review } from '@/lib/types';

interface ProfessionalReviewListingProps {
    reviews: Review[];
    countryCode?: string;
}

const ProfessionalReviewListing = ({ reviews, countryCode = 'en' }: ProfessionalReviewListingProps) => {
    if (!reviews || reviews.length === 0) {
        return null;
    }

    return (
        <section className="py-16 bg-gradient-to-b from-white to-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="mb-12 text-center">
                    <h2 className="font-display text-4xl sm:text-5xl font-black text-gray-900 mb-4 tracking-tight">
                        Latest Reviews
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Discover detailed expert insights and user experiences
                    </p>
                </div>

                {/* Reviews Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {reviews.map((review, index) => (
                        <article
                            key={review.id || index}
                            className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
                        >
                            {/* Image Container */}
                            <div className="relative w-full h-48 bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 overflow-hidden">
                                {/* Rating Badge */}
                                <div className="absolute top-3 left-3 z-10 bg-white rounded-full p-2 shadow-lg">
                                    <div className="flex items-center gap-1">
                                        <span className="text-yellow-400">★</span>
                                        <span className="font-bold text-gray-900 text-sm">
                                            {review.rating?.toFixed(1) || 'N/A'}
                                        </span>
                                    </div>
                                </div>

                                {/* Placeholder Image or Product Photo */}
                                {review.product_id && (
                                    <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
                                        {review.product_id}
                                    </div>
                                )}
                            </div>

                            {/* Content Container */}
                            <div className="p-6 flex flex-col h-full">
                                {/* Title */}
                                <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors">
                                    Review #{index + 1}
                                </h3>

                                {/* Review Snippet */}
                                <p className="text-sm text-gray-600 mb-4 line-clamp-3 flex-grow leading-relaxed">
                                    {review.reviews
                                        ? review.reviews.replace(/<[^>]*>/g, '').substring(0, 100) + '...'
                                        : 'No review content available'}
                                </p>

                                {/* Price Badge */}
                                {review.price && (
                                    <div className="mb-4 inline-block">
                                        <div className="bg-gradient-to-r from-green-100 to-emerald-100 px-3 py-2 rounded-lg border border-green-200">
                                            <span className="text-xs text-gray-600">Price: </span>
                                            <span className="font-bold text-green-700">
                                                ${review.price.toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {/* Footer with Author and Date */}
                                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                            R
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold text-gray-900">Reviewer</p>
                                            <p className="text-xs text-gray-500">
                                                {new Date(review.created_at).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric',
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                    <svg
                                        className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 5l7 7-7 7"
                                        />
                                    </svg>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ProfessionalReviewListing;
