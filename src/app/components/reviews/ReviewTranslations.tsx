"use client";
import { useSpecifications } from "@/hooks/useSpecifications";
import { LOCALES } from '@/lib/constants';
import { ReviewTranslation, SpecificationInt, SpecificationKey, SpecKeyTranslation } from '@/lib/types';
import { ChangeEvent, FormEvent, useCallback, useEffect, useState } from 'react';
import Select from 'react-select';
type SubmitSpecResponse = {
    success: boolean;
    data: {
        message: string;
        // other fields if any
    };
};

// Dynamically import React Quill to avoid SSR issues

interface transDataSet {
    specification_key_id: number;
    translations: {
        id: number;
        specification_id: number;
        locale: string;
        translated_key: string;
        translated_value: string | undefined;
    }
}

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
    const [submitLoading, setSubmitLoading] = useState(false);
    const [selectedLocale, setSelectedLocale] = useState('bn');
    const { submitSpecKeyTranslation, getSpecTranslations } = useSpecifications();
    const [translatedSpecifications, setTranslatedSpecifications] = useState<transDataSet[]>([]);

    const [tranSpecifications, setTranSpecifications] = useState<SpecKeyTranslation[]>([]);

    const tranlatedSpecification = useCallback(async () => {
        if (productId) {
            const dataset = await getSpecTranslations(productId, selectedLocale);

            // Set translated specifications
            setTranslatedSpecifications(dataset.dataset);
            console.log('dataset', translatedSpecifications)
            // Return the dataset so we can use it immediately
            return dataset.dataset;
        }
        return null;
    }, [productId, selectedLocale, getSpecTranslations, translatedSpecifications]);

    const fetchAndProcess = useCallback(async () => {
        const fetchedSpecifications = await tranlatedSpecification();

        if (specifications) {
            const transSpec = specifications.map((item) => {
                const keyValue = fetchedSpecifications?.find((trans: transDataSet) => {
                    // Ensure that trans has the correct structure

                    return trans?.specification_key_id === +item.specification_key_id;
                });

                return {
                    id: item.id ?? null,  // Ensure id is either a number or null
                    locale: selectedLocale,
                    specification_key_id: +item.specification_key_id,  // Ensure id is either a number or null
                    translated_key: keyValue?.translations?.translated_value ?? '', // Use the actual translated value
                    translated_value: keyValue?.translations?.translated_value ?? '', // Provide a default value
                };
            })

            setTranSpecifications(transSpec);
        }
    }, [tranlatedSpecification, specifications, selectedLocale]);

    useEffect(() => {
        fetchAndProcess();
    }, [fetchAndProcess]);

    // Function to handle form submission
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSubmitLoading(true);
        setFormStatus("");
        console.log('[ReviewTranslations] Submit started');

        try {
            if (productId) {
                const response = await submitSpecKeyTranslation(productId, tranSpecifications) as SubmitSpecResponse;

                if (response.success) {
                    setFormStatus(response.data.message)
                    console.log('[ReviewTranslations] Submit successful:', response.data.message);
                } else {
                    setFormStatus('Failed to submit translations');
                }
            }
        } catch (error) {
            console.error('[ReviewTranslations] Submit error:', error);
            setFormStatus('Error submitting translations');
        } finally {
            setSubmitLoading(false);
            console.log('[ReviewTranslations] Submit finished');
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



    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="font-bold mb-4">Tranaslation</h2>

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
                <div key={index} className="grid grid-cols-1 gap-6 sm:grid-cols-1">
                    <div>
                        <Select
                            name="specification_id"
                            value={specKeys && specKeys
                                .map((key) => ({
                                    value: key.id, // Keeping this as a number
                                    label: key.specification_key,
                                }))
                                .find((option) => option.value === spec.specification_key_id) || null}  // Comparing numbers
                            // onChange={(selectedOption) => handleSelectChange(index, selectedOption)}  // Passing the full selectedOption object
                            options={specKeys && specKeys.map((key) => ({
                                value: key.id,  // Keeping id as a number
                                label: key.specification_key,
                            }))}
                            className="mt-1 block w-full"
                            placeholder="Search and select a specification key"
                            isSearchable
                            required
                            isDisabled={false} // Make the Select unchangeable

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
                    disabled={submitLoading}
                    className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white transition-all duration-200 ease-in-out ${
                        submitLoading
                            ? 'bg-gray-400 cursor-wait opacity-75'
                            : 'bg-green-600 hover:bg-green-700'
                    } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                    {submitLoading ? (
                        <>
                            <span className="animate-spin inline-block mr-2">⏳</span>
                            Submitting...
                        </>
                    ) : (
                        'Submit'
                    )}
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

    // {
    //     formStatus && (
    //         <div
    //             className={`p-4 mb-4 text-sm rounded-lg ${formStatus.includes('success')
    //                 ? 'text-green-700 bg-green-100'
    //                 : 'text-black-700 bg-green-100'
    //                 }`}
    //             role="alert">
    //             {formStatus}
    //         </div>
    //     )
    // }
};

export default ReviewTransForm;
