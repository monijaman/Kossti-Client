"use client";
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useReviews } from '@/hooks/useReviews';
import AdditionalDetailsForm from '@/components/reviews/AdditionalDetails';
import { SpecTranslation, ProductTranslation, AdditionalDetails, ProductApiResponse, Product } from '@/lib/types';
import { LOCALES } from '@/lib/constants';

// Dynamically import React Quill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css'; // Import styles

// Page props
interface PageProps {
    id: number | null;
    productName: string;
    translations: ProductTranslation[];
}

const ReviewTransForm = ({ id, productName, translations }: PageProps) => {
    const [selectedTranslation, setSelectedTranslation] = useState<SpecTranslation | null>(null);
    const [rating, setRating] = useState<number | null>(null);
    const { addReviewTranslation } = useReviews();
    const [formStatus, setFormStatus] = useState("");
    const [additionalDetails, setAdditionalDetails] = useState<AdditionalDetails[]>([]);
    const formattedAdditionalDetails = additionalDetails.map(detail => JSON.stringify(detail));
    const [selectedLocale, setSelectedLocale] = useState('');

    // Handle language switch
    const handleLanguageSwitch = (locale: string) => {
        const translation = translations.find((trans) => trans.locale === locale);
        if (translation) {
            setSelectedLocale(locale);
            setRating(parseFloat(translation.rating));
        }
    };

    // Select 'bn' translation by default on mount
    useEffect(() => {
        handleLanguageSwitch('bn');
    }, []);

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormStatus("")
        if (!selectedTranslation) return;

        // Prepare the data to be submitted
        const product_id = id;
        const review = selectedTranslation.review || "";
        // const rating = selectedTranslation.rating ? Number(selectedTranslation.rating) : null;
        const locale = selectedTranslation.locale ? selectedTranslation.locale : 'bn';

        // Make sure rating is either selected or from the selected translation
        const response = await addReviewTranslation(
            product_id,              // Pass the product review ID
            rating,                         // Rating value (ensure it's a number)
            review,                         // Review content
            locale,
            formattedAdditionalDetails,                             // Pass empty additional details for now or use additionalDetails if needed
        );

        setFormStatus("review submitted")

        // Handle the API response here, e.g., display success message or redirect
    };


    return (
        <form onSubmit={handleSubmit}>
            <h2 className="font-bold mb-4">Submit a Review for {productName}</h2>
            
            <div className="mb-4">
                {LOCALES.map((translation) => (
                    <button
                        key={translation}
                        onClick={() => handleLanguageSwitch(translation)}
                        className={`px-4 py-2 mr-2 ${selectedLocale === translation ? 'bg-blue-500 text-white' : 'bg-gray-200'
                            }`}
                    >
                        {translation.toUpperCase()}
                    </button>
                ))}
            </div>

            {/* Display Selected Translation */}
            {selectedLocale && (
                <div>

                    {/* Rating Input */}
                    <label htmlFor="rating" className="block mb-2">Rating</label>
                    <input
                        type="number"
                        id="rating"
                        value={rating || 0}  // Ensure initial value is set
                        onChange={(e) => setRating(parseFloat(e.target.value))} // Parse the value as a float
                        className="w-full p-2 mb-4 border rounded"
                        min="1"
                        max="5"
                        step="0.1"  // Allow decimal values, with steps of 0.1
                    />

                    {/* Translation Price */}
                    <label htmlFor="price" className="block mb-2">Price ({selectedLocale})</label>
                    <input
                        type="number"
                        id="price"
                        value={parseFloat(selectedTranslation.price) || 0}
                        onChange={(e) => setSelectedTranslation({
                            ...selectedTranslation,
                            price: e.target.value
                        })}
                        className="w-full p-2 mb-4 border rounded"
                    />

                    {/* Translation Review */}
                    <div className="row" style={{ minHeight: '320px' }}>
                        <label htmlFor="review" className="block mb-2">Review ({selectedTranslation.locale})</label>
                        <ReactQuill
                            value={selectedTranslation.review}
                            onChange={(value) => setSelectedTranslation({ ...selectedTranslation, review: value })}
                            className="mb-4"
                            id="review"
                            style={{ backgroundColor: "#f9f9f9", height: "200px" }}
                        />
                    </div>


                    <AdditionalDetailsForm
                        additionalDetails={additionalDetails}
                        setAdditionalDetails={setAdditionalDetails}
                    />

                    {/* Submit Button */}
                    <div className='my-4'>
                        <button
                            type="submit"
                            className="bg-blue-500 text-white py-2 px-4 rounded"
                        >
                            Submit Translation
                        </button>
                    </div>
                </div>


            )}

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
};

export default ReviewTransForm;
