
'use client';
import { useBrands } from "@/hooks/useBrands";
import { useCategory } from "@/hooks/useCategory";
import { Brand, Category } from '@/lib/types';
import { FormEvent, useEffect, useState } from 'react';
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
    params: {
        id: string;
    };
}

export default function CategoryBrandsClient({ params }: PageProps) {
    const { id: category_id } = params;
    const numericCategoryId = Number(category_id) || null;

    const { getCategories, getCategoryRelBrands } = useCategory();
    const { getAllBrands, submitBrands } = useBrands();

    const [brands, setBrands] = useState<Brand[]>([]);
    const [activeBrands, setActiveBrands] = useState<CategoryBrand[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<number | null>(numericCategoryId);
    const [formStatus, setFormStatus] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // Fetch categories
    const fetchCategories = async () => {
        try {
            const categoriesResponse = await getCategories({
                perPage: undefined,
                search: '',
                paginate: false,
                locale: undefined,
                categoryId: '',
            });
            if (categoriesResponse.success) {
                const categoryData = categoriesResponse.data?.data?.categories || categoriesResponse.data?.categories;
                setCategories(Array.isArray(categoryData) ? categoryData : []);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
            setCategories([]);
        }
    };

    // Fetch brands
    const fetchBrands = async () => {
        try {
            const response = await getAllBrands();
            const dataset = response?.data;
            let arr: any[] = [];
            if (Array.isArray(dataset)) arr = dataset;
            else if (Array.isArray(dataset?.brands)) arr = dataset.brands;
            else if (Array.isArray(dataset?.data)) arr = dataset.data;
            setBrands(Array.isArray(arr) ? arr : []);
        } catch (error) {
            console.error("Error fetching brands:", error);
            setBrands([]);
        }
    };

    // Fetch active brands for selected category
    const fetchActiveBrands = async () => {
        if (selectedCategory) {
            try {
                const response = await getCategoryRelBrands({ category_id: selectedCategory });
                const dataset = response?.data;
                let raw: any = null;
                if (dataset == null) raw = null;
                else if (Array.isArray(dataset)) raw = dataset;
                else if (dataset.data) raw = dataset.data;
                else raw = dataset;

                let arr: any = [];
                if (!raw) arr = [];
                else if (Array.isArray(raw)) arr = raw;
                else if (Array.isArray(raw.relations)) arr = raw.relations;
                else if (Array.isArray(raw.data)) arr = raw.data;
                else if (Array.isArray(raw.brands)) arr = raw.brands;
                else {
                    if (raw.id || raw.brand_id) arr = [raw];
                    else arr = [];
                }

                const normalized = (Array.isArray(arr) ? arr : []).map((it: any) => ({
                    id: it.id ?? it.ID ?? null,
                    brand_id: it.brand_id ?? it.brandId ?? it.BrandID ?? it.BrandId ?? null,
                    category_id: it.category_id ?? it.categoryId ?? it.CategoryID ?? it.CategoryId ?? selectedCategory,
                    name: it.name ?? it.brand_name ?? it.BrandName ?? it.title ?? "",
                }));

                console.debug("fetched category relations (normalized):", normalized);
                setActiveBrands(normalized);
            } catch (error) {
                console.error("Error fetching category brands:", error);
                setActiveBrands([]);
            }
        }
    };

    useEffect(() => {
        fetchCategories();
        fetchBrands();
    }, []);

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
    }, [brands, activeBrands]);

    useEffect(() => {
        fetchActiveBrands();
    }, [selectedCategory]);

    const handleCategoryChange = (selectedOption: SingleValue<{ value: number; label: string }>) => {
        if (selectedOption) setSelectedCategory(selectedOption.value);
    };

    const handleBrandChange = (index: number, selectedOption: SingleValue<{ value: number; label: string }>) => {
        if (selectedOption) {
            const updatedBrands = [...activeBrands];
            updatedBrands[index].brand_id = selectedOption.value;
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
        const brandsToSubmit = Array.isArray(activeBrands)
            ? activeBrands.map(cb => ({ id: cb.brand_id, name: cb.name || '' }))
            : [];
        const response = await submitBrands(selectedCategory ?? 0, brandsToSubmit);
        if (response && typeof response === 'object' && 'success' in response && response.success) {
            setFormStatus("Brand added successfully");
        } else {
            setFormStatus("Failed to submit data");
        }
        setLoading(false);
    };

    const selectOptions = (() => {
        const fromRelations = Array.isArray(activeBrands)
            ? activeBrands.map((ab) => ({ value: Number(ab.brand_id) || 0, label: ab.name ?? "" }))
            : [];
        const fromBrands = Array.isArray(brands)
            ? brands.map((b) => ({ value: Number(b.id) || 0, label: b.name ?? "" }))
            : [];

        const map = new Map<number | null, { value: number | null; label: string }>();
        fromRelations.forEach((o) => map.set(o.value, o));
        fromBrands.forEach((o) => { if (!map.has(o.value)) map.set(o.value, o); });
        return Array.from(map.values()) as { value: number | null; label: string }[];
    })();

    return (
        <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-8 mt-8  bg-gray-100  ">
            <h1 className="text-2xl font-bold mb-6">Manage Related Brands for Category</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                        Select Category
                    </label>
                    <Select
                        name="category"
                        value={Array.isArray(categories) && categories.length > 0
                            ? categories
                                .map((cat) => ({ value: cat.id, label: cat.name }))
                                .find((option) => option.value == selectedCategory) || null
                            : null}
                        onChange={handleCategoryChange}
                        options={Array.isArray(categories) ? categories.map((cat) => ({ value: cat.id, label: cat.name })) : []}
                        className="block w-full"
                        placeholder="Select a category"
                        isSearchable
                        required
                    />
                </div>

                {Array.isArray(activeBrands) && activeBrands.length > 0 ? (
                    activeBrands.map((item, index) => (
                        <div key={index} className="flex gap-4 items-center">
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
