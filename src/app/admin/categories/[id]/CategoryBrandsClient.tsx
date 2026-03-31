
'use client';
import { useBrands } from "@/hooks/useBrands";
import { useCategory } from "@/hooks/useCategory";
import { Brand, Category } from '@/lib/types';
import { FormEvent, useCallback, useEffect, useState } from 'react';
import Select, { SingleValue } from 'react-select';

interface CategoryBrand {
    id: number | null;
    brand_id: number | null;
    category_id: number | null;
    name?: string;
}

interface Specification {
    id: number | null;
    specification_key: number | null;
}

interface PageProps {
    // categories can be provided from server-side page to avoid flicker
    categoriesFromServer?: Category[];
    // server-computed numeric id for the category
    numericCategoryId?: number | null;
}

export default function CategoryBrandsClient({ categoriesFromServer, numericCategoryId: propNumericCategoryId }: PageProps) {
    // prefer server-provided numeric id; fallback to null
    const numericCategoryId = typeof propNumericCategoryId !== 'undefined' ? propNumericCategoryId : null;
    // use console.debug so we can inspect values during hydration/client runtime
    console.debug('[CategoryBrands] numericCategoryId:', numericCategoryId, 'propNumericCategoryId:', propNumericCategoryId);
    const { getCategories, getCategoryRelBrands } = useCategory();
    const { getAllBrands, submitBrands, getWideBrands } = useBrands();

    const [brands, setBrands] = useState<Brand[]>([]);
    const [activeBrands, setActiveBrands] = useState<CategoryBrand[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<number | null>(numericCategoryId);
    const [formStatus, setFormStatus] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // helper: normalize different API shapes into an array
    const normalizeList = useCallback(<T,>(data: unknown): T[] => {
        if (!data) return [];
        if (Array.isArray(data)) return data as T[];
        if (typeof data === 'object') {
            const obj = data as Record<string, unknown>;
            if (Array.isArray(obj.categories)) return obj.categories as T[];
            if (Array.isArray(obj.brands)) return obj.brands as T[];
            if (Array.isArray(obj.data)) return obj.data as T[];
            // nested data.categories
            if (obj.data && typeof obj.data === 'object') {
                const nested = obj.data as Record<string, unknown>;
                if (Array.isArray(nested.categories)) return nested.categories as T[];
                if (Array.isArray(nested.brands)) return nested.brands as T[];
            }
        }
        return [];
    }, []);

    // Fetch categories (client-side fallback)
    const fetchCategories = useCallback(async () => {
        try {
            const categoriesResponse = await getCategories({
                perPage: undefined,
                search: '',
                paginate: false,
                locale: undefined,
                categoryId: '',
                status: null,
            });
            if (categoriesResponse && categoriesResponse.success) {
                const categoryData = normalizeList<Category>(categoriesResponse.data);
                setCategories(categoryData);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
            setCategories([]);
        }
    }, [normalizeList]);

    // Fetch brands
    const fetchBrands = useCallback(async () => {
        try {
            // Pull an unpaginated list first so all brands (e.g. BYD) are available for relations.
            const response = await getAllBrands({ paginate: false, per_page: '5000' });
            const dataset = response?.data;
            let arr = normalizeList<Brand>(dataset);

            // Fallback to wide-brands endpoint if primary endpoint returns an unexpected shape.
            if (!Array.isArray(arr) || arr.length === 0) {
                const wideResponse = await getWideBrands({
                    limit: 5000,
                    paginate: false,
                    locale: 'en',
                    brandId: '',
                    status: null,
                    page: null,
                });
                arr = normalizeList<Brand>(wideResponse?.data);
            }

            setBrands(arr);
        } catch (error) {
            console.error("Error fetching brands:", error);
            setBrands([]);
        }
    }, []);

    // Fetch active brands for selected category
    const fetchActiveBrands = useCallback(async () => {
        if (!selectedCategory) return;
        try {
            const response = await getCategoryRelBrands({ category_id: selectedCategory, cacheBust: true });
            const dataset = response?.data;

            // normalize possible shapes into an array of records
            let arr: Record<string, unknown>[] = [];
            if (!dataset) arr = [];
            else if (Array.isArray(dataset)) arr = dataset as Record<string, unknown>[];
            else if (typeof dataset === 'object') {
                const obj = dataset as Record<string, unknown>;
                if (Array.isArray(obj.relations)) arr = obj.relations as Record<string, unknown>[];
                else if (Array.isArray(obj.data)) arr = obj.data as Record<string, unknown>[];
                else if (Array.isArray(obj.brands)) arr = obj.brands as Record<string, unknown>[];
                else arr = [obj];
            }

            const normalized = arr.map((it) => ({
                id: (it.id ?? it.ID) as number | null ?? null,
                brand_id: (it.brand_id ?? it.brandId ?? it.BrandID ?? it.BrandId) as number | null ?? null,
                category_id: (it.category_id ?? it.categoryId ?? it.CategoryID ?? it.CategoryId) as number | null ?? selectedCategory,
                name: (it.name ?? it.brand_name ?? it.BrandName ?? it.title) as string ?? "",
            }));

            console.debug("fetched category relations (normalized):", normalized);
            // dedupe relations by brand_id (keep first occurrence) to avoid duplicate selects
            const seen = new Set<number | string>();
            const deduped = normalized.filter((it, idx) => {
                const key = it.brand_id ?? `__idx_${idx}`;
                if (seen.has(key)) return false;
                seen.add(key);
                return true;
            });
            if (deduped.length !== normalized.length) {
                console.debug('deduped category relations, before/after lengths:', normalized.length, deduped.length);
            }
            setActiveBrands(deduped);
        } catch (error) {
            console.error("Error fetching category brands:", error);
            setActiveBrands([]);
        }
    }, [selectedCategory]);

    useEffect(() => {
        // if server provided categories, use them and skip client fetch for categories
        if (!Array.isArray(categoriesFromServer) || categoriesFromServer.length === 0) {
            void fetchCategories();
        } else {
            setCategories(categoriesFromServer);
        }
        void fetchBrands();
    }, [fetchBrands, fetchCategories]);

    useEffect(() => {
        if (!Array.isArray(brands) || brands.length === 0) return;
        if (!Array.isArray(activeBrands) || activeBrands.length === 0) return;

        const needsFill = activeBrands.some((ab) => !ab.name || ab.name === "");
        if (!needsFill) return;

        const brandById = new Map<number, string>();
        brands.forEach((b) => {
            if (b.id != null) brandById.set(Number(b.id), b.name ?? "");
        });

        const filled = activeBrands.map((ab) => ({
            ...ab,
            name: ab.name && ab.name !== "" ? ab.name : brandById.get(Number(ab.brand_id ?? 0)) ?? "",
        }));

        console.debug("filling activeBrands from global brands, before/after:", activeBrands, filled);
        setActiveBrands(filled);
    }, [brands]);

    useEffect(() => {
        void fetchActiveBrands();
    }, [fetchActiveBrands]);

    const handleCategoryChange = (selectedOption: SingleValue<{ value: number; label: string }>) => {
        if (selectedOption && selectedOption.value != null) setSelectedCategory(Number(selectedOption.value));
    };

    const handleBrandChange = (index: number, selectedOption: SingleValue<{ value: number; label: string }>) => {
        if (selectedOption && selectedOption.value != null) {
            const updatedBrands = [...activeBrands];
            updatedBrands[index].brand_id = Number(selectedOption.value);
            updatedBrands[index].name = selectedOption.label;
            setActiveBrands(updatedBrands);
        }
    };

    const addMoreBrands = () => {
        const base = Array.isArray(activeBrands) ? activeBrands : [];
        const first = base.length > 0 ? base[0] : null;
        setActiveBrands([
            ...base,
            { id: null, brand_id: first?.brand_id ?? null, category_id: selectedCategory, name: first?.name ?? '' },
        ]);
    };

    const removeBrand = (index: number) => {
        if (Array.isArray(activeBrands)) {
            setActiveBrands(activeBrands.filter((_, i) => i !== index));
        }
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        setLoading(true);
        event.preventDefault();
        try {
            if (!selectedCategory) {
                setFormStatus('Please select a category first');
                return;
            }

            const uniqueBrandIds = Array.from(
                new Set(
                    (Array.isArray(activeBrands) ? activeBrands : [])
                        .map((cb) => Number(cb.brand_id))
                        .filter((id) => Number.isInteger(id) && id > 0),
                ),
            );

            if (uniqueBrandIds.length === 0) {
                setFormStatus('Please select at least one valid brand');
                return;
            }

            const brandsToSubmit = uniqueBrandIds.map((id) => ({ id, name: '' }));
            const response = await submitBrands(selectedCategory, brandsToSubmit) as {
                success?: boolean;
                error?: string;
                status?: number;
                data?: { message?: string } | null;
            };

            if (response?.success) {
                const message =
                    (response.data && typeof response.data === 'object' && 'message' in response.data
                        ? response.data.message
                        : null) || 'Brand relations saved successfully';
                setFormStatus(message);
                await fetchActiveBrands();
            } else {
                setFormStatus(response?.error || 'Failed to save category-brand relations');
            }
        } catch (error) {
            console.error('Error submitting category-brand relations:', error);
            setFormStatus(error instanceof Error ? error.message : 'Failed to save category-brand relations');
        } finally {
            setLoading(false);
        }
    };

    // compute category options and brand select options
    const categoryOptions = Array.isArray(categories)
        ? categories.map((cat) => ({ value: Number(cat.id), label: cat.name ?? "" }))
        : [];

    const selectOptions = (() => {
        const fromRelations: { value: number; label: string }[] = Array.isArray(activeBrands)
            ? activeBrands.map((ab) => ({ value: Number(ab.brand_id) || 0, label: ab.name ?? "" }))
            : [];
        const fromBrands: { value: number; label: string }[] = Array.isArray(brands)
            ? brands.map((b) => ({ value: Number(b.id) || 0, label: b.name ?? "" }))
            : [];

        const map = new Map<number, { value: number; label: string }>();
        fromRelations.forEach((o) => map.set(o.value, o));
        fromBrands.forEach((o) => { if (!map.has(o.value)) map.set(o.value, o); });
        return Array.from(map.values()) as { value: number; label: string }[];
    })();



    return (
        <div className="max-w-3xl mx-auto shadow-lg rounded-lg p-8 mt-8 bg-gray-100">
            <h1 className="text-2xl font-bold mb-6">Manage Related Brands for Category</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                        Select Category
                    </label>
                    <Select
                        name="category"
                        // ensure we pass the actual option object from the options list
                        value={
                            categoryOptions.length > 0
                                ? categoryOptions.find((option) => Number(option.value) === Number(selectedCategory)) ?? null
                                : null
                        }
                        onChange={handleCategoryChange}
                        options={categoryOptions}
                        className="block w-full"
                        placeholder="Select a category"
                        isSearchable
                        required
                    />
                </div>

                <label htmlFor="BrandItems" className="block text-sm font-medium text-gray-700 mb-2">
                    Manage Brands for Selected Category
                </label>
                {Array.isArray(activeBrands) && activeBrands.length > 0 ? (
                    activeBrands.map((item, index) => (
                        <div id="BrandItems" key={index} className="flex gap-4 items-center">
                            <Select
                                value={
                                    selectOptions.find((o) => o.value === Number(item.brand_id)) ?? null
                                }
                                onChange={(selectedOption) => handleBrandChange(index, selectedOption)}
                                options={selectOptions}
                                className="flex-1"
                                placeholder="Select a brand"
                                isSearchable
                                required
                            />
                            <button
                                type="button"
                                onClick={() => removeBrand(index)}
                                className="text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md"
                            >
                                Remove
                            </button>
                        </div>
                    ))
                ) : null}

                <div className="flex justify-between items-center">
                    <button
                        type="button"
                        onClick={addMoreBrands}
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                    >
                        Add More
                    </button>


                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? 'Submitting...' : 'Save  Brand'}
                    </button>

                </div>

                {formStatus && (
                    <div
                        className={`p-4 mt-4 text-sm rounded-lg ${formStatus.includes('successfully') ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'}`}
                    >
                        {formStatus}
                    </div>
                )}
            </form>


        </div>
    );
}
