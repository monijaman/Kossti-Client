// BrandDetails.tsx (must be in /app directory or imported into a Server Component)

import { Brand } from '@/lib/types';
import Link from 'next/link';
import { updateBrandStatus } from '@/app/actions/updateBrandStatus';

interface PageProps {
  brands: Brand[];
}

const BrandDetails = ({ brands }: PageProps) => {
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
          {brands.map((brand) => (
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
                <Link
                  className="bg-yellow-500 text-white px-3 py-2 rounded-md mr-2 hover:bg-yellow-600"
                  href={`/admin/brands/manage/${brand.id}`}
                >
                  Edit
                </Link>

                {brand.id !== null && (
                  <form action={() => updateBrandStatus(brand.id!, brand.status ? 0 : 1)}>
                    <button
                      type="submit"
                      className={`${brand.status ? 'bg-green-500' : 'bg-red-500'} text-white px-4 py-2 rounded-md hover:bg-opacity-80`}
                    >
                      {brand.status ? 'Deactivate' : 'Activate'}
                    </button>
                  </form>
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
