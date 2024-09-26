'use client';
import { FC } from 'react';
import { Product } from '@/lib/types'; // Assuming you have a Product type

interface ProductDetailsProps {
  products: Product[]; // Change to array of Product
  onEdit: (id: number) => void; // Function to handle edit action
  onDelete: (id: number) => void; // Function to handle delete action
  onReview: (id: number) => void; // Function to handle review action
}

const ProductDetails: FC<ProductDetailsProps> = ({ products, onEdit, onDelete, onReview }) => {
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
                <button
                  className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                  onClick={() => onReview(product.id)}
                >
                  Review
                </button>
                <button
                  className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                  onClick={() => onEdit(product.id)}
                >
                  Edit
                </button>
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
