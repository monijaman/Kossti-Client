import VideoAndLinks from '@/app/components/reviews/SourceMedia';
import { Review } from '@/lib/types';

interface DetailedReviewsListProps {
    reviews: Review[];
    productId: number;
}

const DetailedReviewsList = ({ reviews, productId }: DetailedReviewsListProps) => {
    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900">Detailed Reviews</h3>
            {reviews.map((review, index) => (
                <div key={review.id || index} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-semibold text-gray-800">Review #{index + 1}</h4>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <svg
                                        key={i}
                                        className={`w-5 h-5 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                                <span className="ml-2 font-bold text-gray-900">{review.rating}/5</span>
                            </div>
                            <span className="text-sm text-gray-500" suppressHydrationWarning>
                                {new Date(review.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                            </span>
                        </div>
                    </div>

                    {review.price && (
                        <div className="mb-4 inline-block bg-green-100 px-4 py-2 rounded-lg">
                            <span className="text-sm text-gray-600">Price: </span>
                            <span className="font-bold text-lg text-green-700">${review.price.toFixed(2)}</span>
                        </div>
                    )}

                    <div className="prose max-w-none">
                        <div className="text-gray-800 leading-relaxed" dangerouslySetInnerHTML={{ __html: review.reviews }} />
                    </div>

                    {review.additional_details && typeof review.additional_details !== 'string' && (
                        <div className="mt-6 pt-6 border-t border-gray-200">
                            <h5 className="font-semibold text-gray-900 mb-3">Additional Media & Links</h5>
                            <VideoAndLinks
                                dataset={review.additional_details.map(item => ({
                                    ...item,
                                    youtubeUrl: item.youtubeUrl || ''
                                }))}
                                productId={productId}
                            />
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default DetailedReviewsList;
