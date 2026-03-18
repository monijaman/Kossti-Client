'use client';

import { Review } from '@/lib/types';

interface BlogStyleReviewsProps {
    reviews: Review[];
    countryCode?: string;
}

const BlogStyleReviews = ({ reviews, countryCode = 'en' }: BlogStyleReviewsProps) => {
    if (!reviews || reviews.length === 0) {
        return null;
    }

    // Use 4 or 8 reviews
    const displayReviews = reviews.slice(0, 4);

    return (
        <section className="py-20 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="mb-14">
                    <h2 className="font-display text-4xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent tracking-tight">
                        Latest Reviews
                    </h2>
                </div>

                {/* Reviews Grid - 4 Column */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {displayReviews.map((review, index) => (
                        <div
                            key={review.id || index}
                            className="group rounded-2xl overflow-hidden bg-white/80 backdrop-blur border border-gray-200 hover:border-purple-300 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer h-full flex flex-col hover:bg-gradient-to-br hover:from-white hover:to-purple-50"
                        >
                            {/* Image Container with Gradient */}
                            <div className="relative w-full h-48 bg-gradient-to-br from-cyan-200 via-blue-200 to-purple-200 overflow-hidden">
                                {/* Subtle pattern or gradient overlay */}
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-5 bg-black transition-opacity duration-300" />
                            </div>

                            {/* Content Container */}
                            <div className="px-5 pb-5 flex flex-col flex-grow bg-gradient-to-b from-transparent to-blue-50">
                                {/* Title */}
                                <h3 className="font-display text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4 line-clamp-2 leading-tight group-hover:from-purple-600 group-hover:to-pink-600 transition-all">
                                    Product Analysis
                                </h3>

                                {/* Rating and Price Row */}
                                <div className="mb-4 pb-4 border-b border-purple-100 space-y-2">
                                    {/* Rating Display */}
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-xs font-semibold text-gray-500 uppercase">Rating</span>
                                        <span className="text-lg font-black text-yellow-500">
                                            ★ {review.rating?.toFixed(1) || 'N/A'}/5
                                        </span>
                                    </div>

                                    {/* Price Display */}
                                    {review.price && (
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-xs font-semibold text-gray-500 uppercase">Price</span>
                                            <span className="text-lg font-black text-green-600">
                                                ${review.price.toFixed(2)}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Footer - Author Section */}
                                <div className="flex items-center justify-between pt-2">
                                    <div className="flex items-center gap-2.5">
                                        {/* Author Avatar */}
                                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                                            {String.fromCharCode(65 + (index % 26))}
                                        </div>

                                        {/* Author Info */}
                                        <div>
                                            <p className="font-bold text-gray-900 text-xs">
                                                Expert
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {new Date(review.created_at).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                })}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Arrow Icon */}
                                    <div className="text-gray-400 group-hover:text-blue-600 transition-all transform group-hover:translate-x-0.5">
                                        <svg
                                            className="w-5 h-5"
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
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default BlogStyleReviews;
