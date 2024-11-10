'use client';
import { Product, Review } from '@/lib/types'; // Assuming you have a Product type
import Link from 'next/link';

interface ReviewData {
  id: number;
  review: Review;
  product: Product;
}

interface PageProps {
  reviews: ReviewData[]; // Using the structured ReviewData type
}

const Reviewetails = ({ reviews }: PageProps) => {
  return (
    <div className="overflow-x-auto bg-gray-50 p-6 rounded-lg shadow-md">
      <h2 className="text-3xl font-semibold text-center mb-6">Reviews Management</h2>

      <table className="min-w-full bg-white shadow-lg rounded-lg overflow-hidden">
        <thead className="bg-blue-500 text-white">
          <tr>
            <th className="py-3 px-4 border text-left">ID</th>
            <th className="py-3 px-4 border text-left">Product</th>
            <th className="py-3 px-4 border text-left">Review</th>
            <th className="py-3 px-4 border text-left">Rating</th>
            <th className="py-3 px-4 border text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((dataset) => (
            <tr key={dataset.id} className="hover:bg-gray-100">
              <td className="py-3 px-4 border">{dataset.id}</td>
              <td className="py-3 px-4 border">
                <Link href={`products/${dataset.product.id}`} className="text-blue-600 hover:text-blue-800">
                  {dataset.product.name}
                </Link>
              </td>
              <td className="py-3 px-4 border">
                {dataset.review.reviews.length > 300 ? (
                  <span
                    dangerouslySetInnerHTML={{
                      __html: dataset.review.reviews.slice(0, 300) + '...',
                    }}
                  />
                ) : (
                  <span dangerouslySetInnerHTML={{ __html: dataset.review.reviews }} />
                )}
              </td>
              <td className="py-3 px-4 border">{dataset.review.rating}</td>
              <td className="py-3 px-4 border text-center">
                <Link
                  href={`reviews/${dataset.id}`}
                  className="bg-green-500 text-white px-3 py-1 rounded mr-2 hover:bg-green-600 transition duration-200"
                >
                  View
                </Link>
                <Link
                  href={`reviews/${dataset.id}`}
                  className="bg-yellow-500 text-white px-3 py-1 rounded mr-2 hover:bg-yellow-600 transition duration-200"
                >
                  Edit
                </Link>
                <Link
                  href={`reviews/${dataset.id}`}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition duration-200"
                >
                  Delete
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Reviewetails;
