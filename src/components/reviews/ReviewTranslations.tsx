"use client";
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useReviews } from '@/hooks/useReviews';
import AdditionalDetailsForm from '@/components/reviews/AdditionalDetails';
import { SpecTranslation, ProductTranslation, AdditionalDetails, ProductApiResponse, Product, ReviewTranslation } from '@/lib/types';
import { LOCALES } from '@/lib/constants';
import { SpecificationInt, SpecificationKey } from '@/lib/types';
import { useSpecifications } from "@/hooks/useSpecifications";
import Select, { SingleValue } from 'react-select';

// Dynamically import React Quill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css'; // Import styles
import { combineSlices } from '@reduxjs/toolkit';

// Page props
interface PageProps {
    id: number | null;
    productName: string;
    translations?: ReviewTranslation[];
    specKeys?: SpecificationKey[];
    specifications?: SpecificationInt[];
}

const ReviewTransForm = ({ id, productName, specKeys, specifications }: PageProps) => {
    const [selectedTranslation, setSelectedTranslation] = useState<ReviewTranslation | null>(null);
    const { addReviewTranslation } = useReviews();
    const [formStatus, setFormStatus] = useState("");
    const [additionalDetails, setAdditionalDetails] = useState<AdditionalDetails[]>([]);
    const [selectedLocale, setSelectedLocale] = useState('bn');
    const [transData, setTransData] = useState<ReviewTranslation[]>([]);
    const { getSpecifications, getSpecificationsKeys, submitSpecifications } = useSpecifications();
 

    // Function to handle form submission
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        await submitSpecifications(id, specifications);
    };

    // Function to handle input change
    const handleInputChange = (index: number, event: ChangeEvent<HTMLInputElement>) => {
        const values = [...specifications];
        const { name, value } = event.target;

        // Type guard to ensure name is a key of SpecificationInt
        if (name === 'specification_key_id' || name === 'value') {
            values[index][name] = value; // Ensure key is valid
        }

        setSpecifications(values);
    };

    // Function to handle specification key selection from react-select
    const handleSelectChange = (index: number, selectedOption: SingleValue<{ value: number; label: string }>) => {
        const values = [...specifications];
        if (selectedOption) {
            values[index].specification_key_id = selectedOption.value.toString(); // Set the selected key ID as string
            setSpecifications(values);
        }
    };



    return (
        <form onSubmit={handleSubmit}>
            <h2 className="font-bold mb-4">Submit a Review for {productName}</h2>

            <div className="mb-4">
                {LOCALES.map((translation) => (
                    <button
                        type='button'
                        key={translation}
                        onClick={() => setSelectedLocale(translation)}
                        className={`px-4 py-2 mr-2 ${selectedLocale === translation ? 'bg-blue-500 text-white' : 'bg-gray-200'
                            }`}
                    >
                        {translation.toUpperCase()}
                    </button>
                ))}
            </div>


            <form onSubmit={handleSubmit} className="space-y-6">
                {specifications.map((spec, index) => (
                    <div key={index} className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Specification Key</label>
                            <Select
                                name="specification_key_id" // Match with SpecificationInt key
                                value={specKeys
                                    .map((key) => ({
                                        value: key.id,
                                        label: key.specification_key,
                                    }))
                                    .find((option) => option.value === parseInt(spec.specification_key_id)) || null}
                                onChange={(selectedOption) => handleSelectChange(index, selectedOption)}
                                options={specKeys.map((key) => ({
                                    value: key.id,
                                    label: key.specification_key,
                                }))}
                                onInputChange={(inputValue) => {
                                    if (inputValue) {
                                        fetchSpecificationKeys(inputValue); // Call API to fetch dynamic data
                                    }
                                }}
                                className="mt-1 block w-full"
                                placeholder="Search and select a specification key"
                                isSearchable
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Value</label>
                            <input
                                type="text"
                                name="value" // Ensure this matches the SpecificationInt key
                                value={spec.value}
                                onChange={(event) => handleInputChange(index, event)}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required
                            />
                        </div>
                    </div>
                ))}

                <div className="flex justify-between">

                    <button
                        type="submit"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                        Submit
                    </button>
                </div>
            </form>


            {formStatus && (
                <div
                    className={`p-4 mb-4 text-sm rounded-lg ext-green-700 bg-green-100`}
                    role="alert"
                >
                    {formStatus}
                </div>
            )}


        </form>



    );
};

export default ReviewTransForm;
