"use client"
import Pagination from '@/app/components/Pagination/index';
import ProductDetails from '@/app/components/admin/ProducDetails';
import { apiEndpoints } from '@/lib/constants';
import fetchApi from '@/lib/fetchApi';
import { Brand, Category, Product } from '@/lib/types';
import useDebounce from '@/lib/useDebounce';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { SingleValue } from 'react-select';
import DarkSelect from '@/components/DarkSelect';

const ManageReviews = () => {
    const searchParams = useSearchParams();
    const router = useRouter();

    const page = parseInt(searchParams.get('page') || '1', 10);
    const urlSearchTerm = searchParams.get('search') || '';
    const [searchTerm, setSearchTerm] = useState(urlSearchTerm);
    const [categories, setCategories] = useState<Category[]>([]);
    const [brands, setBrands] = useState<Brand[]>([]);

    const debouncedSearchTerm = useDebounce({ value: searchTerm, delay: 500 });
    const limit = 10;
    const activeCategory = searchParams.get('category') || '';
    const activeBrands = searchParams.get('brand') || '';
    const activePriceRange = searchParams.get('price') || '';
    const showInactive = searchParams.get('include_inactive') === 'true';
    const importedOnly = searchParams.get('imported') === 'true';
    const activeStatus = searchParams.get('status') || '';
    const activeSortBy = searchParams.get('sortby') || '';
    const visibleCategories = Array.isArray(categories)
        ? categories.filter((cat) => showInactive || Number(cat.status) === 1)
        : [];
    const locale = searchParams.get('locale') || 'en';
    const [products, setProducts] = useState<Product[]>([]);
    const [totalPage, setTotalPage] = useState(0);
    const [selectedCategory, setSelectedCategory] = useState<number | null>(
        activeCategory ? parseInt(activeCategory, 10) : null
    );
    const [selectedBrand, setSelectedBrand] = useState<number | null>(
        activeBrands ? parseInt(activeBrands, 10) : null
    );

    // Keep the input state in sync when the page is opened or navigated to
    // with a search query (for example, via a pagination link).
    useEffect(() => {
        setSearchTerm(urlSearchTerm);
    }, [urlSearchTerm]);

    // Fetch products data; re-run when paging, filters or debounced search term change
    useEffect(() => {
        const fetchProductData = async () => {
            // Build query parameters
            const params: Record<string, string | number | null | undefined> = {
                page: page,
                limit: limit,
                locale: locale,
            };

            if (activeCategory) params.category = activeCategory;
            if (activeBrands) params.brand = activeBrands;
            if (activePriceRange) params.priceRange = activePriceRange;
            if (showInactive) params.include_inactive = 'true';
            if (importedOnly) params.imported = 'true';
            if (activeStatus) params.status = activeStatus;
            if (activeSortBy) params.sortby = activeSortBy;
            if (debouncedSearchTerm && debouncedSearchTerm.trim() !== '') {
                params.search = debouncedSearchTerm.trim();
            }

            try {
                const response = await fetchApi(apiEndpoints.getProducts, {
                    method: 'GET',
                    queryParams: params,
                });

                if (response.success && response.data) {
                    const apiResponse = response.data as {
                        data: Product[];
                        meta: { total: number };
                    };
                    setTotalPage(Math.ceil(apiResponse.meta?.total / limit) || 0);
                    setProducts(apiResponse.data || []);
                } else {
                    setProducts([]);
                    setTotalPage(0);
                }
            } catch (error) {
                console.error('Error fetching products:', error);
                setProducts([]);
                setTotalPage(0);
            }
        };

        fetchProductData();
    }, [page, debouncedSearchTerm, activeCategory, activeBrands, activePriceRange, locale, showInactive, importedOnly, activeStatus, activeSortBy]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', '1');
        router.replace(`?${params.toString()}`);
    };

    // Fetch categories. The backend caps `limit` at 100 per request
    // regardless of what's asked for, so a single fetch silently drops
    // categories beyond the first page - page through until a short
    // (non-full) page comes back.
    const fetchCategories = async () => {
        try {
            const pageSize = 100;
            let offset = 0;
            let allCategories: Category[] = [];

            while (true) {
                const response = await fetchApi(`${apiEndpoints.Categories}?limit=${pageSize}&offset=${offset}`);
                const apiResponse = response as { success: boolean; data: { categories: Category[], count: number, limit: number, offset: number } };

                if (!apiResponse.success) {
                    console.error("Failed to fetch categories.");
                    break;
                }

                const batch = apiResponse.data.categories || [];
                allCategories = allCategories.concat(batch);

                if (batch.length < pageSize) break;
                offset += pageSize;
            }

            setCategories(allCategories);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    // Function to handle category selection
    const handleCategoryChange = (selectedOption: SingleValue<{ value: number; label: string }>) => {
        if (selectedOption) {
            const categoryId = selectedOption.value;
            setSelectedCategory(categoryId);
            // Update URL with the selected category
            const params = new URLSearchParams(searchParams.toString());
            params.set('category', categoryId.toString());
            params.delete('brand');
            params.set('page', '1'); // Reset to page 1 when category changes
            router.push(`?${params.toString()}`);
        } else {
            setSelectedCategory(null);
            // Remove category from URL
            const params = new URLSearchParams(searchParams.toString());
            params.delete('category');
            params.delete('brand');
            params.set('page', '1');
            router.push(`?${params.toString()}`);
        }
    };

    const handleInactiveChange = (checked: boolean) => {
        const params = new URLSearchParams(searchParams.toString());
        if (checked) params.set('include_inactive', 'true');
        else params.delete('include_inactive');
        params.set('page', '1');
        router.push(`?${params.toString()}`);
    };

    const handleImportedChange = (checked: boolean) => {
        const params = new URLSearchParams(searchParams.toString());
        if (checked) params.set('imported', 'true');
        else params.delete('imported');
        params.set('page', '1');
        router.push(`?${params.toString()}`);
    };

    const handleStatusChange = (selectedOption: SingleValue<{ value: string; label: string }>) => {
        const params = new URLSearchParams(searchParams.toString());
        if (selectedOption && selectedOption.value) params.set('status', selectedOption.value);
        else params.delete('status');
        params.set('page', '1');
        router.push(`?${params.toString()}`);
    };

    const handleSortByChange = (selectedOption: SingleValue<{ value: string; label: string }>) => {
        const params = new URLSearchParams(searchParams.toString());
        if (selectedOption && selectedOption.value) params.set('sortby', selectedOption.value);
        else params.delete('sortby');
        params.set('page', '1');
        router.push(`?${params.toString()}`);
    };

    const statusOptions = [
        { value: '', label: 'All statuses' },
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
        { value: 'all', label: 'Active + Inactive' },
    ];

    const sortByOptions = [
        { value: '', label: 'Default' },
        { value: 'priority', label: 'Priority' },
        { value: 'popular', label: 'Most popular (views)' },
        { value: 'rating', label: 'Highest rated' },
        { value: 'newest', label: 'Newest' },
        { value: 'price_asc', label: 'Price: Low to High' },
        { value: 'price_desc', label: 'Price: High to Low' },
    ];


    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        if (!activeCategory) {
            setBrands([]);
            return;
        }

        fetchApi(`${apiEndpoints.getCategoryBrands}?category_id=${activeCategory}&locale=${locale}`)
            .then((response) => {
                const rawBrands = (response.data as { brands?: Brand[] })?.brands ?? [];
                setBrands(Array.isArray(rawBrands) ? rawBrands : []);
            })
            .catch((error) => {
                console.error('Error fetching category brands:', error);
                setBrands([]);
            });
    }, [activeCategory, locale]);

    useEffect(() => {
        setSelectedBrand(activeBrands ? parseInt(activeBrands, 10) : null);
    }, [activeBrands]);

    const handleBrandChange = (selectedOption: SingleValue<{ value: number; label: string }>) => {
        const params = new URLSearchParams(searchParams.toString());
        if (selectedOption) {
            setSelectedBrand(selectedOption.value);
            params.set('brand', selectedOption.value.toString());
        } else {
            setSelectedBrand(null);
            params.delete('brand');
        }
        params.set('page', '1');
        router.push(`?${params.toString()}`);
    };
    return (
        <>
            <h2 className="text-2xl font-bold mb-4"> Products</h2>
            <Link className='bg-blue-500 text-white px-2 py-1 rounded mr-2 my-2' href="/admin/createproduct">Add New Product</Link>

            <div className='py-4'>

                <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    placeholder="Search products..."
                    className="border border-gray-300 dark:border-gray-600 p-2 w-full rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                />
            </div>

            <div>
                <div className="mb-3 flex flex-wrap items-center justify-end gap-x-8 gap-y-2">
                    <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        <input type="checkbox" checked={showInactive} onChange={(e) => handleInactiveChange(e.target.checked)} className="h-4 w-4 rounded border-gray-300" />
                        Show inactive categories
                    </label>
                    <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        <input type="checkbox" checked={importedOnly} onChange={(e) => handleImportedChange(e.target.checked)} className="h-4 w-4 rounded border-gray-300" />
                        Imported products only
                    </label>
                </div>
                <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
                    <div className="min-w-0">
                        <label htmlFor="category" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Category
                        </label>
                        <DarkSelect
                            name="category"
                            value={Array.isArray(categories) && categories
                                .filter((cat) => showInactive || Number(cat.status) === 1)
                                .map((cat) => ({
                                    value: cat.id,
                                    label: cat.name,
                                }))
                                .find((option) => option.value === selectedCategory) || null}
                            onChange={handleCategoryChange}
                            options={visibleCategories
                                .map((cat) => ({
                                    value: cat.id,
                                    label: cat.name,
                                }))}
                            className="block w-full"
                            placeholder="Select a category"
                            isSearchable
                            isClearable
                        />
                    </div>
                    <div className="min-w-0">
                        <label htmlFor="brand" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Brand
                        </label>
                        <DarkSelect
                            name="brand"
                            value={brands
                                .map((brand) => ({ value: Number(brand.id), label: brand.name || '' }))
                                .find((option) => option.value === selectedBrand) || null}
                            onChange={handleBrandChange}
                            options={brands.map((brand) => ({
                                value: Number(brand.id),
                                label: brand.name || '',
                            }))}
                            className="block w-full"
                            placeholder="Select a brand"
                            isSearchable
                            isClearable
                        />
                    </div>
                    <div className="min-w-0">
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Status
                        </label>
                        <DarkSelect
                            name="status"
                            value={statusOptions.find((option) => option.value === activeStatus) || statusOptions[0]}
                            onChange={handleStatusChange}
                            options={statusOptions}
                            className="block w-full"
                            placeholder="Filter by status"
                        />
                    </div>
                    <div className="min-w-0">
                        <label htmlFor="sortby" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Sort By
                        </label>
                        <DarkSelect
                            name="sortby"
                            value={sortByOptions.find((option) => option.value === activeSortBy) || sortByOptions[0]}
                            onChange={handleSortByChange}
                            options={sortByOptions}
                            className="block w-full"
                            placeholder="Sort by"
                        />
                    </div>
                </div>
            </div>

            {/* Add your review management functionalities here */}
            <ProductDetails
                products={products} countryCode='en'
            />
            <Pagination
                currentPage={page}
                totalPages={totalPage}
                additionalParams={debouncedSearchTerm?.trim() ? { search: debouncedSearchTerm.trim() } : {}}
            />
        </>
    );
};

export default ManageReviews;
