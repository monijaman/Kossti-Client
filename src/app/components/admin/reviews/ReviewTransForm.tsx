"use client";
import AdditionalDetailsForm from '@/app/components/reviews/AdditionalDetails';
import ReactQuillWrapper from '@/components/ReactQuillWrapper';
import { useReviews } from '@/hooks/useReviews';
import { LOCALES } from '@/lib/constants';
import { AdditionalDetails, ReviewTranslation } from '@/lib/types';
import { generateAIReview, extractRatingFromReview, translateToBengali, convertTobengaliNumerals } from '@/lib/openai-service';
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
    const [ratingInput, setRatingInput] = useState<string>(''); // Store raw rating input as string
    // Transient success message for translation submit
    const [transSuccessMessage, setTransSuccessMessage] = useState<string>('');
    const transTimerRef = useRef<number | null>(null);
    // Transient error message
    const [transErrorMessage, setTransErrorMessage] = useState<string>('');
    const transErrorTimerRef = useRef<number | null>(null);
    // AI Review states
    const [aiLoading, setAiLoading] = useState(false);
    const [aiError, setAiError] = useState<string>('');
    // Translation states - SEPARATE loading states
    const [translateReviewLoading, setTranslateReviewLoading] = useState(false);
    const [submitTranslationLoading, setSubmitTranslationLoading] = useState(false);
    const [translationError, setTranslationError] = useState<string>('');

    const resetForm = useCallback(() => {
        const newTranslation: ReviewTranslation = {
            locale: selectedLocale,
            rating: 0,
            review: '',
            additional_details: []
        };
        setSelectedTranslation(newTranslation); // Set to null or leave unchanged
        setRatingInput(''); // Reset rating input
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
                // Keep rating as-is (whether it's Bengali string "৪.१५" or English "4.15")
                const ratingValue = translation.rating;
                const ratingString = typeof ratingValue === 'string' ? ratingValue : (typeof ratingValue === 'number' ? String(ratingValue) : '');
                console.log('Setting ratingInput to:', ratingString);
                setRatingInput(ratingString);
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

    // Convert Bengali/Devanagari numerals to English
    const convertToEnglishNumber = (value: string): number => {
        let englishText = value;
        // Replace Bengali numerals (U+09E6-09EF with 0-9)
        for (let i = 0; i < 10; i++) {
            const bengaliChar = String.fromCharCode(0x09E6 + i);
            englishText = englishText.replace(new RegExp(bengaliChar, 'g'), String(i));
        }
        // Replace Devanagari numerals (U+0966-096F with 0-9)
        for (let i = 0; i < 10; i++) {
            const devanagariChar = String.fromCharCode(0x0966 + i);
            englishText = englishText.replace(new RegExp(devanagariChar, 'g'), String(i));
        }
        const numericText = englishText.replace(/[^\d.]/g, '');
        return numericText ? parseFloat(numericText) : 0;
    };

    // Generate AI Review
    const handleGenerateAIReview = async () => {
        setAiLoading(true);
        setAiError('');
        
        try {
            if (!productName) {
                throw new Error('Product name is required');
            }

            console.log('🚀 Starting AI review generation for:', productName);

            // Generate review using OpenAI
            const aiReviewContent = await generateAIReview({
                productName,
                locale: 'en', // For now, always generate in English
            });

            console.log('✅ AI review generated successfully');

            if (!aiReviewContent) {
                throw new Error('No content received from AI');
            }

            // Extract rating from the AI-generated content
            const extractedRating = extractRatingFromReview(aiReviewContent);
            console.log('📊 Extracted rating:', extractedRating);

            // Update form fields with AI review
            setSelectedTranslation({
                ...selectedTranslation,
                review: aiReviewContent,
                rating: extractedRating,
            });

            // Update rating input
            setRatingInput(String(extractedRating));

            // Show success message
            setTransSuccessMessage('✅ AI review generated successfully');

            setTimeout(() => {
                setTransSuccessMessage('');
            }, 3000);
        } catch (error) {
            console.error('❌ Error generating AI review:', error);
            const errorMessage =
                error instanceof Error ? error.message : 'Failed to generate AI review';
            setAiError(
                `Failed to generate AI review: ${errorMessage}`
            );

            setTimeout(() => {
                setAiError('');
            }, 50000);
        } finally {
            setAiLoading(false);
        }
    };

    // Translate Review to Bengali
    const handleTranslateReview = async () => {
        setTranslateReviewLoading(true);
        setTranslationError('');

        try {
            // Get English translation from transData
            const englishTranslation = transData.find((trans) => trans.locale === 'en');
            
            if (!englishTranslation || !englishTranslation.review) {
                throw new Error('English translation not found. Please add the English review first.');
            }

            console.log('🌍 Starting review translation from English to Bengali...');

            // Translate the English review to Bengali
            const bengaliReview = await translateToBengali(englishTranslation.review);

            console.log('✅ Review translated to Bengali successfully');

            if (!bengaliReview) {
                throw new Error('No content received from translation');
            }

            // Update form fields with translated review
            setSelectedTranslation({
                ...selectedTranslation,
                review: bengaliReview,
            });

            // Convert English rating to Bengali numerals if available
            if (englishTranslation.rating) {
                const bengaliRating = convertTobengaliNumerals(String(englishTranslation.rating));
                setRatingInput(bengaliRating);
            }

            // Show success message
            setTransSuccessMessage('✅ Review translated to Bengali successfully');

            setTimeout(() => {
                setTransSuccessMessage('');
            }, 3000);
        } catch (error) {
            console.error('❌ Error translating review:', error);
            const errorMessage =
                error instanceof Error ? error.message : 'Failed to translate review';
            setTranslationError(
                `Failed to translate review: ${errorMessage}`
            );

            setTimeout(() => {
                setTranslationError('');
            }, 5000);
        } finally {
            setTranslateReviewLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormStatus("");
        setSubmitTranslationLoading(true);
        console.log('[ReviewTransForm] Translation submit started');

        if (!selectedTranslation) {
            setSubmitTranslationLoading(false);
            return;
        }

        const product_id = productId;

        try {
            // Prepare the data to be submitted - send rating as string
            const response = await addReviewTranslation(
                product_id,
                ratingInput, // Send the ratingInput string directly
                selectedTranslation.review,
                selectedLocale,
                additionalDetails
            );

            if (response && response.success) {
                const details = response.data.translation || response.data.review;
                const updatedTransData = transData.map((dataset) => {
                    if (dataset.locale === selectedLocale) {
                        return { ...dataset, ...details };
                    }
                    return dataset;
                });

                setTransData(updatedTransData);
                
                // Update ratingInput to show the newly saved rating (preserve Bengali format)
                if (details && details.rating) {
                    setRatingInput(String(details.rating));
                }
                
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
        } catch (error) {
            console.error('Translation submission error:', error);
            setFormStatus('An error occurred while submitting translation');
            setTransErrorMessage('An error occurred while submitting translation');
        } finally {
            console.log('[ReviewTransForm] Translation submit finished');
            setSubmitTranslationLoading(false);
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
                        <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-2">Rating (0 to 5)</label>
                        <input
                            type="text"
                            id="rating"
                            value={ratingInput}
                            onChange={(e) => {
                                // Store the raw value as-is (can be Bengali, Devanagari, or English)
                                setRatingInput(e.target.value);
                            }}
                            onBlur={(e) => {
                                // On blur, validate but keep original format
                                const inputValue = String(e.target.value);
                                const numericRatingValue = convertToEnglishNumber(inputValue);
                                if (numericRatingValue >= 0 && numericRatingValue <= 5) {
                                    // Keep the original input format, don't convert back to English
                                    setSelectedTranslation({
                                        ...selectedTranslation,
                                        rating: numericRatingValue // Store numeric for internal state
                                    });
                                    // ratingInput stays as original (Bengali/Devanagari/English)
                                } else {
                                    setRatingInput(''); // Clear if invalid
                                    setSelectedTranslation({
                                        ...selectedTranslation,
                                        rating: 0
                                    });
                                }
                            }}
                            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="0 to 5 (English or Bengali numerals like ৪.१५)"
                        />
                    </div>

                    {/* Review Input */}
                    <div className="relative min-h-[400px]">
                        <label htmlFor="review" className="block text-sm font-medium text-gray-700 mb-2">Review ({selectedTranslation.locale})</label>
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
                            style={{ backgroundColor: "#f9f9f9" }}
                        />
                    </div>

                    {/* Additional Details Form */}
                    <AdditionalDetailsForm
                        additionalDetails={additionalDetails}
                        setAdditionalDetails={setAdditionalDetails}
                    />

                    {/* AI Error Message */}
                    {aiError && (
                        <div className="p-3 mt-4 mb-4 text-sm rounded-lg bg-red-100 text-red-700 border border-red-300">
                            {aiError}
                        </div>
                    )}

                    {/* Translation Error Message */}
                    {translationError && (
                        <div className="p-3 mt-4 mb-4 text-sm rounded-lg bg-red-100 text-red-700 border border-red-300">
                            {translationError}
                        </div>
                    )}

                    {/* AI Review Button - Only for English */}
                    {selectedLocale === 'en' && (
                        <div className="flex justify-center gap-4 flex-wrap mb-4">
                            <button
                                type="button"
                                onClick={handleGenerateAIReview}
                                disabled={aiLoading || !productName}
                                className={`py-2 px-6 rounded-full shadow-lg transition-all duration-200 ease-in-out ${
                                    aiLoading
                                        ? 'bg-gray-400 cursor-not-allowed text-white'
                                        : 'bg-purple-500 hover:bg-purple-600 text-white'
                                }`}
                            >
                                {aiLoading ? (
                                    <span className="flex items-center gap-2">
                                        <span className="animate-spin">⏳</span>
                                        Generating...
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        <span>✨</span>
                                        AI Review  
                                    </span>
                                )}
                            </button>
                        </div>
                    )}

                    {/* Translate to Bengali Button - Only for Bengali */}
                    {selectedLocale === 'bn' && (
                        <div className="flex justify-center gap-4 flex-wrap mb-4">
                            <button
                                type="button"
                                onClick={handleTranslateReview}
                                disabled={translateReviewLoading || !transData.find((trans) => trans.locale === 'en')?.review}
                                className={`py-2 px-6 rounded-full shadow-lg transition-all duration-200 ease-in-out ${
                                    translateReviewLoading
                                        ? 'bg-gray-400 cursor-not-allowed text-white'
                                        : 'bg-indigo-500 hover:bg-indigo-600 text-white'
                                }`}
                            >
                                {translateReviewLoading ? (
                                    <span className="flex items-center gap-2">
                                        <span className="animate-spin">⏳</span>
                                        Translating...
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        <span>🌍</span>
                                        Translate English to Bengali  
                                    </span>
                                )}
                            </button>
                        </div>
                    )}

                    {/* Button Group - Submit */}
                    <div className="flex justify-center gap-4 flex-wrap">
                        <button
                            type="submit"
                            disabled={submitTranslationLoading}
                            className={`text-white py-2 px-6 rounded-full shadow-lg transition-all duration-200 ease-in-out ${
                                submitTranslationLoading
                                    ? 'bg-gray-500 cursor-wait opacity-75'
                                    : 'bg-blue-500 hover:bg-blue-600'
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            {submitTranslationLoading ? (
                                <>
                                    <span className="animate-spin inline-block mr-2">⏳</span>
                                    Submitting...
                                </>
                            ) : (
                                'Submit Translation'
                            )}
                        </button>
                    </div>

                    {/* Inline transient success / error messages for translation submit */}
                    {transSuccessMessage && (
                        <div className="mt-4 text-sm text-green-700 text-center">{transSuccessMessage}</div>
                    )}
                    {transErrorMessage && (
                        <div className="mt-4 text-sm text-red-600 text-center">{transErrorMessage}</div>
                    )}
                </div>
            )}

            {/* Status Message */}
            {formStatus && (
                <div className="p-4 mt-4 mb-4 text-sm rounded-lg bg-green-100 text-green-700" role="alert">
                    {formStatus}
                </div>
            )}
        </form>
    );
};

export default ReviewTransForm;
