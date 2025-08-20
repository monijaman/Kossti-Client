"use client";
import { apiEndpoints, LOCALES } from '@/lib/constants';
import fetchApi from "@/lib/fetchApi";
import { Category, CategoryTranslation } from '@/lib/types'; // Updated import
import { useEffect, useState } from 'react';
interface PageProps {
    categoryData: Category; // Optional for create case
}

const CategoryTransForm = ({ categoryData }: PageProps) => {

    const [categoryName, setCategoryName] = useState('');
    const [categotyId, setCategotyId] = useState<number>();
    const [submitStatus, setSubmitStatus] = useState('');
    const [selectedTranslation, setSelectedTranslation] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<CategoryTranslation | null>(null);
    // Handle language switch
    const handleLanguageSwitch = (locale: string) => {

        const selectedLang = LOCALES.find((lang) => lang === locale);
        if (selectedLang) {
            setSelectedTranslation(locale);
        }
    };

    const fetchCategoryTranslation = async () => {
        if (categotyId !== null) {


            const response = await fetchApi(
                apiEndpoints.getCategoryTranslation(categoryData.id),
                {
                    method: "GET",
                }
            );


            if (response && response.success && response.data) {


                // The fetchApi returns the full response in response.data
                const apiResponse = response.data as { data?: CategoryTranslation[]; translations?: CategoryTranslation[]; message?: string };

                let translationsArray: CategoryTranslation[] = [];

                // Check if it's the flattened format (data is directly an array)
                if (Array.isArray(apiResponse)) {
                    translationsArray = apiResponse;
                }
                // Check if it's the updated backend format (data contains translations array)
                else if (apiResponse.data && Array.isArray(apiResponse.data)) {
                    translationsArray = apiResponse.data;
                }
                // Check if it's the old format (translations property)
                else if (apiResponse.translations && Array.isArray(apiResponse.translations)) {
                    translationsArray = apiResponse.translations;
                }

                const dataset = translationsArray.find((item: CategoryTranslation) => item.locale === selectedTranslation);
                if (dataset?.translated_name) {
                    console.log(dataset)
                    setCategoryName(dataset.translated_name || '');
                    setSelectedCategory(dataset);
                }
            }
        }
    };

    // Select 'bn' translation by default on mount
    useEffect(() => {
        handleLanguageSwitch('bn');
    }, []);

    useEffect(() => {
        if (categoryData && categoryData.id) {
            setCategotyId(categoryData.id);
            fetchCategoryTranslation();
        }
    }, [categoryData, selectedTranslation]);


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Ensure translated_key is defined
        if (!categoryName) {
            console.error('Category Name key is undefined');
            return; // Handle this error case appropriately
        }


        try {
            if (!categotyId) {
                console.error('Product ID is undefined');
                return; // Handle this error case appropriately
            }


            const payload = {
                locale: selectedTranslation,
                category_id: categotyId,
                translated_name: categoryName // Use the correct key for translated_key
            };

            let fetchUrl = apiEndpoints.categoryTranslation;
            let method = "POST";
            // If selectedCategory is not null, we are updating an existing translation
            if (selectedCategory?.category_id) {
                method = "PUT";
                fetchUrl = apiEndpoints.categoryTranslationById(selectedCategory.id);
            }

            const response = await fetchApi<CategoryTranslation>(fetchUrl, {
                method: method,
                body: payload,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log('Submitting payload:', payload);

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

                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="name"
                        type="text"
                        placeholder="Enter product name"
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                    />
                </div>

                <div className="flex items-center justify-between">
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="submit"
                    >
                        {categotyId ? 'Update Product' : 'Create Product'}
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

export default CategoryTransForm;
