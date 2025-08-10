'use client';
import { useBrands } from "@/hooks/useBrands";
import { useCategory } from "@/hooks/useCategory";
import { Brand, Category } from '@/lib/types';
import { FormEvent, useEffect, useState } from 'react';
import Select, { SingleValue } from 'react-select';
import { apiEndpoints } from "@/lib/constants";
import fetchApi from "@/lib/fetchApi";
type SubmitBrandResponse = {
    message: string;
};

interface Specification {
    id: number | null;
    specification_key: number | null;
}

interface PageProps {
    params: {
        id: number;
    };
}

const Specification = ({ params }: PageProps) => {
    const { id: category_id } = params;

    const { getCategories, getCategoryRelBrands } = useCategory();
    const { getAllBrands } = useBrands();

    const [brands, setBrands] = useState<Brand[]>([]);
    const [activeBrands, setActiveBrands] = useState<Brand[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<number | null>(category_id);
    const [formStatus, setFormStatus] = useState<string | null>(null);

    // Fetch categories
    const fetchCategories = async () => {
        try {
            const categoriesResponse = await getCategories({
                perPage: 10,
                search: '',
                paginate: 'true',
                locale: 'en',
                categoryId: '',
            });
            if (categoriesResponse.success) {
                setCategories(categoriesResponse.data.data);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    // Fetch brands
    const fetchBrands = async () => {
        try {
            const response = await getAllBrands();
            setBrands(response.data.data);
        } catch (error) {
            console.error("Error fetching brands:", error);
        }
    };

    // Fetch active brands for selected category
    const fetchActiveBrands = async () => {
        if (selectedCategory) {
            try {
                const response = await getCategoryRelBrands({ category_id: selectedCategory });
                setActiveBrands(response.data.data);
            } catch (error) {
                console.error("Error fetching category brands:", error);
            }
        }
    };

    useEffect(() => {
        fetchCategories();
        fetchBrands();
    }, []);

    useEffect(() => {
        fetchActiveBrands();
    }, [selectedCategory]);

    // Handle category selection
    const handleCategoryChange = (selectedOption: SingleValue<{ value: number; label: string }>) => {
        if (selectedOption) setSelectedCategory(selectedOption.value);
    };

    // Handle brand selection
    const handleBrandChange = (index: number, selectedOption: SingleValue<{ value: number; label: string }>) => {
        if (selectedOption) {
            const updatedBrands = [...activeBrands];
            updatedBrands[index].id = selectedOption.value;
            updatedBrands[index].name = selectedOption.label;
            setActiveBrands(updatedBrands);
        }
    };

    // Add more brands
    const addMoreBrands = () => setActiveBrands([...activeBrands, { id: null, name: '' }]);

    // Remove brand
    const removeBrand = (index: number) => setActiveBrands(activeBrands.filter((_, i) => i !== index));

    // Handle form submission
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // const response = await submitBrands(selectedCategory ?? 0, activeBrands);
        //   const token = (await cookies()).get("accessToken")?.value || "";

        const brandArrays = brands
            .map((brand) => brand.id) // Return the `id` directly
            .filter((id): id is number => id !== null) // Ensure non-null values
            .sort((a, b) => a - b); // Sort numerically
        const response = await fetchApi<SubmitBrandResponse>(
            apiEndpoints.submitBrands(selectedCategory ?? 0),
            {
                method: 'POST',
                body: {
                    category_id: selectedCategory,
                    brands: brandArrays
                },
                headers: { 'Content-Type': 'application/json' },
            }
        );

        if (response.success) {
            setFormStatus(response.data ? response.data.message : " ");
        } else {
            setFormStatus("Failed to submit data");
        }
    };



    return (
        <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-8 mt-8  bg-gray-100  ">
            <h1 className="text-2xl font-bold mb-6">Manage Related Brands for Category</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Category Select Dropdown */}
                <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                        Select Category
                    </label>
                    <Select
                        name="category"
                        value={categories
                            .map((cat) => ({ value: cat.id, label: cat.name }))
                            .find((option) => option.value === selectedCategory) || null}
                        onChange={handleCategoryChange}
                        options={categories.map((cat) => ({ value: cat.id, label: cat.name }))}
                        className="block w-full"
                        placeholder="Select a category"
                        isSearchable
                        required
                    />
                </div>

                {/* Brands List */}
                {activeBrands.map((item, index) => (
                    <div key={index} className="flex gap-4 items-center">
                        <Select
                            value={brands
                                .map((brand) => ({ value: brand.id!, label: brand.name || "" }))
                                .find((option) => option.value === item.id) || null}
                            onChange={(selectedOption) => handleBrandChange(index, selectedOption)}
                            options={brands.map((brand) => ({
                                value: brand.id ?? 0,
                                label: brand.name?.toString() || "",
                            }))}
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
                ))}

                {/* Add Brand Button */}
                <div className="flex justify-between items-center">
                    <button
                        type="button"
                        onClick={addMoreBrands}
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                    >
                        Add More
                    </button>
                    <button
                        type="submit"
                        className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600"
                    >
                        Submit
                    </button>
                </div>

                {/* Form Status Message */}
                {formStatus && (
                    <div
                        className={`p-4 mt-4 text-sm rounded-lg ${formStatus.includes('success') ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'}`}
                    >
                        {formStatus}
                    </div>
                )}
            </form>
        </div>
    );
};

export default Specification;
