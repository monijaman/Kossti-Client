"use client";

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Review {
    id: number;
    user: string;
    review: string;
    rating: number;
    status: string;
    product_name?: string;
    created_at?: string;
}

interface ReviewsResponse {
    success: boolean;
    data: {
        reviews: Review[];
        totalReviews: number;
    };
}

const Dashboard = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [latestReviews, setLatestReviews] = useState<Review[]>([]);
    const [reviewStats, setReviewStats] = useState({
        total: 0,
        pending: 0,
        approved: 0
    });

    // Fetch latest reviews on component mount
    useEffect(() => {
        fetchLatestReviews();
    }, []);

    const fetchLatestReviews = async () => {
        try {
            const response = await fetch('/api/get?action=reviews&page=1&limit=5');
            if (response.ok) {
                const data: ReviewsResponse = await response.json();
                if (data.success) {
                    setLatestReviews(data.data.reviews);
                    // Calculate stats
                    const total = data.data.totalReviews;
                    const pending = data.data.reviews.filter(r => r.status === 'Pending').length;
                    const approved = data.data.reviews.filter(r => r.status === 'Approved').length;
                    setReviewStats({ total, pending, approved });
                }
            } else {
                // Fallback to dummy data if API fails
                setLatestReviews([
                    { id: 1, user: 'John Doe', review: 'Great product!', rating: 5, status: 'Approved' },
                    { id: 2, user: 'Jane Smith', review: 'Could be better.', rating: 3, status: 'Pending' },
                    { id: 3, user: 'Alice Brown', review: 'Not satisfied.', rating: 2, status: 'Rejected' },
                ]);
                setReviewStats({ total: 120, pending: 35, approved: 85 });
            }
        } catch (error) {
            console.error('Error fetching reviews:', error);
            // Fallback to dummy data
            setLatestReviews([
                { id: 1, user: 'John Doe', review: 'Great product!', rating: 5, status: 'Approved' },
                { id: 2, user: 'Jane Smith', review: 'Could be better.', rating: 3, status: 'Pending' },
                { id: 3, user: 'Alice Brown', review: 'Not satisfied.', rating: 2, status: 'Rejected' },
            ]);
            setReviewStats({ total: 120, pending: 35, approved: 85 });
        }
    };

    const handleLogout = async () => {
        setIsLoading(true);
        try {
            await fetch('/api/admin/logout', { method: 'POST' });
            router.push('/admin/login');
        } catch (error) {
            console.error('Logout error:', error);
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-6">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Admin Dashboard</h2>
                <button
                    onClick={handleLogout}
                    disabled={isLoading}
                    className="w-full sm:w-auto bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors touch-friendly"
                >
                    {isLoading ? 'Logging out...' : 'Logout'}
                </button>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-6 md:mb-10">
                <div className="bg-white shadow rounded-lg p-4 sm:p-6">
                    <h3 className="text-base sm:text-lg font-semibold mb-2 text-gray-700">Total Reviews</h3>
                    <p className="text-3xl sm:text-4xl font-bold text-blue-600">{reviewStats.total}</p>
                </div>
                <div className="bg-white shadow rounded-lg p-4 sm:p-6">
                    <h3 className="text-base sm:text-lg font-semibold mb-2 text-gray-700">Pending Reviews</h3>
                    <p className="text-3xl sm:text-4xl font-bold text-yellow-600">{reviewStats.pending}</p>
                </div>
                <div className="bg-white shadow rounded-lg p-4 sm:p-6">
                    <h3 className="text-base sm:text-lg font-semibold mb-2 text-gray-700">Approved Reviews</h3>
                    <p className="text-3xl sm:text-4xl font-bold text-green-600">{reviewStats.approved}</p>
                </div>
            </div>

            {/* Latest Reviews Section */}
            <div className="bg-white shadow rounded-lg p-4 sm:p-6 mb-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4">
                    <h3 className="text-lg sm:text-2xl font-semibold text-gray-800">Latest Reviews</h3>
                    <button
                        onClick={() => router.push('/admin/reviews')}
                        className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors touch-friendly"
                    >
                        View All Reviews
                    </button>
                </div>

                {/* Responsive Table Wrapper */}
                <div className="overflow-x-auto -mx-4 sm:mx-0">
                    <table className="w-full bg-white text-sm sm:text-base">
                        <thead>
                            <tr className="bg-gray-50 border-b">
                                <th className="py-2 sm:py-3 px-3 sm:px-4 text-left font-semibold text-gray-700">User</th>
                                <th className="py-2 sm:py-3 px-3 sm:px-4 text-left font-semibold text-gray-700 hidden sm:table-cell">Review</th>
                                <th className="py-2 sm:py-3 px-3 sm:px-4 text-center font-semibold text-gray-700">Rating</th>
                                <th className="py-2 sm:py-3 px-3 sm:px-4 text-center font-semibold text-gray-700">Status</th>
                                <th className="py-2 sm:py-3 px-3 sm:px-4 text-center font-semibold text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {latestReviews.length > 0 ? (
                                latestReviews.map((review) => (
                                    <tr key={review.id} className="border-b hover:bg-gray-50 transition-colors">
                                        <td className="py-2 sm:py-3 px-3 sm:px-4">
                                            <div className="font-medium text-gray-900 truncate">{review.user}</div>
                                            {review.product_name && (
                                                <div className="text-xs sm:text-sm text-gray-500 truncate">{review.product_name}</div>
                                            )}
                                        </td>
                                        <td className="py-2 sm:py-3 px-3 sm:px-4 hidden sm:table-cell">
                                            <div className="max-w-xs truncate text-gray-700">
                                                {review.review}
                                            </div>
                                        </td>
                                        <td className="py-2 sm:py-3 px-3 sm:px-4 text-center">
                                            <div className="flex justify-center gap-0.5">
                                                {[...Array(5)].map((_, i) => (
                                                    <span
                                                        key={i}
                                                        className={i < review.rating ? 'text-yellow-400 text-sm sm:text-base' : 'text-gray-300 text-sm sm:text-base'}
                                                    >
                                                        ⭐
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="py-2 sm:py-3 px-3 sm:px-4 text-center">
                                            <span
                                                className={`inline-block px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${review.status === 'Approved'
                                                    ? 'bg-green-100 text-green-800'
                                                    : review.status === 'Pending'
                                                        ? 'bg-yellow-100 text-yellow-800'
                                                        : 'bg-red-100 text-red-800'
                                                    }`}
                                            >
                                                {review.status}
                                            </span>
                                        </td>
                                        <td className="py-2 sm:py-3 px-2 sm:px-4 text-center">
                                            <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 justify-center">
                                                <button
                                                    onClick={() => router.push(`/admin/reviews/${review.id}`)}
                                                    className="bg-blue-500 hover:bg-blue-600 text-white px-2 sm:px-3 py-1 rounded text-xs sm:text-sm transition-colors"
                                                >
                                                    View
                                                </button>
                                                <button className="bg-gray-500 hover:bg-gray-600 text-white px-2 sm:px-3 py-1 rounded text-xs sm:text-sm transition-colors">
                                                    Edit
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="py-8 text-center text-gray-500">
                                        No reviews found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                <div className="bg-white shadow rounded-lg p-6">
                    <h3 className="text-xl font-semibold mb-4">Review Distribution</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-600">Approved</span>
                            <div className="flex items-center">
                                <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                                    <div
                                        className="bg-green-500 h-2 rounded-full"
                                        style={{ width: `${reviewStats.total ? (reviewStats.approved / reviewStats.total) * 100 : 0}%` }}
                                    ></div>
                                </div>
                                <span className="text-sm font-bold">{reviewStats.approved}</span>
                            </div>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-600">Pending</span>
                            <div className="flex items-center">
                                <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                                    <div
                                        className="bg-yellow-500 h-2 rounded-full"
                                        style={{ width: `${reviewStats.total ? (reviewStats.pending / reviewStats.total) * 100 : 0}%` }}
                                    ></div>
                                </div>
                                <span className="text-sm font-bold">{reviewStats.pending}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white shadow rounded-lg p-6">
                    <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                        <button
                            onClick={() => router.push('/admin/reviews')}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                        >
                            Manage All Reviews
                        </button>
                        <button
                            onClick={() => router.push('/admin/products')}
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                        >
                            Manage Products
                        </button>
                        <button
                            onClick={() => router.push('/admin/categories')}
                            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                        >
                            Manage Categories
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
