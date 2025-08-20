"use client";
import { useBrands } from "@/hooks/useBrands";
import { apiEndpoints, LOCALES } from '@/lib/constants';
import fetchApi from "@/lib/fetchApi";
import { Brand, BrandTranslation } from '@/lib/types'; // Assuming you have a Product type
import { useEffect, useState } from 'react';
interface PageProps {
    brandData: Brand; // Optional for create case
}

const BrandTransForm = ({ brandData }: PageProps) => {

    const [brandName, setBrandName] = useState('');
    const { submitBrandTranslation } = useBrands();
    const [submitStatus, setSubmitStatus] = useState('');
    const [selectedTranslation, setSelectedTranslation] = useState('bn');
    const [brandTranslation, setBrandTranslation] = useState<BrandTranslation | null>(null);

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

                const queryParams = new URLSearchParams({
                    locale: selectedTranslation,
                    brandId: brandData.id.toString()
                });

                const response = await fetchApi<BrandTranslation>(`${apiEndpoints.brandTranslation(brandData.id)}?${queryParams.toString()}`);
                if (!response) {
                    console.error('Failed to fetch brand translations');
                    return;
                }

                const apiResponse = response.data as { data?: BrandTranslation; message?: string };

                console.log('Brand Translation Response:', response.data);

                if (response.success && apiResponse.data) {
                    // resp.data is the actual Brand object; set that into state
                    setBrandTranslation(apiResponse.data);
                    setBrandName(apiResponse.data.translated_name || ""); // Set the brand name from the translation
                } else {
                    setBrandTranslation(null);
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
            fetchBrands();

        }
    }, [selectedTranslation]);


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Ensure translated_key is defined
        if (!brandName) {
            console.error('Brand Name key is undefined');
            return; // Handle this error case appropriately
        }

        const payload = {
            locale: selectedTranslation,
            translated_name: brandName
        };

        try {
            console.log('Brand Translation:', brandTranslation);
            if (!brandTranslation?.id) {
                console.error('Product ID is undefined');
                return; // Handle this error case appropriately
            }
            let method = "POST";
            // If brandTranslation is null, we are creating a new translation
            if (brandTranslation.brand_id) {
                method = "PUT";
            }

            const fetchUrl = apiEndpoints.brandTranslation(brandTranslation.brand_id);

            setSubmitStatus('Submitting...');

            const response = await fetchApi(fetchUrl, {
                method: method,
                body: payload,
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.success && response.data) {
                // Type assertion for the response data structure
                const responseData = response.data as { message?: string };
                setSubmitStatus(responseData.message || 'Form Submitted successfully');
            } else {
                setSubmitStatus(response.error || 'Error submitting form');
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
                        value={brandName || ""}
                        onChange={(e) => setBrandName(e.target.value)}
                    />
                </div>

                <div className="flex items-center justify-between">
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="submit"
                    >
                        {brandTranslation?.id ? 'Update Product' : 'Create Product'}
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
