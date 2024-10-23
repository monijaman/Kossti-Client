"use client";
import React, { useEffect, useState, FormEvent, ChangeEvent } from 'react';
import dynamic from 'next/dynamic';
import { SpecKeyTranslation, ReviewTranslation } from '@/lib/types';
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
    productId: number | null;
    productName?: string;
    translations?: ReviewTranslation[];
    specKeys?: SpecificationKey[];
    specifications?: SpecificationInt[];
}
 
const ReviewTransForm = ({ productId, specKeys, specifications }: PageProps) => {
    const [formStatus, setFormStatus] = useState("");
    const [selectedLocale, setSelectedLocale] = useState('bn');
    const { submitSpecKeyTranslation } = useSpecifications();
    // const [trspecifications, setTrspecifications] = useState<SpecificationKey[]>([]);

    const [tranSpecifications, setTranSpecifications] = useState<SpecKeyTranslation[]>([]);

    console.log('specifications', specifications)
    useEffect(() => {
        if (specifications) {
            const transSpec = specifications.map((item) => {
                return {
                    id: item.id ?? null,  // Ensure id is either a number or null, avoiding undefined
                    locale: selectedLocale,
                    specification_id: +item.specification_key_id,  // Ensure id is either a number or null
                    translated_key: +item.specification_key_id,
                    translated_value: item.value,
                };
            });

            setTranSpecifications(transSpec);
        }
    }, [specifications, selectedLocale]);

    // Function to handle form submission
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        console.log('===============', 4444444444)
        if (productId) {

            await submitSpecKeyTranslation(productId, tranSpecifications);
        }
    };

    // Function to handle input change
    const handleInputChange = (index: number, event: ChangeEvent<HTMLInputElement>) => {
        if (tranSpecifications) {
            const values = [...tranSpecifications];
            const { name, value } = event.target;
            // Type guard to ensure name is a key of SpecificationInt
            if (name === 'translated_key' || name === 'value') {
                values[index]['translated_value'] = value; // Ensure key is valid
            }
            setTranSpecifications(values);
        }
    };

    // Function to handle specification key selection from react-select
    const handleSelectChange = (index: number, selectedOption: SingleValue<{ value: number; label: string }>) => {
        const values = [...tranSpecifications];
        console.log('valuesvalues', values[index])
        if (selectedOption) {
            values[index].specification_id = selectedOption.value; // Set the selected key ID as string
            setTranSpecifications(values);
        }
    };

    return (
        <form onSubmit={handleSubmit}  className="space-y-6">
            <h2 className="font-bold mb-4">Tranaslattion</h2>

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


                 {tranSpecifications && tranSpecifications.map((spec, index) => (
                    <div key={index} className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div>
                            <Select
                                name="specification_id"
                                value={specKeys && specKeys
                                    .map((key) => ({
                                        value: key.id, // Keeping this as a number
                                        label: key.specification_key,
                                    }))
                                    .find((option) => option.value === spec.specification_id) || null}  // Comparing numbers
                                onChange={(selectedOption) => handleSelectChange(index, selectedOption)}  // Passing the full selectedOption object
                                options={specKeys && specKeys.map((key) => ({
                                    value: key.id,  // Keeping id as a number
                                    label: key.specification_key,
                                }))}
                                className="mt-1 block w-full"
                                placeholder="Search and select a specification key"
                                isSearchable
                                required
                            />

                        </div>
                        <div>
                            <input
                                type="text"
                                name="value" // Ensure this matches the SpecificationInt key
                                value={spec.translated_value}
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
