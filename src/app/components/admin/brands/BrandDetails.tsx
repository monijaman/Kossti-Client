// BrandDetails.tsx (must be in /app directory or imported into a Server Component)
import { updateBrandStatus } from '@/app/actions/updateBrandStatus';
import { Brand, Category } from '@/lib/types';
import { MarketProduct } from '@/lib/types';
import { apiEndpoints } from '@/lib/constants';
import fetchApi from '@/lib/fetchApi';
import Modal from '@/app/components/Modal/client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface PageProps {
  brands: Brand[];
}

const BrandDetails = ({ brands }: PageProps) => {
  const [brandList, setBrandList] = useState<Brand[]>(Array.isArray(brands) ? brands : []);
  const [activeBrand, setActiveBrand] = useState<Brand | null>(null);
  const [isMarketModalOpen, setIsMarketModalOpen] = useState(false);
  const [marketProducts, setMarketProducts] = useState<MarketProduct[]>([]);
  const [loadingMarket, setLoadingMarket] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Form state
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [instructions, setInstructions] = useState<string>('');

  const userType = typeof window !== 'undefined' ? localStorage.getItem('userType') : null;

  // Fetch categories once on mount
  useEffect(() => {
    fetchApi(`${apiEndpoints.getCategories}?limit=1000&offset=0`)
      .then((res) => {
        const raw = (res.data as any)?.categories ?? res.data;
        setCategories(Array.isArray(raw) ? raw : []);
      })
      .catch(() => setCategories([]));
  }, []);

  if (brandList.length === 0) {
    return (
      <div className="overflow-x-auto bg-white shadow-md rounded-lg p-6">
        <p className="text-center text-gray-500">No brands found.</p>
      </div>
    );
  }

  const openModal = (brand: Brand) => {
    setActiveBrand(brand);
    setMarketProducts([]);
    setHasSearched(false);
    setSelectedCategoryId('');
    setInstructions('');
    setIsMarketModalOpen(true);
  };

  const closeModal = () => {
    setIsMarketModalOpen(false);
    setActiveBrand(null);
    setMarketProducts([]);
    setHasSearched(false);
  };

  const brandStatusUpdate = async (brand_id: number, status: number) => {
    const response = await updateBrandStatus(brand_id, status);
    if (response?.success) {
      setBrandList((prevBrands) =>
        prevBrands.map((brand) =>
          brand.id === brand_id ? { ...brand, status: !!status } : brand
        )
      );
    }
  };

  const handleSearch = async () => {
    if (!activeBrand) return;
    setLoadingMarket(true);
    setMarketProducts([]);
    setHasSearched(true);

    const selectedCategory = categories.find((c) => String(c.id) === selectedCategoryId);

    try {
      const response = await fetchApi<MarketProduct[]>(apiEndpoints.getMarketProducts, {
        queryParams: {
          brand_id: activeBrand.id,
          brand_name: activeBrand.name,
          ...(selectedCategory ? { category_name: selectedCategory.name, category_id: selectedCategory.id } : {}),
          ...(instructions.trim() ? { instructions: instructions.trim() } : {}),
        },
      });

      if (response.success && response.data) {
        const payload = response.data;
        let products: MarketProduct[] = [];
        if (Array.isArray(payload)) {
          products = payload;
        } else if (Array.isArray((payload as any).data)) {
          products = (payload as any).data;
        } else if (Array.isArray((payload as any).products)) {
          products = (payload as any).products;
        }
        setMarketProducts(products);
      } else {
        setMarketProducts([]);
      }
    } catch (error) {
      console.error('Error fetching market products:', error);
      setMarketProducts([]);
    } finally {
      setLoadingMarket(false);
    }
  };

  const importProduct = async (product: MarketProduct) => {
    const selectedCategory = categories.find((c) => String(c.id) === selectedCategoryId);
    try {
      const productData = {
        name: product.name,
        description: product.description,
        price: product.price || 99.99,
        category_id: selectedCategory?.id || product.category_id || 1,
        brand_id: activeBrand?.id || 1,
        status: true,
      };

      const response = await fetchApi(apiEndpoints.createProduct, {
        method: 'POST',
        body: productData,
      });

      if (response.success) {
        alert('Product imported successfully!');
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
              <td className="py-2 px-4 flex flex-wrap gap-2 items-center">
                {userType !== 'reviewer' && (
                  <Link
                    className="bg-yellow-500 text-white px-3 py-2 rounded-md hover:bg-yellow-600"
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
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                    onClick={() => openModal(brand)}
                  >
                    Get New Products
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal isOpen={isMarketModalOpen} onClose={closeModal}>
        <div>
          <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-1">
            New Products Available in Market
          </h3>
          {activeBrand && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Brand: <span className="font-semibold text-blue-600">{activeBrand.name}</span>
            </p>
          )}

          {/* Search form */}
          <div className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4 mb-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Category <span className="text-gray-400 font-normal">(optional — narrows AI results)</span>
              </label>
              <select
                value={selectedCategoryId}
                onChange={(e) => setSelectedCategoryId(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-500 rounded-md px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">— All categories —</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={String(cat.id)}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Extra instructions <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <textarea
                rows={3}
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="e.g. Focus on budget smartphones released in 2024..."
                className="w-full border border-gray-300 dark:border-gray-500 rounded-md px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            <button
              onClick={handleSearch}
              disabled={loadingMarket}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold py-2 px-4 rounded-md transition text-sm"
            >
              {loadingMarket ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Searching…
                </span>
              ) : (
                '🔍 Search with AI'
              )}
            </button>
          </div>

          {/* Results */}
          {loadingMarket && (
            <div className="text-center py-10">
              <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500" />
              <p className="mt-3 text-gray-500 text-sm">AI is researching products…</p>
            </div>
          )}

          {!loadingMarket && hasSearched && marketProducts.length === 0 && (
            <div className="text-center py-10 text-gray-500 text-sm">
              No products found. Try different instructions or category.
            </div>
          )}

          {!loadingMarket && marketProducts.length > 0 && (
            <div className="overflow-x-auto">
              <p className="text-xs text-gray-400 mb-2">{marketProducts.length} result(s)</p>
              <table className="w-full bg-white dark:bg-gray-800 border-collapse">
                <thead className="bg-gray-100 dark:bg-gray-700 sticky top-0">
                  <tr className="text-left border-b-2 border-gray-300 dark:border-gray-600">
                    <th className="py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">Product Name</th>
                    <th className="py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Description</th>
                    <th className="py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">Type</th>
                    <th className="py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300 text-center whitespace-nowrap">Import</th>
                  </tr>
                </thead>
                <tbody>
                  {marketProducts.map((product, index) => (
                    <tr key={index} className="border-b border-gray-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-gray-700 transition">
                      <td className="py-3 px-4 text-sm font-medium text-gray-800 dark:text-gray-200">{product.name}</td>
                      <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{product.description}</td>
                      <td className="py-3 px-4 text-sm text-gray-700 dark:text-gray-300">{product.type}</td>
                      <td className="py-3 px-4 text-center">
                        <button
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-md text-sm whitespace-nowrap"
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
