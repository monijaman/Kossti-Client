'use client';
import { FC } from 'react';
import { Review, Product } from '@/lib/types'; // Assuming you have a Product type
import Link from 'next/link';


interface ReviewData {
  id: number;
  review: {
    id: number;
    user_id: number;
    rating: number;
    reviews: string; // Assuming this is the HTML string containing the review
    additional_details: { youtubeUrl: string }[];
    priority: number;
    created_at: string;
    updated_at: string;
  };
  product: {
    id: number;
    name: string;
    slug: string;
    category_id: string;
    brand_id: number;
    model: string | null;
    price: string;
    status: boolean;
    priority: number;
    created_by: string | null;
    created_at: string;
    updated_at: string;
    updated_by: string | null;
    deleted_at: string | null;
    pivot: {
      productable_type: string;
      productable_id: number;
      product_id: string;
      created_at: string;
      updated_at: string;
    };
  };
}

interface PageProps {
  reviews: ReviewData; // Using the structured ReviewData type
}


 
const Reviewetails = ({ reviews }: PageProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border">Product</th>
            <th className="py-2 px-4 border">Product</th>
            <th className="py-2 px-4 border">Review</th>
            <th className="py-2 px-4 border">Rating</th>
            <th className="py-2 px-4 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((dataset) => (
            <tr key={dataset.review.id}>
              <td className="py-2 px-4 border"> {dataset.review.id}  </td>
              <td className="py-2 px-4 border"><Link href={`products/${dataset.review.id}`}>{dataset.product.name}</Link></td>
              <td className="py-2 px-4 border">
                {dataset.review.reviews.length > 300 ? (
                  <span
                    dangerouslySetInnerHTML={{
                      __html: dataset.review.reviews.slice(0, 300) + '...',
                    }}
                  />
                ) : (
                  <span
                    dangerouslySetInnerHTML={{
                      __html: dataset.review.reviews,
                    }}
                  />
                )}
              </td>
              <td className="py-2 px-4 border">{dataset.review.rating}</td>
              <td className="py-2 px-4 border">

                <Link className="bg-blue-500 text-white px-2 py-1 rounded mr-2" href={`reviews/${dataset.review.id}`}>View</Link>
                <Link className="bg-blue-500 text-white px-2 py-1 rounded mr-2" href={`reviews/${dataset.review.id}`}>Edit</Link>

              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Reviewetails;
