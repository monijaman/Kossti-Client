"use client";
import { useSpecifications } from "@/hooks/useSpecifications";
import { LOCALES } from '@/lib/constants';
import { ReviewTranslation, SpecificationInt, SpecificationKey, SpecKeyTranslation } from '@/lib/types';
import { ChangeEvent, FormEvent, useCallback, useEffect, useState } from 'react';
import Select from 'react-select';
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
    const [subbmitStatus, setSubbmitStatus] = useState("Submit");
    const [selectedLocale, setSelectedLocale] = useState('bn');
    const { submitSpecTranslationValues, getSpecTranslations } = useSpecifications();
    // Removed unused translatedSpecifications state

    const [tranSpecifications, setTranSpecifications] = useState<SpecKeyTranslation[]>([]);
    const [translationLoading, setTranslationLoading] = useState(false);

    const tranlatedSpecification = async () => {
        if (productId) {
            try {
                const response = await getSpecTranslations(productId, selectedLocale);



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


        if (specifications && specKeys) {

            const transSpec = specifications.map((item) => {
                const keyValue = fetchedSpecifications?.find((trans: transDataSet) => {
                    // Ensure that trans has the correct structure
                    return trans?.specification_key_id === +item.specification_key_id;
                });

                // Find the corresponding specKey to get the specification_key name
                const specKey = specKeys.find(key => key.id === +item.specification_key_id);

                const spec = {
                    id: item.id ?? null,  // Ensure id is either a number or null
                    locale: selectedLocale,
                    specification_key_id: +item.specification_key_id,
                    // translated_key should be the translated name of the specification key itself
                    translated_key: keyValue?.translations?.translated_key || '',
                    // translated_value should be the translated value for this specification (empty if none)
                    translated_value: keyValue?.translations?.translated_value || '',
                    // Keep the original English value as a read-only source hint
                    source_value: item.value || '',
                };



                return spec;
            })


            setTranSpecifications(transSpec);
        }
    }, [specifications, specKeys, selectedLocale]);

    useEffect(() => {
        if (specifications && specifications?.length > 0) {
            fetchAndProcess();

        }
    }, [specifications]);

    // Function to handle form submission
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSubbmitStatus("Submitting...")
        if (!productId) {
            setFormStatus('Product ID is required');
            return;
        }

        // Filter to only specs with non-empty translated_value
        // (the hook will also filter these, but check here for early feedback)
        const specsWithTranslations = tranSpecifications.filter(spec =>
            spec.specification_key_id &&
            spec.locale &&
            spec.translated_value &&
            spec.translated_value.trim() !== ''
        );

        if (specsWithTranslations.length === 0) {
            setFormStatus('Please enter at least one translation before submitting');
            return;
        }

        console.log('Submitting translations:', {
            productId,
            translations: tranSpecifications
        });

        try {
            setSubbmitStatus("Submitted")
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
        setFormStatus('⏳ Connecting to AI service to translate specifications...');

        try {
            // Prepare specifications for translation, keeping their original indices and key IDs
            const specsWithIndex = specifications
                .map((spec, idx) => {
                    const keyObj = specKeys.find(key => key.id === spec.specification_key_id);
                    return {
                        index: idx,
                        specification_key_id: spec.specification_key_id,
                        specification_id: spec.id,
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

            setFormStatus(`⏳ Translating ${specsWithIndex.length} specifications...`);

            // Call server-side API route for translation (avoids browser CORS & keeps API key safe)
            const specsToTranslate = specsWithIndex.map(s => ({ key: s.key, value: s.value }));
            console.log('specsToTranslate:', specsToTranslate);

            const response = await fetch('/api/translate/specs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ specifications: specsToTranslate }),
            });

            const data = await response.json();
            console.log('Translation API response:', data);

            if (!response.ok || !data.success) {
                const errorMsg = data.error || `Translation failed (HTTP ${response.status})`;
                console.error('Translation API error:', errorMsg);
                setFormStatus(`❌ ${errorMsg}`);
                return;
            }

            const translatedSpecs = data.translations;
            console.log('translatedSpecs:', translatedSpecs);
            console.log(`Received ${translatedSpecs.length} translations`);

            // Map translated results back by matching specification ID directly
            const updatedTranSpecs = [...tranSpecifications];
            let successCount = 0;

            translatedSpecs.forEach((translated: { key: string; value: string; translatedKey?: string; translatedValue?: string }, i: number) => {
                const original = specsWithIndex[i];
                if (!original) {
                    console.error(`No original spec found for translated index ${i}`);
                    return;
                }

                // Find the corresponding item in tranSpecifications - use a more direct matching approach
                // First try to match by specification ID
                let targetIdx = -1;
                if (original.specification_id) {
                    targetIdx = updatedTranSpecs.findIndex(spec => spec.id === original.specification_id);
                }

                // If no match by ID, try matching by specification_key_id
                if (targetIdx === -1) {
                    targetIdx = updatedTranSpecs.findIndex(spec => spec.specification_key_id === original.specification_key_id);
                }

                console.log(`Mapping translated[${i}] (spec_id: ${original.specification_id}, key: "${translated.key}", value: "${translated.translatedValue}") to specification_key_id ${original.specification_key_id}, found at index ${targetIdx}`);

                if (targetIdx !== -1) {
                    updatedTranSpecs[targetIdx] = {
                        ...updatedTranSpecs[targetIdx],
                        translated_key: translated.translatedKey ?? updatedTranSpecs[targetIdx].translated_key ?? '',
                        translated_value: translated.translatedValue ?? updatedTranSpecs[targetIdx].translated_value ?? '',
                    };
                    console.log(`Updated tranSpecifications[${targetIdx}]:`, updatedTranSpecs[targetIdx]);
                    successCount++;
                } else {
                    console.error(`No tranSpecification found with specification_id ${original.specification_id} or specification_key_id ${original.specification_key_id}`);
                    console.warn(`Available specs in tranSpecifications:`, updatedTranSpecs.map((s, idx) => ({ idx, id: s.id, specification_key_id: s.specification_key_id })));
                }
            });

            setTranSpecifications(updatedTranSpecs);
            setFormStatus(`✅ Successfully translated ${successCount}/${translatedSpecs.length} specifications to Bangla`);
        } catch (error) {
            console.error('Error translating to Bangla:', error);
            setFormStatus(`❌ Failed to translate: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
                        <input
                            type="text"
                            name="translated_value"
                            value={spec.translated_value || ''}
                            onChange={(event) => handleInputChange(index, event)}
                            placeholder="বাংলা অনুবাদ লিখুন..."
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
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
                    {subbmitStatus}
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