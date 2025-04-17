"use client"
import { FC } from 'react';
import { SearchParams, brandInt, Product, ProductApiResponse } from '@/lib/types';
import ProducDetails from '@/components/admin/ProducDetails';

interface ProductDetailsProps {
  products: Product[];
  onEdit: (id: number) => void; // Function to handle edit action
  onDelete: (id: number) => void; // Function to handle delete action
  onReview: (id: number) => void; // Function to handle review action
}

const PopularProducts = ({ products, onEdit, onDelete, onReview }:ProductDetailsProps) => {

 

  return (
    <div className="grid grid-cols-1 gap-4">

      {products.map((product) => {
        return (
          <div key={product.id} className="overflow-x-auto">
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
              </tbody>
            </table>
          </div>
        );
      })}

    </div>
  );
};

export default PopularProducts;
