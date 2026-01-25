// BrandDetails.tsx (must be in /app directory or imported into a Server Component)
import { updateBrandStatus } from '@/app/actions/updateBrandStatus';
import { Brand } from '@/lib/types';
import Link from 'next/link';
import { useState } from 'react';

interface PageProps {
  brands: Brand[];
}

const BrandDetails = ({ brands }: PageProps) => {
  // Ensure brands is an array

  const [brandList, setBrandList] = useState<Brand[]>(Array.isArray(brands) ? brands : []);

  const userType = typeof window !== 'undefined' ? localStorage.getItem('userType') : null;

  if (brandList.length === 0) {
    return (
      <div className="overflow-x-auto bg-white shadow-md rounded-lg p-6">
        <p className="text-center text-gray-500">No brands found.</p>
      </div>
    );
  }

  const brandStatusUpdate = async (brand_id: number, status: number) => {
    const response = await updateBrandStatus(brand_id, status);

    if (response?.success) {

      // Update brand status in the state
      setBrandList((prevBrands) =>
        prevBrands.map((brand) =>
          brand.id === brand_id
            ? { ...brand, status: !!status } // Convert status to boolean
            : brand
        )
      );
    }
  };

  return (
    <div className="overflow-x-auto bg-white shadow-md rounded-lg p-6">
      <table className="min-w-full bg-white border-collapse">
        <thead>
          <tr className="text-left border-b">
            <th className="py-3 px-4 text-lg font-medium text-gray-700">ID</th>
            <th className="py-3 px-4 text-lg font-medium text-gray-700">Name</th>
            <th className="py-3 px-4 text-lg font-medium text-gray-700">Status</th>
            <th className="py-3 px-4 text-lg font-medium text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {brandList.map((brand) => (
            <tr key={brand.id ?? `null-${Math.random()}`} className="border-b hover:bg-gray-100">
              <td className="py-2 px-4 text-sm">{brand.id}</td>
              <td className="py-2 px-4 text-sm">{brand.name}</td>
              <td className="py-2 px-4 text-sm">
                <span
                  className={`inline-block rounded-full px-3 py-1 text-sm font-semibold ${brand.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                >
                  {brand.status ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td className="py-2 px-4">
                {userType !== 'reviewer' && (
                  <Link
                    className="bg-yellow-500 text-white px-3 py-2 rounded-md mr-2 hover:bg-yellow-600"
                    href={`/admin/brand/manage/${brand.id}`}
                  >
                    Edit
                  </Link>
                )}

                {brand.id !== null && userType !== 'reviewer' && (
                  <button
                    className={`${brand.status ? 'bg-red-500' : 'bg-green-500'} text-white px-4 py-2 rounded-md hover:bg-opacity-80`}
                    onClick={() => brandStatusUpdate(brand.id!, brand.status ? 0 : 1)}
                  >
                    {brand.status ? 'Deactivate' : 'Activate'}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BrandDetails;
