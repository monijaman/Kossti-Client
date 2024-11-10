
const Admin = () => {
    const dummyReviews = [
        { id: 1, user: 'John Doe', review: 'Great product!', rating: 5, status: 'Approved' },
        { id: 2, user: 'Jane Smith', review: 'Could be better.', rating: 3, status: 'Pending' },
        { id: 3, user: 'Alice Brown', review: 'Not satisfied.', rating: 2, status: 'Rejected' },
    ];

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h2 className="text-3xl font-bold mb-6">Admin Dashboard</h2>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-white shadow rounded-lg p-6">
                    <h3 className="text-xl font-semibold mb-2">Total Reviews</h3>
                    <p className="text-4xl font-bold">120</p>
                </div>
                <div className="bg-white shadow rounded-lg p-6">
                    <h3 className="text-xl font-semibold mb-2">Pending Reviews</h3>
                    <p className="text-4xl font-bold">35</p>
                </div>
                <div className="bg-white shadow rounded-lg p-6">
                    <h3 className="text-xl font-semibold mb-2">Approved Reviews</h3>
                    <p className="text-4xl font-bold">85</p>
                </div>
            </div>

            {/* Reviews Table */}
            <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-2xl font-semibold mb-4">Review Management</h3>
                <table className="min-w-full bg-white">
                    <thead>
                        <tr>
                            <th className="py-3 px-4 border-b">ID</th>
                            <th className="py-3 px-4 border-b">User</th>
                            <th className="py-3 px-4 border-b">Review</th>
                            <th className="py-3 px-4 border-b">Rating</th>
                            <th className="py-3 px-4 border-b">Status</th>
                            <th className="py-3 px-4 border-b">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dummyReviews.map((review) => (
                            <tr key={review.id}>
                                <td className="py-3 px-4 border-b text-center">{review.id}</td>
                                <td className="py-3 px-4 border-b">{review.user}</td>
                                <td className="py-3 px-4 border-b">{review.review}</td>
                                <td className="py-3 px-4 border-b text-center">{review.rating} ⭐</td>
                                <td className="py-3 px-4 border-b text-center">
                                    <span
                                        className={`inline-block px-3 py-1 rounded-full text-white ${review.status === 'Approved'
                                                ? 'bg-green-500'
                                                : review.status === 'Pending'
                                                    ? 'bg-yellow-500'
                                                    : 'bg-red-500'
                                            }`}
                                    >
                                        {review.status}
                                    </span>
                                </td>
                                <td className="py-3 px-4 border-b text-center">
                                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded mr-2">
                                        Edit
                                    </button>
                                    <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded">
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Admin;
