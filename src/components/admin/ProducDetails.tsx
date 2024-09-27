'use client';
import { FC } from 'react';
import { Product } from '@/lib/types'; // Assuming you have a Product type
import Link from 'next/link';
interface ProductDetailsProps {
  products: Product[]; // Change to array of Product
  onDelete: (id: number) => void; // Function to handle delete action
}

const ProductDetails: FC<ProductDetailsProps> = ({ products, onDelete }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border">ID</th>
            <th className="py-2 px-4 border">Name</th>
            <th className="py-2 px-4 border">Brand</th>
            <th className="py-2 px-4 border">Category</th>
            <th className="py-2 px-4 border">Price</th>
            <th className="py-2 px-4 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td className="py-2 px-4 border">{product.id}</td>
              <td className="py-2 px-4 border">{product.name}</td>
              <td className="py-2 px-4 border">{product.brand}</td>
              <td className="py-2 px-4 border">{product.category}</td>
              <td className="py-2 px-4 border">{product.price}</td>
              <td className="py-2 px-4 border">
                <Link  className="bg-blue-500 text-white px-2 py-1 rounded mr-2" href={`reviews/${product.slug}`}>Review</Link>
                <Link  className="bg-blue-500 text-white px-2 py-1 rounded mr-2" href={`reviews/${product.id}`}>Edit</Link>
                 
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded"
                  onClick={() => onDelete(product.id)}
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

export default ProductDetails;
