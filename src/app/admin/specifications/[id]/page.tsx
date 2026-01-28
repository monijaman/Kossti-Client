"use client";
import { useSpecifications } from "@/hooks/useSpecifications";
import { SpecificationInt, SpecificationKey } from '@/lib/types';
import { ChangeEvent, FormEvent, use, useCallback, useEffect, useState } from 'react';
import Select, { SingleValue } from 'react-select';
import { generateProductSpecifications } from "@/lib/openai-service";

import SpecTranslations from '@/app/components/admin/specifications/SpecTranslations';

interface ApiResultData {
    message?: string;
    count?: number;
    [key: string]: unknown;
}

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

const Specification = ({ params }: PageProps) => {
    const { id } = use(params);
    const { getSpecifications, getSpecificationsKeys, submitSpecificationsKeys } = useSpecifications();

    const [specifications, setSpecifications] = useState<SpecificationInt[]>([]);
    const [specKeys, setSpecKeys] = useState<SpecificationKey[]>([]);
    const [productName, setProductName] = useState<string>('');
    const [submitStatus, setSubmitStatus] = useState('');
    const [loading, setLoading] = useState(false);
    const [aiLoading, setAiLoading] = useState(false);

    // Debug log for submitStatus changes
    useEffect(() => {
        if (submitStatus) {
            console.log('Specifications Submit Status Changed:', submitStatus);
        }
    }, [submitStatus]);


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
            values[index].specification_key_id = selectedOption.value !== undefined && selectedOption.value !== null ? selectedOption.value : "";
            setSpecifications(values);
        }
    };

    // Function to handle adding more specifications

    // Function to generate AI specifications
    const handleAISpecifications = async () => {
        if (!productName || specKeys.length === 0) {
            setSubmitStatus('Product name or specification keys not available');
            return;
        }

        setAiLoading(true);
        setSubmitStatus('');

        try {
            // Get only the specification keys that are currently selected in the form
            const selectedSpecKeys = specifications
                .map(spec => {
                    const keyObj = specKeys.find(key => key.id === spec.specification_key_id);
                    return keyObj ? keyObj.specification_key : null;
                })
                .filter(key => key !== null) as string[];

            if (selectedSpecKeys.length === 0) {
                setSubmitStatus('No specification keys selected in the form');
                return;
            }

            const aiSpecs = await generateProductSpecifications(productName, selectedSpecKeys);

            // Update specifications with AI-generated values
            const updatedSpecs = specifications.map(spec => {
                const keyObj = specKeys.find(key => key.id === spec.specification_key_id);
                if (keyObj && aiSpecs[keyObj.specification_key]) {
                    return {
                        ...spec,
                        value: aiSpecs[keyObj.specification_key]
                    };
                }
                return spec;
            });

            setSpecifications(updatedSpecs);
            setSubmitStatus('AI specifications generated successfully');
        } catch (error) {
            console.error('Error generating AI specifications:', error);
            setSubmitStatus('Failed to generate AI specifications');
        } finally {
            setAiLoading(false);
        }
    };

    // Function to handle form submission
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        setSubmitStatus(''); // Clear previous status

        try {
            // Call the submit function with the mapped data
            const result = await submitSpecificationsKeys(+id, specifications);

            if (result.success) {
                console.log("Specifications saved successfully:", result.data);
                setSubmitStatus((result.data as ApiResultData)?.message || 'Specifications saved successfully');
                // Optionally refresh the specifications
                fetchSpecifications();
            } else {
                console.error("Failed to save specifications:", result.error);
                setSubmitStatus(`Failed to save specifications: ${result.error}`);
            }
        } catch (error) {
            console.error("Error submitting specifications:", error);
            setSubmitStatus("An error occurred while saving specifications");
        } finally {
            setLoading(false);
        }
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
            const response = await getSpecifications(+id);
 
            // Check if response exists and has the expected structure
            if (response && response.dataset) {
                if (response.dataset.specifications && response.dataset.specifications.length > 0) {
                    setSpecifications(response.dataset.specifications);
                } else if (response.dataset.formspecs) {
                    setSpecifications(response.dataset.formspecs);
                }

                if (response.dataset.name) {
                    setProductName(response.dataset.name);
                }
            } else {
                console.warn('Unexpected response structure:', response);
                setSpecifications([]);
            }
        } catch (error) {
            console.error("Error fetching specifications:", error);
            setSpecifications([]);
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
                    <h1 className="text-2xl h-[60px] font-semibold mb-6">Add Specifications for {productName}</h1>
                    <form onSubmit={handleSubmit} className="space-y-6">
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
                                            .find((option) => option.value === (typeof spec.specification_key_id === 'string' ? parseInt(spec.specification_key_id) : spec.specification_key_id)) || null}
                                        onChange={(selectedOption) => handleSelectChange(index, selectedOption)}
                                        options={specKeys.map((key) => ({
                                            value: key.id,
                                            label: key.specification_key,
                                        }))}
                                        className="mt-1 block w-full"
                                        placeholder="Search and select a specification key"
                                        isSearchable
                                        isDisabled={true}
                                        required
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

                        <div className="flex justify-between">
                            <button
                                type="button"
                                onClick={handleAISpecifications}
                                disabled={aiLoading || loading}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {aiLoading ? 'Generating...' : '🤖 AI Specifications'}
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Saving...' : 'Submit'}
                            </button>
                        </div>

                        {/* Success/Error Message Display */}
                        {submitStatus && (
                            <div
                                className={`p-4 mt-4 text-sm rounded-lg border ${submitStatus.toLowerCase().includes('success') || submitStatus.toLowerCase().includes('saved')
                                        ? 'text-green-700 bg-green-100 border-green-300'
                                        : 'text-red-700 bg-red-100 border-red-300'
                                    }`}
                                role="alert"
                            >
                                <strong>
                                    {submitStatus.toLowerCase().includes('success') || submitStatus.toLowerCase().includes('saved') ? '✅ Success: ' : '❌ Error: '}
                                </strong>
                                {submitStatus}
                            </div>
                        )}
                    </form>
                </div>
            </div>
            <div className="w-1/2">
                <SpecTranslations productId={+id} specKeys={specKeys && specKeys} specifications={ specifications} />
            </div>
        </div>
    );
};

export default Specification;
