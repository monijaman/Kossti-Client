"use client";
import AdditionalDetailsForm from '@/components/reviews/AdditionalDetails';
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
    // const [selectedTranslation, setSelectedTranslation] = useState<ReviewTranslation | null>(null);

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

    const resetFrom = () => {
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
            resetFrom();
        }
    }, [translations]);

    const loadTranslation = async () => {

        setAdditionalDetails([]); // Set to null or leave unchanged

        if (transData && transData.length > 0) {
            // handleLanguageSwitch('bn');

            const translation = transData.find((trans) => trans.locale === selectedLocale);
            if (translation) {
                setSelectedTranslation(translation); // Set selectedTranslation to the correct translation
                setAdditionalDetails(translation.additional_details); // Set selectedTranslation to the correct translation
            }
        } else {
            resetFrom();
        }
    }


    useEffect(() => {
        resetFrom();
        loadTranslation();
    }, [selectedLocale]);



    useEffect(() => {

        loadTranslation();
    }, [transData]);




    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormStatus("")

        // console.log(selectedTranslation)
        if (!selectedTranslation) return;

        // Prepare the data to be submitted
        const product_id = productId;

        // Make sure rating is either selected or from the selected translation
        const response = await addReviewTranslation(
            product_id,              // Pass the product review ID
            selectedTranslation.rating,                         // Rating value (ensure it's a number)
            selectedTranslation.review,                         // Review content
            selectedLocale,
            additionalDetails,                             // Pass empty additional details for now or use additionalDetails if needed
        );

        if (response.success) {
            const details = response.data.review;

            // Updated transData array by mapping over it
            const updatedTransData = transData.map((dataset) => {
                // Check if the locale matches
                if (dataset.locale === selectedLocale) {
                    // Return a new object, preserving structure and adding `details` where appropriate
                    return {
                        ...dataset,
                        ...details,  // Spread details into the existing dataset
                    };
                } else {
                    // Return unchanged dataset if locale doesn't match
                    return dataset;
                }
            });

            // Set the updated data in state
            setTransData(updatedTransData);  // Make sure `setTransData` is used to update the state

            // Set form status message
            setFormStatus(response.data.message || ''); // Provide a fallback in case `message` is undefined
        }

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
                        onClick={() => setSelectedLocale(translation)}
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
                        value={selectedTranslation.rating}  // Ensure initial value is set
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
                            value={selectedTranslation.review || ''} // Clears content if review is empty
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
