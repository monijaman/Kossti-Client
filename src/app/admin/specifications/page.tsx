"use client";
import { useSpecifications } from "@/hooks/useSpecifications";
import { apiEndpoints } from "@/lib/constants";
import fetchApi from "@/lib/fetchApi";
import { Category, SpecificationKey } from '@/lib/types';
import { FormEvent, useEffect, useState } from 'react';
import Select, { SingleValue } from 'react-select';
// import Specification from "../categories/[id]/Specification";
interface SpecResponse {
    message: string;
}
const Specification = () => {

    const { submitSpecifications } = useSpecifications();

    const [specifications, setSpecifications] = useState<SpecificationKey[]>([{ id: null, specification_key: '' }]);
    const [activeSpecifications, setActiveSpecifications] = useState<SpecificationKey[]>([]);
    const [formStatus, setFormStatus] = useState<string[]>();
    const [categories, setCategories] = useState<Category[]>([]);
    const productName = '';
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null); // To store the selected category

    // Function to handle category selection
    const handleCategoryChange = (selectedOption: SingleValue<{ value: number; label: string }>) => {
        if (selectedOption) {
            setSelectedCategory(selectedOption.value);
        }
    };

    const saveSpecs = async () => {

        const specArrays = activeSpecifications
            .map((spec) => spec.id) // Return the `id` directly
            .filter((id): id is number => id !== null) // Ensure non-null values
            .sort((a, b) => a - b); // Sort numerically

        const payload = {
            categoty_id: selectedCategory,
            specification_id: specArrays,
            status: 'active',
        };

        let method = 'POST'

        if (activeSpecifications.length > 1) {
            method = 'PUT'
        }

        const response = await fetchApi(apiEndpoints.formGenerator(selectedCategory ?? 0), {
            method: method,
            body: payload,
        });

        // Check if the response is successful
        if (!response.success) {
            throw new Error("Failed to submit specifications");
        }


        if (response.success && response.data) {
            const data = response.data as SpecResponse; // ✅ safely assert the expected shape
            setFormStatus([data.message]);
        }
    };


    // Function to handle specification key selection
    const handleSelectChange = (index: number, selectedOption: SingleValue<{ value: number | null; label: string }>) => {
        if (selectedOption) {
            const values = [...activeSpecifications];
            values[index].id = selectedOption.value; // Ensure it's a number
            values[index].specification_key = selectedOption.label; // Ensure it's a number

            setActiveSpecifications(values);
            saveSpecs();

        }
    };

    // Function to handle adding more specifications
    const addMoreSpecifications = () => {
        setActiveSpecifications([...activeSpecifications, { id: null, specification_key: '' }]);
    };

    // Function to handle form submission
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // Submit the form data including the selected category and specifications
        saveSpecs();
    };

    // Fetch the specification keys for select
    const fetchSpecificationKeys = async (searchTerm = "") => {
        try {
            const response = await fetchApi(apiEndpoints.getSpecKeys);
            const apiResponse = response as { success: boolean; data: { specification_keys: SpecificationKey[] } };

            console.log("Specification Keys Response:", apiResponse.data.specification_keys);
            if (apiResponse.success && apiResponse.data && apiResponse.data.specification_keys) {
                setSpecifications(Array.isArray(apiResponse.data.specification_keys) ? apiResponse.data.specification_keys : []);
            } else {
                console.error("Failed to fetch specification keys.");
                setSpecifications([]);
            }


        } catch (error) {
            console.error("Error fetching specifications:", error);
        }
    };

    // Fetch categories
    const fetchCategories = async () => {
        try {
            const response = await fetchApi(apiEndpoints.Categories);
            const apiResponse = response as { success: boolean; data: { categories: Category[], count: number, limit: number, offset: number } };


            if (!apiResponse.success) {
                console.error("Failed to fetch categories.");
                return;
            }

            // console.log("Fetched categories:", apiResponse.data.categories);
            setCategories(apiResponse.data.categories);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const fetchSelectedSpecs = async () => {
        try {

            if (selectedCategory) {
                try {
                    const response = await fetchApi(`${apiEndpoints.getCategorySpecs(selectedCategory)}`);
                    const apiResponse = response as { success: boolean; data: { data: SpecificationKey[] } };

                    console.log("Category Specs Response:", apiResponse.data.data);
                    if (apiResponse.success && apiResponse.data && apiResponse.data.data) {
                        setActiveSpecifications(Array.isArray(apiResponse.data.data) ? apiResponse.data.data : []);
                    } else {
                        setActiveSpecifications([]);
                    }

                } catch (error) {
                    console.error("Error fetching category:", error);
                    return { success: false, data: [] };
                }



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
            fetchSelectedSpecs();
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
                                value={Array.isArray(categories) && categories
                                    .map((cat) => ({
                                        value: cat.id,
                                        label: cat.name,
                                    }))
                                    .find((option) => option.value === selectedCategory) || null}
                                onChange={handleCategoryChange}
                                options={Array.isArray(categories) ? categories.map((cat) => ({
                                    value: cat.id,
                                    label: cat.name,
                                })) : []}
                                className="mt-1 block w-full"
                                placeholder="Select a category"
                                isSearchable
                                required
                            />
                        </div>

                        {activeSpecifications && Array.isArray(activeSpecifications) && activeSpecifications.map((spec, index) => (
                            <div key={index} className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div>
                                    <Select
                                        name="specification_key_id"
                                        value={activeSpecifications
                                            .map((key) => ({
                                                value: key.id ?? 0,
                                                label: key.specification_key,
                                            }))
                                            .find((option) => option.value === (spec.id ?? 0)) || null}
                                        onChange={(selectedOption) => handleSelectChange(index, selectedOption)}
                                        options={specifications.map((key) => ({
                                            value: key.id ?? 0,
                                            label: key.specification_key,
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
                                        onClick={() => setActiveSpecifications(activeSpecifications.filter((_, i) => i !== index))}
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
                                    Add New Specification
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
