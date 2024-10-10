"use client";
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useReviews } from '@/hooks/useReviews';
import AdditionalDetailsForm from '@/components/reviews/AdditionalDetails';
import { SpecTranslation, ProductTranslation, AdditionalDetails, ProductApiResponse, Product, ReviewTranslation } from '@/lib/types';
import { LOCALES } from '@/lib/constants';

// Dynamically import React Quill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css'; // Import styles
import { combineSlices } from '@reduxjs/toolkit';

// Page props
interface PageProps {
    id: number | null;
    productName: string;
    translations?: ReviewTranslation[];
}

const ReviewTransForm = ({ id, productName, translations }: PageProps) => {
    const [selectedTranslation, setSelectedTranslation] = useState<ReviewTranslation | null>(null);
    const [rating, setRating] = useState<number | null>(null);
    const [price, setPrice] = useState<number | null>(null);
    const [review, setReview] = useState<string>('');
    const { addReviewTranslation } = useReviews();
    const [formStatus, setFormStatus] = useState("");
    const [additionalDetails, setAdditionalDetails] = useState<AdditionalDetails[]>([]);
    const formattedAdditionalDetails = additionalDetails.map(detail => JSON.stringify(detail));
    const [selectedLocale, setSelectedLocale] = useState('bn');

    // Handle language switch
    const handleLanguageSwitch = (locale: string) => {
        setSelectedLocale(locale);
 
    };

    useEffect(() => {
        handleLanguageSwitch('bn');
    }, []);


    useEffect(() => {

        console.log('selectedLocale', selectedLocale)

        const newTranslation: ReviewTranslation = {
            locale: selectedLocale,
            rating: 0,
            review: '',
            additional_details: []
        };
     
        if (translations && translations?.length > 0) {
            // handleLanguageSwitch('bn');
            
            const translation = translations.find((trans) => trans.locale === selectedLocale);
            if (translation) {
                setSelectedTranslation(translation); // Set selectedTranslation to the correct translation
                setAdditionalDetails(translation.additional_details); // Set selectedTranslation to the correct translation
            }else{
                setSelectedTranslation(newTranslation); // Set to null or leave unchanged
                setAdditionalDetails([]); // Set to null or leave unchanged
                
            }
            
        }else{
            
            setAdditionalDetails([]); // Set to null or leave unchanged
            setSelectedTranslation(newTranslation); // Set to null or leave unchanged
        }

    }, [selectedLocale,translations]);




    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormStatus("")

        console.log(selectedTranslation)
        if (!selectedTranslation) return;

        // Prepare the data to be submitted
        const product_id = id;
        
        // Make sure rating is either selected or from the selected translation
        const response = await addReviewTranslation(
            product_id,              // Pass the product review ID
            selectedTranslation.rating,                         // Rating value (ensure it's a number)
            selectedTranslation.review,                         // Review content
            selectedLocale,
            additionalDetails,                             // Pass empty additional details for now or use additionalDetails if needed
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
                        type='button'
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
                        value={selectedTranslation?.rating}  // Ensure initial value is set
                        onChange={(e) => {
                            if (selectedTranslation) {
                                setSelectedTranslation({
                                    ...selectedTranslation,
                                    rating: parseFloat(e.target.value) || 0 // Convert to number
                                });
                            }
                        }}

                        className="w-full p-2 mb-4 border rounded"
                        min="1"
                        max="5"
                        step="0.1"  // Allow decimal values, with steps of 0.1
                    />

                    {/* Translation Review */}
                    <div className="row" style={{ minHeight: '320px' }}>
                        <label htmlFor="review" className="block mb-2">Review ({selectedTranslation && selectedTranslation.locale})</label>
                        <ReactQuill
                            value={selectedTranslation?.review}
                            onChange={(value) => {
                                if (selectedTranslation) {
                                    setSelectedTranslation({ ...selectedTranslation, review: value });
                                }
                            }}
                            modules={{
                                clipboard: {
                                    matchVisual: false, // Strip out formatting on paste
                                },
                            }}
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
