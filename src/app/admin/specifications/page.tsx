"use client";
import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import Select, { SingleValue } from 'react-select';
import { useSpecifications } from "@/hooks/useSpecifications";
import { useCategory } from "@/hooks/useCategory";
import { SpecificationInt, SpecificationKey, Category } from '@/lib/types';

interface Specification {
    id: number | null;
    specification_key: number | null;
}

const Specification = () => {
    const id = 1;
    const { getSpecificationsByCategory, getFormSpecifications, getSpecificationsKeys, submitSpecifications } = useSpecifications();
    const { getCategory } = useCategory();

    const [specifications, setSpecifications] = useState<Specification[]>([]);
    const [existingSpecs, setExistingSpecs] = useState<SpecificationKey[]>([]);
    const [specKeys, setSpecKeys] = useState<SpecificationKey[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [productName, setProductName] = useState<string>('');
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null); // To store the selected category

    // Function to handle category selection
    const handleCategoryChange = (selectedOption: SingleValue<{ value: number; label: string }>) => {
        if (selectedOption) {
            setSelectedCategory(selectedOption.value);
        }
    };

    // Function to handle specification key selection
    const handleSelectChange = (index: number, selectedOption: SingleValue<{ value: number; label: string }>) => {
        if (selectedOption) {
            const values = [...specifications];
            values[index].id = selectedOption.value; // Ensure it's a number
            setSpecifications(values);
        }
    };

    // Function to handle adding more specifications
    const addMoreSpecifications = () => {
        setSpecifications([...specifications, { id: null, specification_key: null }]);
    };

    // Function to handle form submission
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // Submit the form data including the selected category and specifications
        // await submitSpecifications(id, specifications, selectedCategory);
    };

    // Fetch the specification keys
    const fetchSpecificationKeys = async (searchTerm = "") => {
        try {
            const dataset = await getSpecificationsKeys(searchTerm);
            setSpecifications(dataset.data);
        } catch (error) {
            console.error("Error fetching specifications:", error);
        }
    };

    // Fetch categories
    const fetchCategories = async () => {
        try {
            const dataset = await getCategory();
            setCategories(dataset.data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const fetchSpecifications = async () => {
        try {
            if (selectedCategory) {
                const response = await getSpecificationsByCategory(selectedCategory);
                setExistingSpecs(response.data);

            }
        } catch (error) {
            console.error("Error fetching specifications:", error);
        }
    };

    useEffect(() => {
        fetchCategories();
        fetchSpecificationKeys()
    }, []);

    useEffect(() => {
        if (selectedCategory) {
            fetchSpecifications();

        }


    }, [selectedCategory]);

    return (
        <div className="flex flex-row gap-4">
            <div className="w-full">
                <div className="bg-white shadow-md rounded-lg p-8">
                    <h1 className="text-2xl font-semibold mb-6">Add Specifications for {productName}</h1>
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Category Select Dropdown */}
                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                                Category
                            </label>
                            <Select
                                name="category"
                                value={categories
                                    .map((cat) => ({
                                        value: cat.id,
                                        label: cat.name,
                                    }))
                                    .find((option) => option.value === selectedCategory) || null}
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

                        {existingSpecs.map((spec, index) => (
                            <div key={index} className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div>
                                    <Select
                                        name="specification_key_id"
                                        value={specifications
                                            .map((key) => ({
                                                value: key.id!, // Use non-null assertion if you're sure it's not null
                                                label: key.specification_key?.toString() || "", // Convert to string or handle null
                                            }))
                                            .find((option) => option.value === spec.id) || null}
                                            onChange={(selectedOption) => handleSelectChange(index, selectedOption)}
                                            options={specifications.map((key) => ({
                                                value: key.id ?? 0, // Ensure it's a number
                                                label: key.specification_key?.toString() || "", // Handle null labels
                                            }))}
                                        onInputChange={(inputValue) => {
                                            if (inputValue) {
                                                fetchSpecificationKeys(inputValue);
                                            }
                                        }}
                                        className="mt-1 block w-full"
                                        placeholder="Search and select a specification key"
                                        isSearchable
                                        required
                                    />
                                </div>
                                <div>
                                    <button
                                        type="button"
                                        onClick={() => setSpecifications(specifications.filter((_, i) => i !== index))}
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}

                        <div className="flex justify-between">
                            <button
                                type="button"
                                onClick={addMoreSpecifications}
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
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Specification;
