// BrandDetails.tsx (must be in /app directory or imported into a Server Component)
import { updateBrandStatus } from '@/app/actions/updateBrandStatus';
import { Brand } from '@/lib/types';
import { MarketProduct } from '@/lib/types';
import { apiEndpoints } from '@/lib/constants';
import fetchApi from '@/lib/fetchApi';
import Modal from '@/app/components/Modal/client';
import Link from 'next/link';
import { useState } from 'react';

interface PageProps {
  brands: Brand[];
}

const BrandDetails = ({ brands }: PageProps) => {
  // Ensure brands is an array

  const [brandList, setBrandList] = useState<Brand[]>(Array.isArray(brands) ? brands : []);
  const [isMarketModalOpen, setIsMarketModalOpen] = useState(false);
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

  const fetchMarketProducts = async (brand: Brand) => {
    console.log('=== fetchMarketProducts called for brand ===', brand.name);
    setIsMarketModalOpen(true); // Open modal immediately
    setLoadingMarket(true);
    setMarketProducts([]); // Clear previous products
    
    try {
      console.log('Making API call to:', apiEndpoints.getMarketProducts);
      const response = await fetchApi<MarketProduct[]>(apiEndpoints.getMarketProducts, {
        queryParams: {
          brand_id: brand.id,
          brand_name: brand.name
        }
      });
      console.log('API Response:', response);
      
      if (response.success && response.data) {
        // response.data is already the array of MarketProduct[]
        const products = Array.isArray(response.data) ? response.data : [];
        console.log('Setting products:', products);
        setMarketProducts(products);
      } else {
        console.error('API call failed:', response.error);
        alert(`Failed to fetch market products: ${response.error || 'Unknown error'}`);
        setMarketProducts([]); // Reset to empty array on error
        setIsMarketModalOpen(false); // Close modal on error
      }
    } catch (error) {
      console.error('Error fetching market products:', error);
      alert('Error fetching market products. Please check if the server is running.');
      setMarketProducts([]); // Reset to empty array on error
      setIsMarketModalOpen(false); // Close modal on error
    } finally {
      setLoadingMarket(false);
    }
  };

  const importProduct = async (product: MarketProduct) => {
    try {
      const productData = {
        name: product.name,
        description: product.description,
        price: product.price || 99.99,
        category_id: product.category_id || 1,
        brand_id: 1, // Default brand, could be made dynamic
        status: true,
      };

      const response = await fetchApi(apiEndpoints.createProduct, {
        method: 'POST',
        body: productData,
      });

      if (response.success) {
        alert('Product imported successfully!');
        // Optionally refresh the market products or remove the imported one
      } else {
        alert(`Failed to import product: ${response.error || 'Unknown error'}`);
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
                    onClick={() => fetchMarketProducts(brand)}
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


      {isMarketModalOpen && loadingMarket && (
        <div className="mt-8 text-center">
          <p className="text-lg text-gray-500">Loading market products...</p>
        </div>
      )}

      {isMarketModalOpen && !loadingMarket && Array.isArray(marketProducts) && marketProducts.length === 0 && (
        <div className="mt-8 text-center">
          <p className="text-lg text-gray-500">No market products available.</p>
        </div>
      )}

      <Modal isOpen={isMarketModalOpen} onClose={() => setIsMarketModalOpen(false)}>
        <div>
          <h3 className="text-2xl font-bold text-gray-800 mb-6">New Products Available in Market</h3>
          
          {loadingMarket && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
              <p className="mt-3 text-gray-600 text-lg">Loading market products...</p>
            </div>
          )}
          
          {!loadingMarket && Array.isArray(marketProducts) && marketProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No market products available.</p>
            </div>
          )}
          
          {!loadingMarket && Array.isArray(marketProducts) && marketProducts.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full bg-white border-collapse">
                <thead className="bg-gray-100 sticky top-0">
                  <tr className="text-left border-b-2 border-gray-400">
                    <th className="py-3 px-4 font-semibold text-gray-700 whitespace-nowrap">Product Name</th>
                    <th className="py-3 px-4 font-semibold text-gray-700">Description</th>
                    <th className="py-3 px-4 font-semibold text-gray-700 whitespace-nowrap">Category</th>
                    <th className="py-3 px-4 font-semibold text-gray-700 text-center whitespace-nowrap">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(marketProducts) && marketProducts.map((product, index) => (
                    <tr key={index} className="border-b border-gray-200 hover:bg-blue-50 transition">
                      <td className="py-3 px-4 text-sm font-medium text-gray-800">{product.name}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{product.description}</td>
                      <td className="py-3 px-4 text-sm text-gray-700">{product.type}</td>
                      <td className="py-3 px-4 text-center">
                        <button
                          className="bg-green-500 text-white px-3 py-2 rounded-md hover:bg-green-600 transition text-sm whitespace-nowrap"
                          onClick={() => importProduct(product)}
                        >
                          Import
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default BrandDetails;
