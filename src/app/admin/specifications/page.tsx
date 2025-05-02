"use client";
import { useCategory } from "@/hooks/useCategory";
import { useSpecifications } from "@/hooks/useSpecifications";
import { Category, SpecificationKey } from '@/lib/types';
import { FormEvent, useEffect, useState } from 'react';
import Select, { SingleValue } from 'react-select';

interface Specification {
    id: number | null;
    specification_key: number | null;
}

const Specification = () => {

    const { getSpecificationsByCategory, getFormSpecifications, getSpecificationsKeys, submitSpecifications } = useSpecifications();
    const { getCategory } = useCategory();

    const [specifications, setSpecifications] = useState<Specification[]>([]);
    const [activeSpecifications, setActiveSpecigications] = useState<SpecificationKey[]>([]);
    const [formStatus, setFormStatus] = useState<string[]>();
    const [categories, setCategories] = useState<Category[]>([]);
    const [productName, setProductName] = useState<string>('');
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null); // To store the selected category

    // Function to handle category selection
    const handleCategoryChange = (selectedOption: SingleValue<{ value: number; label: string }>) => {
        if (selectedOption) {
            setSelectedCategory(selectedOption.value);
        }
    };

    const saveSpecs = async () => {
        const response = await submitSpecifications(selectedCategory ?? 0, activeSpecifications);
        if (response.success) {

            setFormStatus(response.data.message)
        }
    }

    // Function to handle specification key selection
    const handleSelectChange = (index: number, selectedOption: SingleValue<{ value: number; label: string }>) => {
        if (selectedOption) {
            const values = [...activeSpecifications];
            values[index].id = selectedOption.value; // Ensure it's a number
            values[index].specification_key = selectedOption.label; // Ensure it's a number
            setActiveSpecigications(values);
            saveSpecs();

        }
    };

    // Function to handle adding more specifications
    const addMoreSpecifications = () => {
        setActiveSpecigications([...activeSpecifications, { id: null, specification_key: '' }]);
    };

    // Function to handle form submission
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // Submit the form data including the selected category and specifications
        saveSpecs();
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
                setActiveSpecigications(response.data);

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
        <div className="flex flex-row gap-4 bg-gray-300  ">
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

                        {activeSpecifications.map((spec, index) => (
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

                                        className="mt-1 block w-full"
                                        placeholder="Search and select a specification key"
                                        isSearchable
                                        required
                                    />
                                </div>
                                <div>
                                    <button
                                        type="button"
                                        onClick={() => setActiveSpecigications(activeSpecifications.filter((_, i) => i !== index))}
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
