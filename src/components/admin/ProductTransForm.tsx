"use client";
import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '@/lib/types'; // Assuming you have a Product type
import { useCategory } from "@/hooks/useCategory";
import { useBrands } from "@/hooks/useBrands";
import { useProducts } from "@/hooks/useProducts";
import { LOCALES } from '@/lib/constants';

interface ProductFormProps {
    product?: Product; // Make it optional for the create case
}


const ProductTransForm = ({ product }: ProductFormProps) => {


    const [name, setName] = useState(product?.name || '');
    const [price, setPrice] = useState(product?.price || 0);
    const { Translation } = useProducts();
    const id = product && product.id;
    const [submitStatus, setSubmitStatus] = useState('');
    const [selectedTranslation, setSelectedTranslation] = useState('');
    const [translations, setTranslations] = useState(product?.translations);

    // Handle language switch
    const handleLanguageSwitch = (locale: string) => {

        const selectedLang = LOCALES.find((lang) => lang === locale);
        if (selectedLang) {
            setSelectedTranslation(locale);
        }
        
        if (product && translations) {
            const item = translations.find((item) => {
                return item.locale == locale
            })

            if (item) {
                setName(item.name)
                setPrice(item.price)
            }else{
                setName('');
                setPrice(0);
            }
        }
    };

    useEffect(() => {
       console.log('translationstranslations', translations)
    }, [translations]);


    // Select 'bn' translation by default on mount
    useEffect(() => {
        handleLanguageSwitch('bn');
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const payload = {
            name,
            price: parseFloat(price.toString()), // Convert price to a number
            locale: selectedTranslation
        };

        try {

            if (!id) {
                console.error('Product ID is undefined');
                return; // Handle this error case appropriately
            }


            // If there's an ID, update the product
            const response = await Translation(payload, id);  // Update product using its ID

            if (response.success) {
                setSubmitStatus('Form Submitted successfully');
                
                setTranslations((prevItem) => [
                    ...(prevItem || []),  // ensure prevItem is an array or initialize it as an empty array
                    response.data.translation  // append the new translation to the array
                  ]);
                  
                

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
                        Product Name
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="name"
                        type="text"
                        placeholder="Enter product name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>



                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">
                        Price
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="price"
                        type="number"
                        step="0.01"
                        placeholder="Enter product price"
                        value={price}
                        onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                    />
                </div>




                <div className="flex items-center justify-between">
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="submit"
                    >
                        {id ? 'Update Product' : 'Create Product'}
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

export default ProductTransForm;
