"use client";
import Input from "@/app/components/ui/input";
import useSpecificationsKeys from "@/hooks/useSpecificationsKeys";
import { LOCALES } from '@/lib/constants';
import { SpecificationKey, SpecKeyTranslation } from '@/lib/types';
import { useCallback, useEffect, useState } from 'react';

interface PageProps {
    speckeyData: SpecificationKey;
}

const KeyTransForm = ({ speckeyData }: PageProps) => {

    const { submitKeysTranslation, getKeysTranslationById } = useSpecificationsKeys();
    const [speckeyId, setSpeckeyId] = useState<number>();
    const [submitStatus, setSubmitStatus] = useState('');
    const [selectedTranslation, setSelectedTranslation] = useState('');
    const [loading, setLoading] = useState(false);
    const [translated_key, setTranslated_key] = useState('');


    // Handle language switch
    const handleLanguageSwitch = (locale: string) => {
        const selectedLang = LOCALES.find((lang) => lang === locale);
        if (selectedLang) {
            setSelectedTranslation(locale);
        }
    };

    const fetchKeyTranslation = useCallback(async () => {
        if (speckeyId && selectedTranslation) {
            const response = await getKeysTranslationById({
                key_id: speckeyId,
                locale: selectedTranslation,
            });

            console.log(response.data)

            if (response && response.success && response.data) {
                const translationData = response.data as SpecKeyTranslation;


                // If translation exists, populate the form
                if (translationData.TranslatedKey) {
                    setTranslated_key(translationData.TranslatedKey);
                } else {
                    // Reset to original key name if no translation exists
                    setTranslated_key(speckeyData?.specification_key || '');
                }
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [speckeyId, selectedTranslation, speckeyData?.specification_key]); // Remove getKeysTranslationById to prevent infinite loop



    // Select 'bn' translation by default on mount
    useEffect(() => {
        handleLanguageSwitch('bn');
    }, []);

    useEffect(() => {
        if (speckeyData && speckeyData.id) {
            setSpeckeyId(speckeyData.id);
        }
    }, [speckeyData]);

    useEffect(() => {
        if (selectedTranslation && speckeyId) {
            fetchKeyTranslation();
        }
    }, [selectedTranslation, speckeyId, fetchKeyTranslation]);


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!selectedTranslation) {
            setSubmitStatus('Please select a language first');
            return;
        }

        if (!speckeyId) {
            setSubmitStatus('No specification key selected');
            return;
        }

        if (!translated_key) {
            setSubmitStatus('Please enter a translated key name');
            return;
        }

        setLoading(true);

        try {
            setSubmitStatus('');

            const response = await submitKeysTranslation({
                locale: selectedTranslation,
                speckeyId: speckeyId,
                speckey: translated_key,
            });

            if (response.success) {
                setSubmitStatus("Translation saved successfully");
                // Refresh the translation data
                fetchKeyTranslation();
            } else {
                setSubmitStatus(response?.error ?? 'Failed to save translation');
            }
        } catch (error) {
            console.error('Error submitting translation:', error);
            setSubmitStatus('Error submitting the translation');
        } finally {
            setLoading(false);
        }
    };


    const setTransKey = (transKey: string) => {
        setTranslated_key(transKey);
        setState((prevState) => ({
            ...prevState,
            translations: prevState.translations ? {
                ...prevState.translations,
                translated_key: transKey
            } : null
        }));
    };

    return (
        <>

            <div className="mb-4">
                {LOCALES.map((translation) => (
                    <button
                        key={translation}
                        onClick={() => handleLanguageSwitch(translation)}
                        className={`px-4 py-2 mr-2 ${selectedTranslation === translation ? 'bg-blue-500 text-white' : 'bg-gray-200'
                            }`}
                    >
                        {translation.toUpperCase()}
                    </button>
                ))}
            </div>

            <form onSubmit={handleSubmit} className="    rounded px-8 pt-6 pb-8 mb-4 ">
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                        Key Name
                    </label>
                    <Input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="name"
                        type="text"
                        placeholder="Enter product name"
                        value={translated_key}
                        onChange={(e) => setTransKey(e.target.value)}
                    />
                </div>

                <div className="flex items-center justify-between">
                    <button
                        className={`font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${loading
                            ? 'bg-gray-400 cursor-not-allowed text-white'
                            : 'bg-blue-500 hover:bg-blue-700 text-white'
                            }`}
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? 'Saving...' : 'Save Translation'}
                    </button>
                </div>

                {submitStatus && (
                    <div
                        className={`p-4 mt-4 text-sm rounded-lg ${submitStatus.includes('successfully')
                            ? 'text-green-700 bg-green-100'
                            : 'text-red-700 bg-red-100'
                            }`}
                        role="alert"
                    >
                        {submitStatus}
                    </div>
                )}
            </form>
        </>
    );
};

export default KeyTransForm;
