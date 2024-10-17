'use client';
import { FC } from 'react';
import { Product } from '@/lib/types'; // Assuming you have a Product type
import Link from 'next/link';
interface ProductDetailsProps {
  products: Product[]; // Change to array of Product
}

const ProductDetails: FC<ProductDetailsProps> = ({ products }) => {


  const deleteProduct = (id: number) => {

  }
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
                <Link className="bg-blue-500 text-white px-2 py-1 rounded mr-2" href={`reviews/${product.id}`}>Review</Link>
                <Link className="bg-blue-500 text-white px-2 py-1 rounded mr-2" href={`products/${product.id}`}>View</Link>
                <Link className="bg-blue-500 text-white px-2 py-1 rounded mr-2" href={`products/${product.id}`}>Edit</Link>
                <Link className="bg-blue-500 text-white px-2 py-1 rounded mr-2" href={`specifications/${product.id}`}>Specifications</Link>

                <button
                  className="bg-red-500 text-white px-2 py-1 rounded"
                  onClick={() => deleteProduct(product.id)}
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
