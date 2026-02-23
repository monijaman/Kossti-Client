"use client";
import { useSpecifications } from "@/hooks/useSpecifications";
import { SpecificationInt, SpecificationKey } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { ChangeEvent, FormEvent, use, useCallback, useEffect, useState } from 'react';
import Select, { SingleValue } from 'react-select';

import SpecTranslations from '@/app/components/admin/specifications/SpecTranslations';
interface PageProps {
    params: Promise<{
        id: number;
    }>;
}

const Specification = ({ params }: PageProps) => {
    const { id } = use(params);
    const router = useRouter();
    const { getSpecifications, getSpecificationsKeys, submitSpecificationsKeys } = useSpecifications();

    const [specifications, setSpecifications] = useState<SpecificationInt[]>([]);

    const [specKeys, setSpecKeys] = useState<SpecificationKey[]>([]);
    const [productName, setProductName] = useState<string>('');


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
    const handleSelectChange = (index: number, selectedOption: SingleValue<{ value: number | null; label: string }>) => {
        const values = [...specifications];
        if (selectedOption) {
            values[index].specification_key_id = selectedOption.value !== undefined && selectedOption.value !== null ? selectedOption.value.toString() : "";
            setSpecifications(values);
        }
    };

    // Function to handle adding more specifications

    // Function to handle form submission
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // Prepare and filter specifications before sending in one bulk call
        const specsToSave = specifications
            .map(s => ({
                id: s.id ?? undefined,
                specification_key_id: typeof s.specification_key_id === 'string' ? parseInt(String(s.specification_key_id), 10) : s.specification_key_id,
                value: s.value != null ? String(s.value).trim() : ''
            }))
            .filter(s => s.specification_key_id && Number(s.specification_key_id) > 0);

        await submitSpecificationsKeys(id, specsToSave as any);

    };

    // Fetch the specification keys
    const fetchSpecificationKeys = useCallback(async () => {
        try {
            const dataset = await getSpecificationsKeys();
            setSpecKeys(dataset.data);

        } catch (error) {
            console.error("Error fetching specifications:", error);
        }
    }, [getSpecificationsKeys]);


    // fetch all specificatiosn for dropdown option
    const fetchSpecifications = useCallback(async () => {
        try {
            const response = await getSpecifications(id);

            if (response && response.dataset) {
                if (response.dataset.specifications && response.dataset.specifications.length > 0) {
                    setSpecifications(response.dataset.specifications);
                } else if (response.dataset.formspecs) {
                    setSpecifications(response.dataset.formspecs);
                }

                if (response.dataset.name) {
                    setProductName(response.dataset.name);
                }
            }

            // setProduct();
        } catch (error) {
            console.error("Error fetching specifications:", error);
        }
    }, [id, getSpecifications]);

    useEffect(() => {
        fetchSpecificationKeys();
        fetchSpecifications();
    }, [fetchSpecificationKeys, fetchSpecifications]);

    return (

        <div className="flex flex-row gap-4">
            <div className="w-1/2">

                <div className="bg-white shadow-md rounded-lg p-8">
                    <h1 className="text-2xl font-semibold mb-6">Add Specifications for {productName}</h1>
                    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                        {specifications.map((spec, index) => (
                            <div key={index} className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div>
                                    <Select
                                        name="specification_key_id" // Match with SpecificationInt key
                                        value={specKeys
                                            .map((key) => ({
                                                value: key.id,
                                                label: key.specification_key,
                                            }))
                                            .find((option) => option.value === parseInt(String(spec.specification_key_id))) || null}
                                        onChange={(selectedOption) => handleSelectChange(index, selectedOption)}
                                        options={specKeys.map((key) => ({
                                            value: key.id,
                                            label: key.specification_key,
                                        }))}
                                        className="mt-1 block w-full"
                                        placeholder="Search and select a specification key"
                                        isSearchable
                                        isClearable
                                    />
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        name="value" // Ensure this matches the SpecificationInt key
                                        value={spec.value}
                                        onChange={(event) => handleInputChange(index, event)}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    />
                                </div>
                            </div>
                        ))}

                        <div className="flex justify-between gap-4">
                            {/* <button
                                type="button"
                                onClick={addMoreSpecifications}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Add More
                            </button> */}
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
            <div className="w-1/2">
                <SpecTranslations productId={id} specKeys={specKeys && specKeys} specifications={specifications && specifications} />
            </div>
        </div>
    );
};

export default Specification;
