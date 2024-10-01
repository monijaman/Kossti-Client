"use client";
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { SpecTranslation } from '@/lib/types'; // Adjust import based on your file structure

// Dynamically import React Quill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css'; // Import styles

// Page props
interface PageProps {
    id: number | null;
    productName: string;
    translations: SpecTranslation[];
}

const ReviewTransForm = ({ id, productName, translations }: PageProps) => {
    const [selectedTranslation, setSelectedTranslation] = useState<SpecTranslation | null>(null);
    const [rating, setRating] = useState<number | null>(null);

    // Handle language switch
    const handleLanguageSwitch = (locale: string) => {
        const translation = translations.find((trans) => trans.locale === locale);
        if (translation) {
            setSelectedTranslation(translation);
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
        if (!selectedTranslation) return;

        // Prepare the data to be submitted
        const formData = {
            id: selectedTranslation.id,
            locale: selectedTranslation.locale,
            name: selectedTranslation.name,
            price: selectedTranslation.price,
            review: selectedTranslation.review,
            rating: rating ? rating.toString() : selectedTranslation.rating,
            product_review_id: selectedTranslation.product_review_id,
        };

        console.log("Form data to submit:", formData);

        // TODO: Add your API call here to submit the formData to the backend
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2 className="font-bold mb-4">Submit a Review for {productName}</h2>

            {/* Language Switch Buttons */}
            <div className="mb-4">
                {translations.map((translation) => (
                    <button
                        key={translation.locale}
                        onClick={() => handleLanguageSwitch(translation.locale)}
                        className={`px-4 py-2 mr-2 ${selectedTranslation?.locale === translation.locale ? 'bg-blue-500 text-white' : 'bg-gray-200'
                            }`}
                    >
                        {translation.locale.toUpperCase()}
                    </button>
                ))}
            </div>

            {/* Display Selected Translation */}
            {selectedTranslation && (
                <div>
                    <h3 className="font-semibold mb-2">
                        Editing Translation for {selectedTranslation.locale.toUpperCase()}
                    </h3>

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
                    <label htmlFor="price" className="block mb-2">Price ({selectedTranslation.locale})</label>
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
                            style={{ backgroundColor: "#f9f9f9", height: "150px" }}
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="bg-blue-500 text-white py-2 px-4 rounded"
                    >
                        Submit Translation
                    </button>
                </div>
            )}
        </form>
    );
};

export default ReviewTransForm;
