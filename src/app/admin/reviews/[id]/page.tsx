"use client";
import ReviewTransForm from '@/app/components/admin/reviews/ReviewTransForm';
import Modal from '@/app/components/Modal/client';
import AdditionalDetailsForm from '@/app/components/reviews/AdditionalDetails';
import DragNdrop from "@/app/components/Uploader/Uploader";
import ReactQuillWrapper from '@/components/ReactQuillWrapper';
import { useProducts } from '@/hooks/useProducts';
import { useReviews } from '@/hooks/useReviews';
import { extractRatingFromReview, generateAIReview, ReviewStyle } from '@/lib/openai-service';
import { AdditionalDetails, Product, Review, ReviewTranslation } from '@/lib/types';
import { useRouter } from 'next/navigation';
import React, { use, useEffect, useRef, useState } from 'react';

interface PageProps {
    params: Promise<{
        id: string; // Type for the id
    }>;
}

const ReviewForm = ({ params }: PageProps) => {
    const { id } = use(params);
    const router = useRouter();
    const [reviewData, setReviewData] = useState<Review>();
    const [reviews, setReviews] = useState<string>('');
    const [rating, setRating] = useState<number>(0);
    const { addReview, updateReview, getReviewByProductId } = useReviews();
    const { getAProductById } = useProducts();
    // const [productId, setProductId] = useState<number | null>(id); // To hold the fetched product ID
    const [reviewsError, setReviewsError] = useState<string>(''); // Validation error state for reviews
    const [additionalDetails, setAdditionalDetails] = useState<AdditionalDetails[]>([]);
    // Parent-managed transient message for AdditionalDetails
    const [detailsMessageVisible, setDetailsMessageVisible] = useState(false);
    const detailsTimerRef = useRef<number | null>(null);
    const [formStatus, setFormStatus] = useState("");
    const [loading, setLoading] = useState(false);
    const [dataLoading, setDataLoading] = useState(true);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [products, setProducts] = useState<Product>();
    const productName = ""
    const [files, setFiles] = useState<File[]>([]);
    const [aiLoading, setAiLoading] = useState(false);
    const [aiError, setAiError] = useState<string>('');
    const [isAIReviewModalOpen, setIsAIReviewModalOpen] = useState(false);
    const [aiReviewPrompt, setAiReviewPrompt] = useState<string>('');
    const [aiReviewStyle, setAiReviewStyle] = useState<ReviewStyle>('aesops-fable');
    const [activeStyleTab, setActiveStyleTab] = useState<'entertainment' | 'tech' | 'lifestyle'>('entertainment');
    const [translations, setTranslations] = useState<ReviewTranslation[]>([]);

    const fetchProductData = async () => {

        const productResponse = await getAProductById(+id);
        if (productResponse?.success && productResponse?.data) {
            setProducts(productResponse.data as Product);
        }
    }

    const fetchReviewData = async () => {
        try {
            setDataLoading(true);

            // Fetch base review data (English)
            const baseResponse = await getReviewByProductId(+id);
            // Fetch translated data (Bangla) for translations
            const transResponse = await getReviewByProductId(+id, 'bn');

            // Process base response for main form
            if (baseResponse?.success && baseResponse?.data) {
                const baseData = baseResponse.data as Record<string, unknown>;
                const baseReviews = baseData['reviews'];
                if (baseReviews && Array.isArray(baseReviews) && baseReviews.length > 0) {
                    const baseReviewItem = baseReviews[0] as Record<string, unknown>;
                    const baseReviewData = baseReviewItem['review'] as Record<string, unknown>;
                    setReviewData(baseReviewData as unknown as Review);
                    setReviews((baseReviewData['reviews'] as string) || (baseReviewData['review'] as string) || "");
                    setRating((baseReviewData['rating'] as number) || 0);
                    setAdditionalDetails((baseReviewData['additional_details'] as unknown as AdditionalDetails[]) ?? []);
                }
            }

            // Process trans response for translations
            if (transResponse?.success && transResponse?.data) {
                const data = transResponse.data as Record<string, unknown>;
                const translationsArray: Array<Record<string, unknown>> = [];

                // First, add the English translation from baseResponse
                if (baseResponse?.success && baseResponse?.data) {
                    const baseData = baseResponse.data as Record<string, unknown>;
                    const baseReviews = baseData['reviews'];
                    if (baseReviews && Array.isArray(baseReviews) && baseReviews.length > 0) {
                        const baseReviewItem = baseReviews[0] as Record<string, unknown>;
                        const reviewData = baseReviewItem['review'] as Record<string, unknown>;

                        translationsArray.push({
                            id: reviewData['id'],
                            product_review_id: reviewData['id'],
                            locale: 'en',
                            rating: reviewData['rating'] ?? 0,
                            review: reviewData['reviews'] ?? reviewData['review'],
                            additional_details: reviewData['additional_details'] ?? [],
                            created_at: reviewData['created_at'],
                            updated_at: reviewData['updated_at'],
                        });
                    }
                }

                // Now add the Bangla translation from transResponse
                // When ?locale=bn is specified, the API returns: { reviews: [{ review: {...} }] }
                const maybeReviews = data['reviews'];
                if (maybeReviews && Array.isArray(maybeReviews) && maybeReviews.length > 0) {
                    const firstReviewItem = maybeReviews[0] as Record<string, unknown>;
                    const reviewData = firstReviewItem['review'] as Record<string, unknown>;

                    if (reviewData) {
                        // The API returns Bengali translation directly in the reviews field when ?locale=bn
                        translationsArray.push({
                            id: reviewData['id'],
                            product_review_id: reviewData['product_id'],
                            locale: 'bn',
                            rating: reviewData['rating'] ?? 0,
                            review: reviewData['reviews'] as string, // This contains the Bengali translation
                            additional_details: reviewData['additional_details'] ?? [],
                            created_at: reviewData['created_at'],
                            updated_at: reviewData['updated_at'],
                        });
                    }
                }

                setTranslations(translationsArray as unknown as ReviewTranslation[]);
            }
        } catch (error) {
            console.error('Error fetching review:', error);
        } finally {
            setDataLoading(false);
        }
    };

    useEffect(() => {
        if (!id) return;
        fetchProductData()
        fetchReviewData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]); // Only run when id changes

    // Cleanup timer on unmount to avoid leaks
    useEffect(() => {
        return () => {
            if (detailsTimerRef.current) {
                window.clearTimeout(detailsTimerRef.current);
                detailsTimerRef.current = null;
            }
        };
    }, []);

    // Keep fetchProductData as a separate function for manual refresh
    const refreshProductData = async () => {
        try {
            setDataLoading(true);


            const response = await getReviewByProductId(+id);

            if (response?.success && response?.data) {
                if (response?.data.reviews?.[0]) {
                    const firstReviewItem = response?.data.reviews?.[0];
                    const reviewData = firstReviewItem['review'];
                    const translations: Array<Record<string, unknown>> = [];
                    // Add base review as English
                    translations.push({
                        id: reviewData['id'],
                        product_review_id: reviewData['id'],
                        locale: 'en',
                        rating: reviewData['rating'] ?? 0,
                        review: reviewData['reviews'] ?? reviewData['review'],
                        additional_details: reviewData['additional_details'] ?? [],
                        created_at: reviewData['created_at'],
                        updated_at: reviewData['updated_at'],
                    });

                    // Add translation if present
                    if (firstReviewItem['translation']) {
                        const t = firstReviewItem['translation'];
                        translations.push({
                            id: t['id'],
                            product_review_id: t['product_review_id'],
                            locale: t['locale'],
                            rating: t['rating'] ?? reviewData['rating'] ?? 0,
                            review: t['translated_review'],
                            additional_details: t['additional_details'] ?? [],
                            created_at: t['created_at'],
                            updated_at: t['updated_at'],
                        });
                    }

                    reviewData['translations'] = translations;
                    setReviewData(reviewData);
                    setReviews(reviewData.reviews)
                    setRating(reviewData.rating)
                    setAdditionalDetails(reviewData.additional_details ?? [])
                }
            }
        } catch (error) {
            console.error('Error fetching product:', error);
        } finally {
            setDataLoading(false);
        }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    // Only depend on id to prevent infinite re-fetching

    useEffect(() => {

        if (files.length > 0) {
            const formData = new FormData();
            files.forEach((file) => {
                formData.append('files', file);
            });
            // Assuming you have a function to handle the file upload
            // handleFileUpload(formData);
        }
    }
        , [files]);

    // Generate AI Review - Open Modal
    const handleGenerateAIReview = async () => {
        setIsAIReviewModalOpen(true);
        setAiReviewPrompt('');
    };

    // Generate AI Review with Custom Prompt
    const generateAIReviewWithPrompt = async () => {
        setAiLoading(true);
        setAiError('');
        setIsAIReviewModalOpen(false);

        try {

            if (!products?.name) {
                throw new Error('Product name is required');
            }

            // Generate review using OpenAI with product details and custom prompt
            const aiReviewContent = await generateAIReview({
                productName: products.name,
                productCategory: products.category_slug || '',
                locale: 'en',
                customPrompt: aiReviewPrompt || undefined,
                style: aiReviewStyle,
            });


            if (!aiReviewContent) {
                throw new Error('No content received from AI');
            }

            // Extract rating from the AI-generated content
            const extractedRating = extractRatingFromReview(aiReviewContent);
            console.log('📊 Extracted rating:', extractedRating);

            // Update form fields with AI review
            setReviews(aiReviewContent);
            setRating(extractedRating);

            // Show success message
            setSuccessMessage('✅ AI review generated successfully');

            setTimeout(() => {
                setSuccessMessage('');
            }, 30000);
        } catch (error) {
            console.error('❌ Error generating AI review:', error);
            const errorMessage =
                error instanceof Error ? error.message : 'Failed to generate AI review';
            setAiError(
                `Failed to generate AI review: ${errorMessage}`
            );

            setTimeout(() => {
                setAiError('');
            }, 5000);
        } finally {
            setAiLoading(false);
        }
    };

    const handleReviewSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setReviewsError('');
        setFormStatus('');
        setSuccessMessage('');
        setErrorMessage('');
        setLoading(true);

        // Validate the reviews field
        if (!reviews.trim()) {
            setReviewsError('Review content is required.');
            setLoading(false);
            return; // Stop form submission
        }

        // Validate rating
        const numRating = Number(rating);
        if (isNaN(numRating) || numRating < 1 || numRating > 5) {
            setErrorMessage('Rating must be a number between 1 and 5');
            setLoading(false);
            return;
        }

        if (!id) {
            console.error('No product ID found');
            setErrorMessage('Product ID not found');
            setLoading(false);
            return;
        }

        try {
            let result;
            if (reviewData && reviewData.id) {
                // Update existing review
                result = await updateReview(
                    +id,
                    reviewData.id,
                    numRating,
                    reviews,
                    additionalDetails,
                );
            } else {
                // Create new review
                result = await addReview(
                    +id,
                    numRating,
                    reviews,
                    additionalDetails,
                );
            }

            // Robust success detection: server may return { message, review } or { success, data } shapes
            const ok = !!(
                result && (
                    // direct shapes
                    result.review || result.message ||
                    // proxy shapes
                    (result.success === true) ||
                    (result.data && (result.data.review || result.data.message))
                )
            );

            if (ok) {
                setSuccessMessage('Review saved successfully!');
                setFormStatus('Review submitted successfully!');
                // Optionally refresh the data
                refreshProductData();

                // Auto-hide success message after 3 seconds
                setTimeout(() => {
                    setSuccessMessage('');
                    setFormStatus('');
                }, 3000);
            } else {
                // Try to extract a better server error message if present
                let errMsg = 'Failed to save review. Please try again.';
                try {
                    if (result && result.error) errMsg = String(result.error);
                    else if (result && result.message) errMsg = String(result.message);
                    else if (result && result.data && (result.data.error || result.data.message)) errMsg = String(result.data.error || result.data.message);
                } catch {
                    /* ignore */
                }

                setErrorMessage(errMsg);
                setFormStatus('Error submitting review');

                // Auto-hide error message after 5 seconds
                setTimeout(() => {
                    setErrorMessage('');
                    setFormStatus('');
                }, 5000);
            }
        } catch (error) {
            console.error('Error submitting review:', error);
            setErrorMessage('An error occurred while saving the review. Please try again.');
            setFormStatus('Error submitting review');

            // Auto-hide error message after 5 seconds
            setTimeout(() => {
                setErrorMessage('');
                setFormStatus('');
            }, 5000);
        } finally {
            setLoading(false);
        }
    };

    // Handler passed to AdditionalDetails to allow parent to show a transient message
    const handleAdditionalDetailsChange = (details: AdditionalDetails[]) => {
        setAdditionalDetails(details);
        setDetailsMessageVisible(true);
        if (detailsTimerRef.current) {
            window.clearTimeout(detailsTimerRef.current);
        }
        detailsTimerRef.current = window.setTimeout(() => {
            setDetailsMessageVisible(false);
            detailsTimerRef.current = null;
        }, 2500) as unknown as number;
    };

    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <Modal isOpen={isModalOpen} onClose={closeModal}>
                <DragNdrop onFilesSelected={setFiles} productId={+id} width="auto" height="auto" />
            </Modal>

            {/* Floating toast notification (top-right) for success/error */}
            {(successMessage || errorMessage) && (
                <div className="fixed top-4 right-4 z-50">
                    <div className={`max-w-sm w-full p-4 rounded shadow-lg flex items-start justify-between ${successMessage ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
                        <div>
                            <div className="font-bold">{successMessage ? 'Success!' : 'Error!'}</div>
                            <div className="text-sm mt-1">{successMessage || errorMessage}</div>
                        </div>
                        <button onClick={() => { setSuccessMessage(''); setErrorMessage(''); }} className="ml-4 text-white font-bold">✕</button>
                    </div>
                </div>
            )}

            {/* Loading indicator when fetching data */}
            {dataLoading ? (
                <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    <span className="ml-3 text-gray-600">Loading product review data...</span>
                </div>
            ) : (
                <div className="container mx-auto px-4 py-6">
                    {/* Page Header */}
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Product Review Management
                        </h1>
                        {products && (
                            <p className="text-gray-600">
                                Managing reviews for: <strong>{products.name}</strong>
                            </p>
                        )}
                        <hr className="mt-4 border-gray-200" />
                    </div>

                    <div className="flex flex-row gap-4">
                        <div className="w-1/2">
                            {/* File Upload Section */}
                            <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
                                <h3 className="text-lg font-semibold mb-3 text-gray-800">Media Upload</h3>
                                <button
                                    className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors duration-200 flex items-center gap-2"
                                    onClick={openModal}
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    Add Photos
                                </button>
                                <p className="text-sm text-gray-500 mt-2">Upload images to accompany the review</p>

                                {/* Display Uploaded Images */}
                                {files && files.length > 0 && (
                                    <div className="mt-4">
                                        <h4 className="text-sm font-semibold text-gray-700 mb-3">Uploaded Images ({files.length})</h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            {files.map((file, index) => (
                                                <div key={index} className="relative rounded-lg overflow-hidden border border-gray-200">
                                                    {file.type.startsWith('image/') ? (
                                                        <div className="relative">
                                                            <img
                                                                src={URL.createObjectURL(file)}
                                                                alt={file.name}
                                                                className="w-full h-40 object-cover"
                                                            />
                                                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2">
                                                                <p className="text-white text-xs truncate">{file.name}</p>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="w-full h-40 bg-gray-100 flex items-center justify-center">
                                                            <div className="text-center">
                                                                <p className="text-gray-600 text-sm font-medium">📄</p>
                                                                <p className="text-gray-600 text-xs mt-1 truncate">{file.name}</p>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Review Form */}
                            <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                                <div className="p-6">
                                    <h3 className="text-lg font-semibold mb-4 text-gray-800">Review Content</h3>

                                    <form onSubmit={handleReviewSubmit}>
                                        <h2 className="font-bold mb-4">Submit a Review for {products && products.name}</h2>

                                        {/* Rating Field */}
                                        <label htmlFor="rating" className="block mb-2">Rating</label>
                                        <input
                                            type="number"
                                            id="rating"
                                            value={rating || 0}  // Ensure initial value is set
                                            onChange={(e) => setRating(parseFloat(e.target.value))} // Parse the value as a float
                                            className="w-full p-2 mb-4 border rounded"
                                            min="1"
                                            max="5"
                                            step="0.05"  // Allow decimal values, with steps of 0.05
                                        />

                                        {/* Rich Text Editor for Reviews */}
                                        <div className="row" style={{ minHeight: '320px' }}>
                                            <label htmlFor="reviews" className="block mb-2">Review</label>
                                            <ReactQuillWrapper
                                                value={reviews}
                                                onChange={setReviews}
                                                className="mb-4"
                                                id="reviews"
                                                style={{ backgroundColor: '#f9f9f9', minHeight: '200px' }}
                                            />
                                            {reviewsError && <p className="text-red-500 mb-4">{reviewsError}</p>} {/* Display error */}
                                        </div>

                                        {/* Render the AdditionalDetailsForm component */}
                                        <AdditionalDetailsForm
                                            additionalDetails={additionalDetails}
                                            setAdditionalDetails={setAdditionalDetails}
                                            showMessage={detailsMessageVisible}
                                            onDetailsChange={handleAdditionalDetailsChange}
                                        />
                                        <hr className='mt-6' />
                                        {/* AI Error Message */}
                                        {aiError && (
                                            <div className="p-3 mt-4 mb-4 text-sm rounded-lg bg-red-100 text-red-700 border border-red-300">
                                                {aiError}
                                            </div>
                                        )}

                                        {/* AI Review Button */}
                                        <div className='my-4 mt-6'>

                                            <button
                                                type="button"
                                                onClick={handleGenerateAIReview}
                                                disabled={aiLoading || !products?.name}
                                                className={`py-2 px-6 rounded-full shadow-lg transition-all duration-200 ease-in-out ${aiLoading
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
                                        <hr />
                                        {/* Submit Button */}
                                        <div className='my-4 flex gap-3'>
                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className={`py-2 px-4 rounded transition-colors ${loading
                                                    ? 'bg-gray-400 cursor-not-allowed text-white'
                                                    : 'bg-blue-500 hover:bg-blue-700 text-white'
                                                    }`}
                                            >
                                                {loading ? 'Saving...' : 'Submit Review'}
                                            </button>

                                        </div>

                                        <hr />
                                        <div className='my-4 flex gap-3'>

                                            <button
                                                type="button"
                                                onClick={() => router.push(`/admin/specifications/${id}`)}
                                                className="py-2 px-4 rounded transition-colors bg-indigo-500 hover:bg-indigo-700 text-white"
                                            >
                                                EditSpecs
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => router.push(`/admin/products/${id}`)}
                                                className="py-2 px-4 rounded transition-colors bg-blue-600 hover:bg-blue-800 text-white"
                                            >
                                                Product
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>

                            {/* Success Message */}
                            {successMessage && (
                                <div className="p-4 mb-4 text-sm text-green-700 bg-green-100 rounded-lg border border-green-200" role="alert">
                                    <strong>Success!</strong> {successMessage}
                                </div>
                            )}

                            {/* Error Message */}
                            {errorMessage && (
                                <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg border border-red-200" role="alert">
                                    <strong>Error!</strong> {errorMessage}
                                </div>
                            )}

                            {/* Legacy Form Status */}
                            {formStatus && !successMessage && !errorMessage && (
                                <div
                                    className={`p-4 mb-4 text-sm rounded-lg ${formStatus.includes('success')
                                        ? 'text-green-700 bg-green-100'
                                        : 'text-red-700 bg-red-100'
                                        }`}
                                    role="alert">
                                    {formStatus}
                                </div>
                            )}
                        </div>

                        {/* Translation Form */}
                        {reviewData &&
                            <div className="w-1/2">
                                <ReviewTransForm productId={+id} productName={productName} translations={translations.length ? translations : (reviewData.translations || [])} />
                            </div>
                        }
                    </div>
                </div>
            )}

            {/* AI Review Prompt Modal */}
            <Modal
                isOpen={isAIReviewModalOpen}
                onClose={() => setIsAIReviewModalOpen(false)}
            >
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-gray-900">✨ Generate Comprehensive AI Review</h2>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">Review Style</label>

                        {/* Style Category Tabs */}
                        <div className="flex gap-2 mb-4 border-b border-gray-200">
                            <button
                                onClick={() => setActiveStyleTab('entertainment')}
                                className={`pb-2 px-4 font-medium text-sm transition-colors ${activeStyleTab === 'entertainment'
                                    ? 'border-b-2 border-blue-500 text-blue-600'
                                    : 'text-gray-600 hover:text-gray-800'
                                    }`}
                            >
                                🎭 Entertainment
                            </button>
                            <button
                                onClick={() => setActiveStyleTab('tech')}
                                className={`pb-2 px-4 font-medium text-sm transition-colors ${activeStyleTab === 'tech'
                                    ? 'border-b-2 border-blue-500 text-blue-600'
                                    : 'text-gray-600 hover:text-gray-800'
                                    }`}
                            >
                                💻 Tech & Products
                            </button>
                            <button
                                onClick={() => setActiveStyleTab('lifestyle')}
                                className={`pb-2 px-4 font-medium text-sm transition-colors ${activeStyleTab === 'lifestyle'
                                    ? 'border-b-2 border-blue-500 text-blue-600'
                                    : 'text-gray-600 hover:text-gray-800'
                                    }`}
                            >
                                🎯 Lifestyle & Use Cases
                            </button>
                        </div>

                        {/* Styles Grid - Shows based on active tab */}
                        <div className="grid grid-cols-2 gap-2">
                            {activeStyleTab === 'entertainment' && ([
                                { value: 'aesops-fable', label: "🦊 Aesop's Fable", desc: 'Storytelling with parables & morals' },
                                { value: 'sherlock-detective', label: '🔎 Sherlock', desc: 'Deductive investigation, case & verdict' },
                                { value: 'shakespearean-drama', label: '🎭 Shakespeare', desc: 'Five-act theatrical drama & soliloquy' },
                                { value: 'epic-mythology', label: '⚡ Epic Mythology', desc: 'Greek/Norse hero legend & divine gifts' },
                                { value: 'film-noir', label: '🕵️ Film Noir', desc: 'Hard-boiled 1940s detective monologue' },
                            ] as { value: ReviewStyle; label: string; desc: string }[]).map(({ value, label, desc }) => (
                                <button
                                    key={value}
                                    type="button"
                                    onClick={() => setAiReviewStyle(value)}
                                    className={`text-left px-3 py-2 rounded-md border text-sm transition-colors ${aiReviewStyle === value
                                        ? 'border-blue-500 bg-blue-50 text-blue-800'
                                        : 'border-gray-200 hover:border-gray-400 text-gray-700'
                                        }`}
                                >
                                    <div className="font-medium">{label}</div>
                                    <div className="text-xs text-gray-500">{desc}</div>
                                </button>
                            ))}

                            {activeStyleTab === 'tech' && ([
                                { value: 'technical-expert', label: '🔧 Technical Expert', desc: 'Data-driven engineering analysis' },
                                { value: 'tech-journalist', label: '📱 Tech Journalist', desc: 'CNET-style specs, benchmarks & testing' },
                                { value: 'the-verge', label: '🎨 The Verge', desc: 'Design-focused tech journalism & culture' },
                                { value: 'consumer-reports', label: '📊 Consumer Reports', desc: 'Scientific rigorous testing methodology' },
                                { value: 'pcmag', label: '💻 PCMag', desc: 'Professional comprehensive tech reviews' },
                                { value: 'anandtech', label: '🔬 AnandTech', desc: 'Deep technical analysis for enthusiasts' },
                                { value: 'casual-friendly', label: '😊 Casual & Friendly', desc: 'Conversational everyday language' },
                                { value: 'critical-honest', label: '🔍 Critical & Honest', desc: 'Brutally honest, no-nonsense' },
                                { value: 'wirecutter', label: '🛒 Wirecutter', desc: 'Practical expert testing & honest buyer guide' },
                            ] as { value: ReviewStyle; label: string; desc: string }[]).map(({ value, label, desc }) => (
                                <button
                                    key={value}
                                    type="button"
                                    onClick={() => setAiReviewStyle(value)}
                                    className={`text-left px-3 py-2 rounded-md border text-sm transition-colors ${aiReviewStyle === value
                                        ? 'border-blue-500 bg-blue-50 text-blue-800'
                                        : 'border-gray-200 hover:border-gray-400 text-gray-700'
                                        }`}
                                >
                                    <div className="font-medium">{label}</div>
                                    <div className="text-xs text-gray-500">{desc}</div>
                                </button>
                            ))}

                            {activeStyleTab === 'lifestyle' && ([
                                { value: 'luxury-premium', label: '💎 Luxury Premium', desc: 'Aspirational, premium experience' },
                                { value: 'budget-practical', label: '💡 Budget Practical', desc: 'Value-focused, smart spending' },
                                { value: 'family-safe', label: '👨‍👩‍👧 Family Friendly', desc: 'Safety, reliability & family needs' },
                                { value: 'performance-enthusiast', label: '🏆 Performance', desc: 'High-performance & enthusiast focus' },
                                { value: 'eco-conscious', label: '🌿 Eco Conscious', desc: 'Sustainability & environmental impact' },
                                { value: 'urban-commuter', label: '🏙️ Daily User', desc: 'Everyday practicality & convenience' },
                                { value: 'edmunds', label: '📋 Buyer Guide', desc: "Comprehensive buyer's guide & value" },
                                { value: 'car-and-driver', label: '🎖️ Expert Review', desc: 'In-depth expert analysis & testing' },
                                { value: 'motor-trend', label: '📸 Professional', desc: 'Professional journalism standards' },
                            ] as { value: ReviewStyle; label: string; desc: string }[]).map(({ value, label, desc }) => (
                                <button
                                    key={value}
                                    type="button"
                                    onClick={() => setAiReviewStyle(value)}
                                    className={`text-left px-3 py-2 rounded-md border text-sm transition-colors ${aiReviewStyle === value
                                        ? 'border-blue-500 bg-blue-50 text-blue-800'
                                        : 'border-gray-200 hover:border-gray-400 text-gray-700'
                                        }`}
                                >
                                    <div className="font-medium">{label}</div>
                                    <div className="text-xs text-gray-500">{desc}</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Custom Prompt (Optional)
                        </label>
                        <textarea
                            value={aiReviewPrompt}
                            onChange={(e) => setAiReviewPrompt(e.target.value)}
                            placeholder="Enter additional context or specific instructions (e.g., 'Focus on fuel efficiency and durability' or 'Compare with competitor X' or 'Emphasize features for budget-conscious buyers')..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            rows={4}
                        />
                    </div>
                    <div className="flex justify-end gap-2">
                        <button
                            onClick={() => setIsAIReviewModalOpen(false)}
                            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={generateAIReviewWithPrompt}
                            disabled={aiLoading}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                        >
                            {aiLoading ? 'Generating...' : 'Generate Review'}
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default ReviewForm;
