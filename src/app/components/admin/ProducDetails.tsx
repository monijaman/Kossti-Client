'use client';
import { Product } from '@/lib/types';
import Link from 'next/link';

interface ProductDetailsProps {
  products: Product[];
  countryCode: string;
}

const ProductDetails = ({ products, countryCode }: ProductDetailsProps) => {
  const deleteProduct = (id: number) => {
    console.log(`Delete product with ID: ${id}`);
  };

  return (
    <div className="overflow-x-auto">
      <div className="min-w-full bg-white shadow-lg rounded-lg overflow-hidden">

        <h2>{countryCode}</h2>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Brand</th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-100 transition duration-300 ease-in-out">
                <td className="py-4 px-6">{product.id}</td>
                <td className="py-4 px-6">{product.name}</td>
                <td className="py-4 px-6">{product.brand}</td>
                <td className="py-4 px-6">{product.category}</td>
                {/* Safely handle product.price to avoid TypeError */}
                <td className="py-4 px-6">
                  {typeof product.price === 'number'
                    ? `$${product.price.toFixed(2)}`
                    : 'N/A'}
                </td>
                <td className="py-4 px-6 space-x-2">
                  <Link
                    href={`reviews/${product.id}`}
                    className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-1 rounded"
                  >
                    Review
                  </Link>
                  <Link
                    href={`products/${product.id}`}
                    className="bg-green-500 hover:bg-green-600 text-white text-sm px-3 py-1 rounded"
                  >
                    View
                  </Link>
                  <Link
                    href={`products/${product.id}`}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white text-sm px-3 py-1 rounded"
                  >
                    Edit
                  </Link>
                  <Link
                    href={`specifications/${product.id}`}
                    className="bg-indigo-500 hover:bg-indigo-600 text-white text-sm px-3 py-1 rounded"
                  >
                    Specs
                  </Link>
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1 rounded"
                    onClick={() => deleteProduct(product.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* If no products are available, show a message */}
        {products.length === 0 && (
          <div className="text-center py-6">
            <p className="text-gray-500">No products found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
