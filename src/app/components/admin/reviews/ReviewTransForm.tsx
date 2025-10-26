"use client";
import AdditionalDetailsForm from '@/app/components/reviews/AdditionalDetails';
import ReactQuillWrapper from '@/components/ReactQuillWrapper';
import { useReviews } from '@/hooks/useReviews';
import { LOCALES } from '@/lib/constants';
import { AdditionalDetails, ReviewTranslation } from '@/lib/types';
import React, { useCallback, useEffect, useRef, useState } from 'react';

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
    // Transient success message for translation submit
    const [transSuccessMessage, setTransSuccessMessage] = useState<string>('');
    const transTimerRef = useRef<number | null>(null);
    // Transient error message
    const [transErrorMessage, setTransErrorMessage] = useState<string>('');
    const transErrorTimerRef = useRef<number | null>(null);

    const resetForm = useCallback(() => {
        const newTranslation: ReviewTranslation = {
            locale: selectedLocale,
            rating: 0,
            review: '',
            additional_details: []
        };
        setSelectedTranslation(newTranslation); // Set to null or leave unchanged
    }, [selectedLocale]);

    // Ensure we update transData when translations prop changes
    useEffect(() => {
        if (translations && translations.length > 0) {
            setTransData(translations);
        } else {
            resetForm();
        }
    }, [translations, resetForm]);

    const loadTranslation = useCallback(async () => {
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
    }, [transData, selectedLocale, resetForm]);

    useEffect(() => {
        resetForm();
        loadTranslation();
    }, [selectedLocale, loadTranslation, resetForm]);

    useEffect(() => {
        loadTranslation();
    }, [transData, loadTranslation]);

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

        if (response && response.success) {
            const details = response.data.review;
            const updatedTransData = transData.map((dataset) => {
                if (dataset.locale === selectedLocale) {
                    return { ...dataset, ...details };
                }
                return dataset;
            });

            setTransData(updatedTransData);
            const msg = response.data.message || 'Review submitted successfully';
            setFormStatus(msg);

            // Show transient success message below the submit button
            setTransSuccessMessage(msg);
            if (transTimerRef.current) {
                window.clearTimeout(transTimerRef.current);
            }
            transTimerRef.current = window.setTimeout(() => {
                setTransSuccessMessage('');
                transTimerRef.current = null;
            }, 2500) as unknown as number;
        } else {
            // Handle error case
            let err = 'Failed to submit translation';
            try {
                if (response && response.data && (response.data.error || response.data.message)) {
                    err = String(response.data.error || response.data.message);
                } else if (response && response.message) {
                    err = String(response.message);
                }
            } catch {
                /* ignore */
            }

            setFormStatus(err);

            // Show transient error message
            setTransErrorMessage(err);
            if (transErrorTimerRef.current) {
                window.clearTimeout(transErrorTimerRef.current);
            }
            transErrorTimerRef.current = window.setTimeout(() => {
                setTransErrorMessage('');
                transErrorTimerRef.current = null;
            }, 2500) as unknown as number;
        }
    };

    // Cleanup timer on unmount
    useEffect(() => {
        return () => {
            if (transTimerRef.current) {
                window.clearTimeout(transTimerRef.current);
                transTimerRef.current = null;
            }
            if (transErrorTimerRef.current) {
                window.clearTimeout(transErrorTimerRef.current);
                transErrorTimerRef.current = null;
            }
        };
    }, []);

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
                        <ReactQuillWrapper
                            value={selectedTranslation.review || ''}
                            onChange={(value: string) => {
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

                    {/* Inline transient success / error messages for translation submit */}
                    {transSuccessMessage && (
                        <div className="mt-2 text-sm text-green-700 text-center">{transSuccessMessage}</div>
                    )}
                    {transErrorMessage && (
                        <div className="mt-2 text-sm text-red-600 text-center">{transErrorMessage}</div>
                    )}
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
