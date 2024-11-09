"use client";
import { useBrands } from "@/hooks/useBrands";
import { useCategory } from "@/hooks/useCategory";
import { useSpecifications } from "@/hooks/useSpecifications";
import { Brand, Category, SpecificationKey } from '@/lib/types';
import { FormEvent, useEffect, useState } from 'react';
import Select, { SingleValue } from 'react-select';
interface Specification {
    id: number | null;
    specification_key: number | null;
}

interface PageProps {
    params: {
        id: number; // Type for the slug
    };
}

const Specification = ({ params }: PageProps) => {


    const { id: category_id } = params;

    const { getSpecificationsByCategory, getFormSpecifications, getSpecificationsKeys, submitSpecifications } = useSpecifications();
    const { getAllCategory, getCategoryRelBrands } = useCategory();
    const { getAllBrands, submitBrands } = useBrands();

    const [specifications, setSpecifications] = useState<Specification[]>([]);
    const [activeSpecifications, setActiveSpecigications] = useState<SpecificationKey[]>([]);
    const [brands, setBrands] = useState<Brand[]>([]);
    const [activeBrands, setActiveBrands] = useState<Brand[]>([]);
    const [formStatus, setFormStatus] = useState<string[]>();
    const [categories, setCategories] = useState<Category[]>([]);
    const [productName, setProductName] = useState<string>('');
    const [selectedCategory, setSelectedCategory] = useState<number | null>(category_id); // To store the selected category

    // Function to handle category selection
    const handleCategoryChange = (selectedOption: SingleValue<{ value: number; label: string }>) => {
        if (selectedOption) {
            setSelectedCategory(selectedOption.value);
        }
    };

    // Function to handle specification key selection
    const handleSelectChange = (index: number, selectedOption: SingleValue<{ value: number; label: string }>) => {
        if (selectedOption) {
            const values = [...activeBrands];
            values[index].id = selectedOption.value; // Ensure it's a number
            values[index].name = selectedOption.label; // Ensure it's a number
            setActiveBrands(values);

        }
    };

    // Function to handle adding more specifications
    const addMoreBrands = () => {
        setActiveBrands([...activeBrands, { id: null, name: '' }]);
    };

    // Function to handle form submission
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // Submit the form data including the selected category and specifications
        const response = await submitBrands(selectedCategory ?? 0, activeBrands);
        if (response.success) {
            setFormStatus(response.data.message)
        }
    };

    // Fetch the specification keys
    const fetchBrands = async (searchTerm = "") => {
        try {
            const dataset = await getAllBrands();
            //   const result = await getAllBrands({ per_page: perPage, search: searchTerm, paginate });
            setBrands(dataset.data.data);
        } catch (error) {
            console.error("Error fetching specifications:", error);
        }
    };

    // Fetch categories
    const fetchCategories = async () => {
        try {
            const dataset = await getAllCategory();
            setCategories(dataset.data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const fetchAvtiveBrands = async () => {
        try {
            if (selectedCategory) {

                const response = await getCategoryRelBrands({ category_id: selectedCategory });
                setActiveBrands(response.data.data);

            }
        } catch (error) {
            console.error("Error fetching specifications:", error);
        }
    };

    useEffect(() => {
        fetchCategories();
        fetchBrands()
    }, []);

    useEffect(() => {
        if (selectedCategory) {
            fetchAvtiveBrands();
        }
    }, [selectedCategory]);

    return (
        <div className="flex flex-row gap-4">
            <div className="w-full">
                <div className="bg-white shadow-md rounded-lg p-8">
                    <h1 className="text-2xl font-semibold mb-6">Add Related Brands for  Category</h1>
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Category Select Dropdown */}

                        {selectedCategory &&
                            <div>
                                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                                    Category {selectedCategory}
                                </label>
                                <Select
                                    name="category"
                                    value={categories
                                        .map((cat) => ({
                                            value: cat.id,
                                            label: cat.name,
                                        }))
                                        .find((option) => option.value === +selectedCategory) || null}
                                    onChange={handleCategoryChange}
                                    options={categories.map((cat) => ({
                                        value: cat.id,
                                        label: cat.name,
                                    }))}
                                    className="mt-1 block w-full"
                                    placeholder="Select a category"
                                    isSearchable
                                    required
                                />
                            </div>
                        }

                        {activeBrands.map((item, index) => (
                            <div key={index} className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div>
                                    <Select
                                        name="specification_key_id"
                                        value={brands
                                            .map((brand) => ({
                                                value: brand.id!, // Use non-null assertion if you're sure it's not null
                                                label: brand.name?.toString() || "", // Convert to string or handle null
                                            }))
                                            .find((option) => option.value === item.id) || null}
                                        onChange={(selectedOption) => handleSelectChange(index, selectedOption)}
                                        options={brands.map((brand) => ({
                                            value: brand.id ?? 0, // Ensure it's a number
                                            label: brand.name?.toString() || "", // Handle null labels
                                        }))}

                                        className="mt-1 block w-full"
                                        placeholder="Search and select a specification key"
                                        isSearchable
                                        required
                                    />
                                </div>
                                <div>
                                    <button
                                        type="button"
                                        onClick={() => setActiveBrands(activeBrands.filter((_, i) => i !== index))}
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}

                        {selectedCategory &&

                            <div className="flex justify-between">
                                <button
                                    type="button"
                                    onClick={addMoreBrands}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Add More
                                </button>
                                <button
                                    type="submit"
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                >
                                    Submit
                                </button>
                            </div>

                        }


                        {formStatus && (
                            <div
                                className={`p-4 mb-4 text-sm rounded-lg ${formStatus.includes('success')
                                    ? 'text-green-700 bg-green-100'
                                    : 'text-black-700 bg-green-100'
                                    }`}
                                role="alert">
                                {formStatus}
                            </div>
                        )}


                    </form>
                </div>
            </div>
        </div>
    );
};

export default Specification;
