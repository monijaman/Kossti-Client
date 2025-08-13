"use client";
import { useCategory } from "@/hooks/useCategory";
import { LOCALES } from '@/lib/constants';
import { Category } from '@/lib/types'; // Assuming you have a Product type
import { useEffect, useState } from 'react';

interface PageProps {
    categoryData: Category; // Optional for create case
}

const CategoryTransForm = ({ categoryData }: PageProps) => {

    const [categoryName, setCategoryName] = useState('');
    const { submitKeysTranslation, getCategoryTranslationById } = useCategory();
    const [categotyId, setCategotyId] = useState<number>();
    const [submitStatus, setSubmitStatus] = useState('');
    const [selectedTranslation, setSelectedTranslation] = useState('');

    // Handle language switch
    const handleLanguageSwitch = (locale: string) => {

        const selectedLang = LOCALES.find((lang) => lang === locale);
        if (selectedLang) {
            setSelectedTranslation(locale);
        }
    };

    const fetchCategoryTranslation = async () => {
        if (categotyId !== null) {

            const response = await getCategoryTranslationById({
                category_id: categoryData.id ?? undefined,
                locale: selectedTranslation,
            });

            if (response && response.data) {
                const data = response.data as { name?: string };
                if (data.name) {
                    setCategoryName(data.name);
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

        const payload = {
            locale: selectedTranslation,
            categoryId: categotyId, // Use speckeyId instead of specification_key_id
            category: categoryName // Use the correct key for translated_key
        };

        try {
            if (!categotyId) {
                console.error('Product ID is undefined');
                return; // Handle this error case appropriately
            }

            // Submit the translation
            const response = await submitKeysTranslation(payload);

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
                        {categoryName}
                    </label>
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
