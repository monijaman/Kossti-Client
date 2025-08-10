"use client";
import AdditionalDetailsForm from '@/app/components/reviews/AdditionalDetails';
import { useReviews } from '@/hooks/useReviews';
import { LOCALES } from '@/lib/constants';
import { AdditionalDetails, ReviewTranslation } from '@/lib/types';
import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';
import 'react-quill/dist/quill.snow.css'; // Import styles

// Dynamically import React Quill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

// Page props
interface PageProps {
    productId: number | null;
    productName: string;
    translations?: ReviewTranslation[] | undefined;
}

const ReviewTransForm = ({ productId, productName, translations }: PageProps) => {
    const [selectedTranslation, setSelectedTranslation] = useState<ReviewTranslation>({
        locale: '',
        rating: 0,
        review: '',
        additional_details: []
    }); // Initialize with default values

    const { addReviewTranslation } = useReviews();
    const [formStatus, setFormStatus] = useState("");
    const [additionalDetails, setAdditionalDetails] = useState<AdditionalDetails[]>([]);
    const [selectedLocale, setSelectedLocale] = useState('bn');
    const [transData, setTransData] = useState<ReviewTranslation[]>([]);

    const resetForm = () => {
        const newTranslation: ReviewTranslation = {
            locale: selectedLocale,
            rating: 0,
            review: '',
            additional_details: []
        };
        setSelectedTranslation(newTranslation); // Set to null or leave unchanged
    }

    useEffect(() => {
        if (translations && translations.length > 0) {
            setTransData(translations);
        } else {
            resetForm();
        }
    }, [translations]);

    const loadTranslation = async () => {
        setAdditionalDetails([]); // Reset additional details

        if (transData.length > 0) {
            const translation = transData.find((trans) => trans.locale === selectedLocale);
            if (translation) {
                setSelectedTranslation(translation); // Set selectedTranslation to the correct translation
                setAdditionalDetails(translation.additional_details); // Set additional details
            }
        } else {
            resetForm();
        }
    }

    useEffect(() => {
        resetForm();
        loadTranslation();
    }, [selectedLocale]);

    useEffect(() => {
        loadTranslation();
    }, [transData]);

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormStatus("");

        if (!selectedTranslation) return;

        const product_id = productId;

        // Prepare the data to be submitted
        const response = await addReviewTranslation(
            product_id,
            selectedTranslation.rating,
            selectedTranslation.review,
            selectedLocale,
            additionalDetails
        );

        if (response.success) {
            const details = response.data.review;
            const updatedTransData = transData.map((dataset) => {
                if (dataset.locale === selectedLocale) {
                    return { ...dataset, ...details };
                }
                return dataset;
            });

            setTransData(updatedTransData);
            setFormStatus(response.data.message || 'Review submitted successfully');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Submit a Review for {productName}</h2>

            {/* Locale Selector */}
            <div className="text-center">
                {LOCALES.map((translation) => (
                    <button
                        key={translation}
                        type="button"
                        onClick={() => setSelectedLocale(translation)}
                        className={`px-4 py-2 mx-2 rounded-full text-sm font-semibold 
                            ${selectedLocale === translation ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}
                            transition duration-200 ease-in-out hover:bg-blue-400`}
                    >
                        {translation.toUpperCase()}
                    </button>
                ))}
            </div>

            {/* Display Selected Translation */}
            {selectedLocale && (
                <div className="space-y-4">
                    {/* Rating Input */}
                    <div>
                        <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                        <input
                            type="number"
                            id="rating"
                            value={selectedTranslation.rating}
                            onChange={(e) => {
                                if (selectedTranslation) {
                                    setSelectedTranslation({
                                        ...selectedTranslation,
                                        rating: parseFloat(e.target.value) || 0
                                    });
                                }
                            }}
                            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            min="1"
                            max="5"
                            step="0.1"
                        />
                    </div>

                    {/* Review Input */}
                    <div className="relative min-h-[400px]">
                        <label htmlFor="review" className="block text-sm font-medium  text-gray-700 mb-2">Review ({selectedTranslation.locale})</label>
                        <ReactQuill
                            value={selectedTranslation.review || ''}
                            onChange={(value) => {
                                if (selectedTranslation) {
                                    setSelectedTranslation({ ...selectedTranslation, review: value });
                                }
                            }}
                            modules={{
                                clipboard: { matchVisual: false }
                            }}
                            className="w-full mb-4 border border-gray-300 rounded-md"
                            id="review"
                            style={{ height: "350px", backgroundColor: "#f9f9f9" }}
                        />
                    </div>

                    {/* Additional Details Form */}
                    <AdditionalDetailsForm
                        additionalDetails={additionalDetails}
                        setAdditionalDetails={setAdditionalDetails}
                    />

                    {/* Submit Button */}
                    <div className="flex justify-center">
                        <button
                            type="submit"
                            className="bg-blue-500 text-white py-2 px-6 rounded-full shadow-lg transition-all duration-200 ease-in-out hover:bg-blue-600"
                        >
                            Submit Translation
                        </button>
                    </div>
                </div>
            )}

            {/* Status Message */}
            {formStatus && (
                <div className="p-4 mb-4 text-sm rounded-lg bg-green-100 text-green-700" role="alert">
                    {formStatus}
                </div>
            )}
        </form>
    );
};

export default ReviewTransForm;
