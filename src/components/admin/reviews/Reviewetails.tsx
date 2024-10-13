'use client';
import { FC } from 'react';
import { Review } from '@/lib/types'; // Assuming you have a Product type
import Link from 'next/link';
interface PageProps {
  reviews: Review[]; // Change to array of Product
}

const Reviewetails  = ({ reviews }: PageProps) => {

  const makeInactive = (reviewId: number) =>{
    console.log('makeInactive', reviewId)
  }
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border">ID</th>
            <th className="py-2 px-4 border">Name</th>
             
            <th className="py-2 px-4 border">Rating</th>
            <th className="py-2 px-4 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((review) => (
            <tr key={review.id}>
              <td className="py-2 px-4 border">{review.id}</td>
              <td className="py-2 px-4 border">{review.rating}</td>
              <td className="py-2 px-4 border">{review.rating}</td>
              <td className="py-2 px-4 border">
                <Link className="bg-blue-500 text-white px-2 py-1 rounded mr-2" href={`reviews/${review.id}`}>Review</Link>
                <Link className="bg-blue-500 text-white px-2 py-1 rounded mr-2" href={`products/${review.id}`}>View</Link>
                <Link className="bg-blue-500 text-white px-2 py-1 rounded mr-2" href={`products/${review.id}`}>Edit</Link>

                <button
                  className="bg-red-500 text-white px-2 py-1 rounded"
                  onClick={() => makeInactive(review.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Reviewetails;
