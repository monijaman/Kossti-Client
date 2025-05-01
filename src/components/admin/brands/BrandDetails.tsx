 import { Brand } from '@/lib/types';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import fetchApi from '@/lib/fetchApi';
import { apiEndpoints } from '@/lib/constants';
interface PageProps {
  brands: Brand[];
}

const BrandDetails = ({ brands }: PageProps) => {
  // Initialize state with categories prop
  const [brandList, setBrandList] = useState<Brand[]>([]);

 
  useEffect(() => {
    setBrandList(brands);
  }, [brands]);

  const statusUpdate = async (brand_id: number, status: number) => {

    if (brand_id == null || status == null) {
      return; // Early return if either value is null
    }


    const response= await fetchApi(
      apiEndpoints.updateBrandStatus(brand_id),
      {
        method: 'POST',
        body: { status }, 
        headers: { 'Content-Type': 'application/json' },
      }
    );
    

  // const response = await  brandStatUpdate({ brand_id, status });
  if (response?.success) {
    // Correctly update the brandList state using setBrandList
    setBrandList((prevBrands) =>
      prevBrands.map((brand) =>
        brand.id === brand_id
          ? { ...brand, status: !!status } // Ensure the status remains a number (0 or 1)
          : brand
      )
    );
  }
};


return (
  <div className="overflow-x-auto bg-white shadow-md rounded-lg p-6 bg-white shadow rounded-lg p-6">
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
        {brandList?.map((brand) => (
          <tr key={brand.id} className="border-b hover:bg-gray-100">
            <td className="py-2 px-4 text-sm">{brand.id}</td>
            <td className="py-2 px-4 text-sm">{brand.name}</td>
            <td className="py-2 px-4 text-sm">
              <span
                className={`inline-block rounded-full px-3 py-1 text-sm font-semibold ${brand.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}
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

              <button
                className={`${brand.status ? 'bg-green-500' : 'bg-red-500'} text-white px-4 py-2 rounded-md hover:bg-opacity-80`}
                onClick={() => {
                  if (brand.id != null) {
                    statusUpdate(brand.id, brand.status ? 0 : 1);
                  }
                }}
              >
                {brand.status ? 'Deactivate' : 'Activate'}
              </button>



            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
};

export default BrandDetails;
