"use client";
import { useBrands } from "@/hooks/useBrands";
import { LOCALES } from '@/lib/constants';
import { Brand } from '@/lib/types'; // Assuming you have a Product type
import { useEffect, useState } from 'react';

interface PageProps {
    brandData: Brand; // Optional for create case
}

const BrandTransForm = ({ brandData }: PageProps) => {

    const [brandName, setBrandName] = useState('');
    const {  getWideBrands, submitBrandTranslation } = useBrands();
    const [brandId, setBrandId] = useState<number>();
    const [submitStatus, setSubmitStatus] = useState('');
    const [selectedTranslation, setSelectedTranslation] = useState('bn');

    // Handle language switch
    const handleLanguageSwitch = (locale: string) => {

        const selectedLang = LOCALES.find((lang) => lang === locale);
        if (selectedLang) {
            setSelectedTranslation(locale);
        }
    };


    const fetchBrands = async () => {
        try {
            if (selectedTranslation && brandData.id) {

                const brandResponse = await getWideBrands({
                    perPage: undefined,        // Number of items per page (optional)
                    search: '',        // Search term (optional)
                    paginate: 'false', // 'true' or 'false' to enable/disable pagination
                    locale: selectedTranslation, // Locale, e.g., 'en', 'bn', etc.
                    brandId: brandData.id ?? undefined, // Ensure brandId is either a number or undefined
                    status: null,         // Status filter (optional)
                    page: null         // current page (optional)
                });

                if (brandResponse.success) {
                    setBrandName(brandResponse.data.data.name);
                } else {
                    console.error('Failed to fetch categories');
                }
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };




    // Select 'bn' translation by default on mount
    useEffect(() => {
        handleLanguageSwitch('bn');

    }, []);

    useEffect(() => {
        if (selectedTranslation && brandData && brandData.id) {
            setBrandId(brandData.id);
            fetchBrands();

        }
    }, [brandData, selectedTranslation]);


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Ensure translated_key is defined
        if (!brandName) {
            console.error('Brand Name key is undefined');
            return; // Handle this error case appropriately
        }

        const payload = {
            locale: selectedTranslation,
            brandId: brandId, // Use speckeyId instead of specification_key_id
            brand: brandName // Use the correct key for translated_key
        };

        try {
            if (!brandId) {
                console.error('Product ID is undefined');
                return; // Handle this error case appropriately
            }

            // Submit the translation
            const response = await submitBrandTranslation(payload);

            if (response.success) {
                setSubmitStatus('Form Submitted successfully');
            } else {
                console.error('Error submitting form', response);
            }
        } catch (error) {
            console.error('Error submitting form', error);
        }
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
                        {brandName}
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="name"
                        type="text"
                        placeholder="Enter product name"
                        value={brandName}
                        onChange={(e) => setBrandName(e.target.value)}
                    />
                </div>

                <div className="flex items-center justify-between">
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="submit"
                    >
                        {brandId ? 'Update Product' : 'Create Product'}
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

export default BrandTransForm;
