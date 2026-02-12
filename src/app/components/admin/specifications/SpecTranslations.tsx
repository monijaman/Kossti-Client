"use client";
import { useSpecifications } from "@/hooks/useSpecifications";
import { LOCALES } from '@/lib/constants';
import { ReviewTranslation, SpecificationInt, SpecificationKey, SpecKeyTranslation } from '@/lib/types';
import { ChangeEvent, FormEvent, useCallback, useEffect, useState } from 'react';
import Select from 'react-select';
import { translateSpecificationsToBengali } from '@/lib/openai-service';
type SubmitSpecResponse = {
    success: boolean;
    data?: {
        message: string;
        // other fields if any
    };
    error?: string;
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
    const { submitSpecTranslationValues, getSpecTranslations } = useSpecifications();
    // Removed unused translatedSpecifications state

    const [tranSpecifications, setTranSpecifications] = useState<SpecKeyTranslation[]>([]);
    const [translationLoading, setTranslationLoading] = useState(false);

    const tranlatedSpecification = async () => {
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
    }

    const fetchAndProcess = useCallback(async () => {
        const fetchedSpecifications = await tranlatedSpecification();

        console.log('Fetched Specifications:', fetchedSpecifications);
        if (specifications && specKeys) {
            const transSpec = specifications.map((item) => {
                const keyValue = fetchedSpecifications?.find((trans: transDataSet) => {
                    // Ensure that trans has the correct structure
                    return trans?.specification_key_id === +item.specification_key_id;
                });

                // Find the corresponding specKey to get the specification_key name
                const specKey = specKeys.find(key => key.id === +item.specification_key_id);

                return {
                    id: item.id ?? null,  // Ensure id is either a number or null
                    locale: selectedLocale,
                    specification_key_id: +item.specification_key_id,
                    // translated_key should be the translated name of the specification key itself
                    translated_key: keyValue?.translations?.translated_key || specKey?.specification_key || '',
                    // translated_value should be the translated value for this specification (empty if none)
                    translated_value: keyValue?.translations?.translated_value || '',
                    // Keep the original English value as a read-only source hint
                    source_value: item.value || '',
                };
            })

            setTranSpecifications(transSpec);
        }
    }, [specifications, specKeys, selectedLocale]);

    useEffect(() => {
        fetchAndProcess();
    }, [fetchAndProcess]);

    // Function to handle form submission
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!productId) {
            setFormStatus('Product ID is required');
            return;
        }

        // Validate that all translations have required fields
        const invalidTranslations = tranSpecifications.filter(spec =>
            !spec.specification_key_id ||
            !spec.locale ||
            (!spec.translated_key && !spec.translated_value)
        );

        if (invalidTranslations.length > 0) {
            console.error('Invalid translations found:', invalidTranslations);
            setFormStatus('Please fill in all required fields');
            return;
        }

        console.log('Submitting translations:', {
            productId,
            translations: tranSpecifications
        });

        try {
            const response = await submitSpecTranslationValues(productId, tranSpecifications) as SubmitSpecResponse;

            console.log('Translation response:', response);

            if (response.success) {
                setFormStatus(response.data?.message || 'Translations updated successfully');
            } else {
                setFormStatus(`Error: ${response.error || 'Failed to update translations'}`);
            }
        } catch (error) {
            console.error('Translation submission error:', error);
            setFormStatus('An unexpected error occurred while updating translations');
        }
    };

    // Function to handle input change
    const handleInputChange = (index: number, event: ChangeEvent<HTMLInputElement>) => {
        if (tranSpecifications) {
            const values = [...tranSpecifications];
            const { name, value } = event.target;
            // Type guard to ensure name is a valid key
            if (name === 'translated_key') {
                values[index]['translated_key'] = value;
            } else if (name === 'translated_value') {
                values[index]['translated_value'] = value;
            }
            setTranSpecifications(values);
        }
    };

    // Function to handle AI translation to Bangla
    const handleTranslateToBangla = async () => {
        if (!specifications || !specKeys) {
            setFormStatus('No specifications available to translate');
            return;
        }

        setTranslationLoading(true);
        setFormStatus('');

        try {
            // Prepare specifications for translation, keeping their original indices and key IDs
            const specsWithIndex = specifications
                .map((spec, idx) => {
                    const keyObj = specKeys.find(key => key.id === spec.specification_key_id);
                    return {
                        index: idx,
                        specification_key_id: spec.specification_key_id,
                        key: keyObj?.specification_key || 'Unknown',
                        value: spec.value || ''
                    };
                })
                .filter((s) => s.value && s.value.trim() !== ''); // Only translate specs with values

            console.log('specsWithIndex:', specsWithIndex);

            if (specsWithIndex.length === 0) {
                setFormStatus('No specification values to translate');
                return;
            }

            // Translate using AI (preserves order of specsWithIndex)
            const specsToTranslate = specsWithIndex.map(s => ({ key: s.key, value: s.value }));
            console.log('specsToTranslate:', specsToTranslate);
            
            const translatedSpecs = await translateSpecificationsToBengali(specsToTranslate);
            console.log('translatedSpecs:', translatedSpecs);

            // Map translated results back by matching specification_key_id
            const updatedTranSpecs = [...tranSpecifications];
            translatedSpecs.forEach((translated, i) => {
                const original = specsWithIndex[i];
                if (!original) {
                    console.error(`No original spec found for translated index ${i}`);
                    return;
                }
                
                // Find the corresponding item in tranSpecifications by specification_key_id
                const targetIdx = updatedTranSpecs.findIndex(spec => spec.specification_key_id === original.specification_key_id);
                
                console.log(`Mapping translated[${i}] (key: ${translated.key}, value: ${translated.translatedValue}) to specification_key_id ${original.specification_key_id}, found at index ${targetIdx}`);
                
                if (targetIdx !== -1) {
                    updatedTranSpecs[targetIdx] = {
                        ...updatedTranSpecs[targetIdx],
                        translated_key: translated.translatedKey || updatedTranSpecs[targetIdx].translated_key,
                        translated_value: translated.translatedValue || updatedTranSpecs[targetIdx].translated_value,
                    };
                    console.log(`Updated tranSpecifications[${targetIdx}]:`, updatedTranSpecs[targetIdx]);
                } else {
                    console.error(`No tranSpecification found with specification_key_id ${original.specification_key_id}`);
                }
            });

            setTranSpecifications(updatedTranSpecs);
            setFormStatus('Specifications translated to Bangla successfully');
        } catch (error) {
            console.error('Error translating to Bangla:', error);
            setFormStatus('Failed to translate specifications to Bangla');
        } finally {
            setTranslationLoading(false);
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
            <h2 className="font-bold mb-0 mt-0">Tranaslattion</h2>

            <div className="mb-0 mt-0 pt-0">
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
                <div key={index} className="grid grid-cols-1 gap-6 sm:grid-cols-3">
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
                            isDisabled={true} // Make the Select unchangeable
                        />
                    </div>

                    <div>
                       
                        <div>
                            <input
                                type="text"
                                name="translated_value"
                                value={spec.translated_value || ''}
                                onChange={(event) => handleInputChange(index, event)}
                                placeholder={spec.source_value || 'Enter translated value'}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                            {spec.source_value && !spec.translated_value && (
                                <div className="mt-1 text-xs text-gray-400">English: {spec.source_value}</div>
                            )}
                        </div>
                    </div>
                </div>
            ))}

            <div className="flex justify-between">
                {selectedLocale === 'bn' && (
                    <button
                        type="button"
                        onClick={handleTranslateToBangla}
                        disabled={translationLoading}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed mr-4"
                    >
                        {translationLoading ? 'Translating...' : '🌐 Translate to Bangla'}
                    </button>
                )}
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
