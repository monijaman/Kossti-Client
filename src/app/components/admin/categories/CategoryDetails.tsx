'use client';
import { useCategory } from '@/hooks/useCategory';
import { apiEndpoints } from '@/lib/constants';
import fetchApi from '@/lib/fetchApi';
import Modal from '@/app/components/Modal/client';
import { Category, MarketProduct } from '@/lib/types';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface PageProps {
  categories: Category[];
  onSort?: (sortBy: SortField, sortOrder: SortOrder) => void;
  currentSortBy?: SortField;
  currentSortOrder?: SortOrder;
}

type SortField = 'name' | 'status';
type SortOrder = 'asc' | 'desc';

interface BrandOption {
  id: number;
  name: string;
}

const AUTO_DETECT_BRAND = '';

const CategoryDetails = ({ categories, onSort, currentSortBy = 'name', currentSortOrder = 'asc' }: PageProps) => {
  // Always initialize with an array
  const [categoryList, setCategoryList] = useState<Category[]>(Array.isArray(categories) ? categories : []);

  const { categoryStatUpdate } = useCategory();

  const userType = typeof window !== 'undefined' ? localStorage.getItem('userType') : null;

  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const [isMarketModalOpen, setIsMarketModalOpen] = useState(false);
  const [marketProducts, setMarketProducts] = useState<MarketProduct[]>([]);
  const [loadingMarket, setLoadingMarket] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Form state
  const [brands, setBrands] = useState<BrandOption[]>([]);
  const [selectedBrandId, setSelectedBrandId] = useState<string>(AUTO_DETECT_BRAND);
  const [instructions, setInstructions] = useState<string>('');

  // Fetch brands once on mount (used for the optional brand picker + auto-match on import)
  useEffect(() => {
    fetchApi(`${apiEndpoints.getBrands}?_t=${Date.now()}`)
      .then((res) => {
        const raw = (res.data as any)?.brands ?? res.data;
        setBrands(Array.isArray(raw) ? raw : []);
      })
      .catch(() => setBrands([]));
  }, []);

  const statusUpdate = async (category_id: number, status: number) => {
    const response = await categoryStatUpdate({ category_id, status });
    if (response?.success) {
      // Update category status in the state
      setCategoryList((prevCategories) =>
        prevCategories.map((category) =>
          category.id === category_id
            ? { ...category, status: !!status } // Convert status to boolean
            : category
        )
      );
    }
  };

  // Sorting handler
  const handleSort = (field: SortField) => {
    const newSortOrder = currentSortBy === field && currentSortOrder === 'asc' ? 'desc' : 'asc';
    if (onSort) {
      onSort(field, newSortOrder);
    }
  };

  useEffect(() => {
    setCategoryList(Array.isArray(categories) ? categories : []);
  }, [categories]);

  const openModal = (category: Category) => {
    setActiveCategory(category);
    setMarketProducts([]);
    setHasSearched(false);
    setSelectedBrandId(AUTO_DETECT_BRAND);
    setInstructions('');
    setIsMarketModalOpen(true);
  };

  const closeModal = () => {
    setIsMarketModalOpen(false);
    setActiveCategory(null);
    setMarketProducts([]);
    setHasSearched(false);
  };

  const handleSearch = async () => {
    if (!activeCategory) return;
    setLoadingMarket(true);
    setMarketProducts([]);
    setHasSearched(true);

    const selectedBrand = brands.find((b) => String(b.id) === selectedBrandId);

    try {
      const response = await fetchApi<MarketProduct[]>(apiEndpoints.getMarketProducts, {
        queryParams: {
          category_id: activeCategory.id,
          category_name: activeCategory.name,
          ...(selectedBrand ? { brand_id: selectedBrand.id, brand_name: selectedBrand.name } : {}),
          ...(instructions.trim() ? { instructions: instructions.trim() } : {}),
          _t: Date.now(),
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

  // Resolves a brand name suggested by the AI to an existing brand id,
  // creating the brand if it doesn't exist yet.
  const resolveBrandId = async (brandName: string): Promise<number | null> => {
    const trimmed = brandName.trim();
    if (!trimmed) return null;

    const existing = brands.find((b) => b.name.trim().toLowerCase() === trimmed.toLowerCase());
    if (existing) return existing.id;

    try {
      const response = await fetchApi(apiEndpoints.createBrand, {
        method: 'POST',
        body: { name: trimmed },
      });
      const created = (response.data as any)?.id ? (response.data as BrandOption) : null;
      if (created) {
        setBrands((prev) => [...prev, created]);
        return created.id;
      }
    } catch (error) {
      console.error('Error creating brand:', error);
    }
    return null;
  };

  const importProduct = async (product: MarketProduct) => {
    if (!activeCategory) return;

    const selectedBrand = brands.find((b) => String(b.id) === selectedBrandId);
    let brandId = selectedBrand?.id ?? null;

    if (!brandId) {
      brandId = await resolveBrandId(product.brand || '');
    }

    try {
      const productData = {
        name: product.name,
        description: product.description,
        price: product.price || 99.99,
        category_id: activeCategory.id,
        brand_id: brandId || 1,
        status: true,
        created_by: 'ai_import',
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
            <th
              className="py-3 px-4 text-lg font-medium text-gray-700 cursor-pointer hover:bg-gray-50 select-none"
              onClick={() => handleSort('name')}
            >
              Name
              {currentSortBy === 'name' && (
                <span className="ml-2">
                  {currentSortOrder === 'asc' ? '↑' : '↓'}
                </span>
              )}
            </th>
            <th
              className="py-3 px-4 text-lg font-medium text-gray-700 cursor-pointer hover:bg-gray-50 select-none"
              onClick={() => handleSort('status')}
            >
              Status
              {currentSortBy === 'status' && (
                <span className="ml-2">
                  {currentSortOrder === 'asc' ? '↑' : '↓'}
                </span>
              )}
            </th>
            <th className="py-3 px-4 text-lg font-medium text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categoryList?.map((category) => (
            <tr key={category.id} className="border-b hover:bg-gray-100">
              <td className="py-2 px-4 text-sm">{category.id}</td>
              <td className="py-2 px-4 text-sm">{category.name}</td>
              <td className="py-2 px-4 text-sm">
                <span
                  className={`inline-block rounded-full px-3 py-1 text-sm font-semibold ${category.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}
                >
                  {category.status ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td className="py-2 px-4 flex flex-wrap gap-2 items-center">
                <Link
                  className="bg-blue-500 text-white px-3 py-2 rounded-md hover:bg-blue-600"
                  href={`/admin/categories/${category.id}`}
                >
                  Brands
                </Link>
                {userType !== 'reviewer' && (
                  <Link
                    className="bg-yellow-500 text-white px-3 py-2 rounded-md hover:bg-yellow-600"
                    href={`/admin/categories/manage/${category.id}`}
                  >
                    Edit
                  </Link>
                )}
                {userType !== 'reviewer' && (
                  <button
                    className={`${category.status ? 'bg-green-500' : 'bg-red-500'
                      } text-white px-4 py-2 rounded-md hover:bg-opacity-80`}
                    onClick={() =>
                      statusUpdate(category.id, category.status ? 0 : 1)
                    }
                  >
                    {category.status ? 'Deactivate' : 'Activate'}
                  </button>
                )}
                {userType !== 'reviewer' && (
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                    onClick={() => openModal(category)}
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
          {activeCategory && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Category: <span className="font-semibold text-blue-600">{activeCategory.name}</span>
            </p>
          )}

          {/* Search form */}
          <div className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4 mb-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Brand <span className="text-gray-400 font-normal">(optional — leave as auto-detect to get a mix of brands)</span>
              </label>
              <select
                value={selectedBrandId}
                onChange={(e) => setSelectedBrandId(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-500 rounded-md px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={AUTO_DETECT_BRAND}>— Auto-detect brand (AI suggests, matched or created automatically) —</option>
                {brands.map((brand) => (
                  <option key={brand.id} value={String(brand.id)}>
                    {brand.name}
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
                placeholder="e.g. Focus on budget options released in 2024..."
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
              No products found. Try different instructions or a specific brand.
            </div>
          )}

          {!loadingMarket && marketProducts.length > 0 && (
            <div className="overflow-x-auto">
              <p className="text-xs text-gray-400 mb-2">{marketProducts.length} result(s)</p>
              <table className="w-full bg-white dark:bg-gray-800 border-collapse">
                <thead className="bg-gray-100 dark:bg-gray-700 sticky top-0">
                  <tr className="text-left border-b-2 border-gray-300 dark:border-gray-600">
                    <th className="py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">Product Name</th>
                    <th className="py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">Brand</th>
                    <th className="py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Description</th>
                    <th className="py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">Type</th>
                    <th className="py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300 text-center whitespace-nowrap">Import</th>
                  </tr>
                </thead>
                <tbody>
                  {marketProducts.map((product, index) => {
                    const selectedBrand = brands.find((b) => String(b.id) === selectedBrandId);
                    const displayBrand = selectedBrand?.name || product.brand || '—';
                    return (
                      <tr key={index} className="border-b border-gray-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-gray-700 transition">
                        <td className="py-3 px-4 text-sm font-medium text-gray-800 dark:text-gray-200">{product.name}</td>
                        <td className="py-3 px-4 text-sm text-gray-700 dark:text-gray-300">{displayBrand}</td>
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
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default CategoryDetails;
