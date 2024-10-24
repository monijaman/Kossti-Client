'use client';
import { FC } from 'react';
import { SpecificationKey } from '@/lib/types'; // Assuming you have a Product type
import Link from 'next/link';
interface ProductDetailsProps {
  keys: SpecificationKey[]; // Change to array of Product
}

const ProductDetails: FC<ProductDetailsProps> = ({ keys }) => {


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
          </tr>
        </thead>
        <tbody>
          {keys.map((key) => (
            <tr key={key.id}>
              <td className="py-2 px-4 border">{key.id}</td>
              <td className="py-2 px-4 border">{key.specification_key}</td>
              <td className="py-2 px-4 border">
                <Link className="bg-blue-500 text-white px-2 py-1 rounded mr-2" href={`/keys/manage/${key.id}`}>Edit</Link>

                {/* <button
                  className="bg-red-500 text-white px-2 py-1 rounded"
                  onClick={() => deleteProduct(product.id)}
                >
                  Delete
                </button> */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductDetails;
