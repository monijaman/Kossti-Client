// BrandDetails.tsx (must be in /app directory or imported into a Server Component)
import { updateBrandStatus } from '@/app/actions/updateBrandStatus';
import { Brand } from '@/lib/types';
import { MarketProduct } from '@/lib/types';
import { apiEndpoints } from '@/lib/constants';
import fetchApi from '@/lib/fetchApi';
import Link from 'next/link';
import { useState } from 'react';

interface PageProps {
  brands: Brand[];
}

const BrandDetails = ({ brands }: PageProps) => {
  // Ensure brands is an array

  const [brandList, setBrandList] = useState<Brand[]>(Array.isArray(brands) ? brands : []);
  const [showMarketProducts, setShowMarketProducts] = useState(false);
  const [marketProducts, setMarketProducts] = useState<MarketProduct[]>([]);
  const [loadingMarket, setLoadingMarket] = useState(false);

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

  const fetchMarketProducts = async () => {
    setLoadingMarket(true);
    try {
      const response = await fetchApi<MarketProduct[]>(apiEndpoints.getMarketProducts);
      if (response.success && response.data) {
        setMarketProducts(response.data);
        setShowMarketProducts(true);
      }
    } catch (error) {
      console.error('Error fetching market products:', error);
    } finally {
      setLoadingMarket(false);
    }
  };

  const importProduct = async (product: MarketProduct) => {
    try {
      const response = await fetchApi(apiEndpoints.createProduct, {
        method: 'POST',
        body: {
          name: product.name,
          description: product.description,
          // Add other necessary fields, assuming defaults or from product
          price: product.price || 0,
          category_id: product.category_id || 1, // Default category
          brand_id: 1, // Perhaps the current brand? But since it's in brand page, maybe not.
          status: true,
        },
      });
      if (response.success) {
        alert('Product imported successfully');
        // Optionally remove from market products or refresh
      } else {
        alert('Failed to import product');
      }
    } catch (error) {
      console.error('Error importing product:', error);
      alert('Error importing product');
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

                {userType !== 'reviewer' && (
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 ml-2"
                    onClick={fetchMarketProducts}
                    disabled={loadingMarket}
                  >
                    {loadingMarket ? 'Loading...' : 'Show New Products'}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showMarketProducts && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">New Products Available in Market</h3>
          <table className="min-w-full bg-white border-collapse border border-gray-300">
            <thead>
              <tr className="text-left border-b">
                <th className="py-3 px-4 text-lg font-medium text-gray-700">Name</th>
                <th className="py-3 px-4 text-lg font-medium text-gray-700">Description</th>
                <th className="py-3 px-4 text-lg font-medium text-gray-700">Type</th>
                <th className="py-3 px-4 text-lg font-medium text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {marketProducts.map((product, index) => (
                <tr key={index} className="border-b hover:bg-gray-100">
                  <td className="py-2 px-4 text-sm">{product.name}</td>
                  <td className="py-2 px-4 text-sm">{product.description}</td>
                  <td className="py-2 px-4 text-sm">{product.type}</td>
                  <td className="py-2 px-4">
                    <button
                      className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                      onClick={() => importProduct(product)}
                    >
                      Import this Product
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BrandDetails;
