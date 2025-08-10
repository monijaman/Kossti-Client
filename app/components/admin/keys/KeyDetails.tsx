'use client';
import { SpecificationKey } from '@/lib/types';
import Link from 'next/link';
import { FC } from 'react';

interface ProductDetailsProps {
  keys: SpecificationKey[];
}

const ProductDetails: FC<ProductDetailsProps> = ({ keys }) => {
  const deleteKey = (id: number) => {
    console.log(`Key with ID ${id} deleted.`);
    // Add your delete logic here
  };

  return (
    <div className="overflow-x-auto">
      <div className="min-w-full bg-white shadow-lg rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Key Name
              </th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {keys.map((key) => (
              <tr
                key={key.id}
                className="hover:bg-gray-50 transition duration-200 ease-in-out"
              >
                <td className="py-4 px-6">{key.id}</td>
                <td className="py-4 px-6">{key.specification_key}</td>
                <td className="py-4 px-6 space-x-2">
                  <Link
                    href={`/admin/keys/manage/${key.id}`}
                    className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-1 rounded"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => key.id !== null && deleteKey(key.id)}
                    className="bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1 rounded"
                  >
                    Delete
                  </button>

                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Show a message if no keys are available */}
        {keys.length === 0 && (
          <div className="text-center py-6">
            <p className="text-gray-500">No specification keys found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
