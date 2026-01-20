import { Review } from '@/lib/types';

interface OurRatingProps {
    reviews: Review[];
}

const OurRating = ({ reviews }: OurRatingProps) => {
    const averageRating = reviews.length > 0
        ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
        : '0.0';

    const ratingPercentage = reviews.length > 0
        ? ((reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length) / 5) * 100
        : 0;

    return (
        <div className="bg-gray-50 rounded-2xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">OUR RATING</h2>
            <p className="text-sm text-gray-600 italic mb-6">The overall rating is based on review by our experts</p>

            <div className="flex items-center gap-8">
                <div className="flex items-center justify-center w-24 h-24 bg-gray-700 rounded-full">
                    <span className="text-4xl font-bold text-white">{averageRating}</span>
                </div>
                <div className="flex-1">
                    <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                            className="bg-orange-500 h-3 rounded-full transition-all"
                            style={{ width: `${ratingPercentage}%` }}
                        ></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OurRating;
