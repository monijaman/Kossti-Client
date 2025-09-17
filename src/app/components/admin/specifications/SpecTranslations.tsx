"use client";
import { useSpecifications } from "@/hooks/useSpecifications";
import { LOCALES } from '@/lib/constants';
import { ReviewTranslation, SpecificationInt, SpecificationKey, SpecKeyTranslation } from '@/lib/types';
import { ChangeEvent, FormEvent, useCallback, useEffect, useState } from 'react';
import 'react-quill/dist/quill.snow.css'; // Import styles
import Select from 'react-select';
type SubmitSpecResponse = {
    success: boolean;
    data: {
        message: string;
        // other fields if any
    };
};


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

const SpecTranslations = ({ productId, specKeys, specifications }: PageProps) => {
    const [formStatus, setFormStatus] = useState("");
    const [selectedLocale, setSelectedLocale] = useState('bn');
    const { submitSpecKeyTranslation, getSpecTranslations } = useSpecifications();
    // Removed unused translatedSpecifications state

    const [tranSpecifications, setTranSpecifications] = useState<SpecKeyTranslation[]>([]);

    const tranlatedSpecification = useCallback(async () => {
        if (productId) {
            try {
                const response = await getSpecTranslations(productId, selectedLocale);

                console.log('getSpecTranslations response:', response); // Debug log

                // Handle different response structures
                let dataset;
                if (response && response.dataset) {
                    dataset = response.dataset;
                } else if (response && Array.isArray(response)) {
                    dataset = response;
                } else if (response) {
                    dataset = response;
                } else {
                    console.warn('No data received from getSpecTranslations');
                    dataset = [];
                }

                // Set translated specifications - removed this since we don't need the state
                // setTranslatedSpecifications(dataset);
                console.log('Processed dataset:', dataset);

                // Return the dataset so we can use it immediately
                return dataset;
            } catch (error) {
                console.error('Error in tranlatedSpecification:', error);
                return [];
            }
        }
        return [];
    }, [productId, selectedLocale, getSpecTranslations]);

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
    }, [specifications, selectedLocale, tranlatedSpecification]);

    useEffect(() => {
        fetchAndProcess();
    }, [fetchAndProcess]);

    // Function to handle form submission
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();


        if (productId) {

            const response = await submitSpecKeyTranslation(productId, tranSpecifications) as SubmitSpecResponse;


            if (response.success) {

                setFormStatus(response.data.message)
            }
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
    // const handleSelectChange = (index: number, selectedOption: SingleValue<{ value: number | null; label: string }>) => {
    //     const values = [...tranSpecifications];
    //     if (selectedOption) {
    //         values[index].specification_id = selectedOption.value; // Set the selected key ID as string
    //         setTranSpecifications(values);
    //     }
    // };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
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

export default SpecTranslations;
