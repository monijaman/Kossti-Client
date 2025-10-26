"use client";
import ReviewTransForm from '@/app/components/admin/reviews/ReviewTransForm';
import Modal from '@/app/components/Modal/client';
import AdditionalDetailsForm from '@/app/components/reviews/AdditionalDetails';
import DragNdrop from "@/app/components/Uploader/Uploader";
import ReactQuillWrapper from '@/components/ReactQuillWrapper';
import { useReviews } from '@/hooks/useReviews';
import { AdditionalDetails, Product, Review } from '@/lib/types';
import React, { use, useCallback, useEffect, useRef, useState } from 'react';

interface PageProps {
    params: Promise<{
        id: string; // Type for the id
    }>;
}

const ReviewForm = ({ params }: PageProps) => {
    const { id } = use(params);
    const [reviewData, setReviewData] = useState<Review>();
    const [reviews, setReviews] = useState<string>('');
    const [rating, setRating] = useState<number>(0);
    const { addReview, updateReview, getReviewByProductId } = useReviews();
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

    useEffect(() => {
        if (!id) return;

        const fetchProductData = async () => {
            try {
                setDataLoading(true);
                const response = await getReviewByProductId(+id); // Fetch product by ID
                if (response?.success && response?.data) {
                    const data = response.data as Record<string, unknown>;
                    // Normalize response shapes: some endpoints return { product_id, reviews: [...] }
                    // while others return { review: {...}, translation: {...} }
                    let dataset: Record<string, unknown> | null = null;

                    const maybeReviews = data['reviews'];
                    if (maybeReviews && Array.isArray(maybeReviews) && maybeReviews.length > 0) {
                        dataset = maybeReviews[0] as Record<string, unknown>;
                    } else if (data['review']) {
                        // Single-review shape: attach translation into translations[] if present
                        dataset = data['review'] as Record<string, unknown>;
                        const translationVal = data['translation'];
                        if (translationVal && typeof translationVal === 'object') {
                            const t = translationVal as Record<string, unknown>;
                            dataset['translations'] = [
                                {
                                    id: t['id'],
                                    product_review_id: t['product_review_id'],
                                    locale: t['locale'],
                                    rating: dataset['rating'] ?? 0,
                                    review: t['translated_review'],
                                    additional_details: t['additional_details'] ?? [],
                                    created_at: t['created_at'],
                                    updated_at: t['updated_at'],
                                },
                            ];
                        }
                    }

                    if (dataset) {
                        setProducts(response.data as Product);
                        setReviewData(dataset as unknown as Review);
                        setReviews((dataset['reviews'] as string) || (dataset['review'] as string) || "");
                        setRating((dataset['rating'] as number) || 0);
                        setAdditionalDetails((dataset['additional_details'] as unknown as AdditionalDetails[]) ?? []);
                    }
                }
            } catch (error) {
                console.error('Error fetching product:', error);
            } finally {
                setDataLoading(false);
            }
        };

        fetchProductData();
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
    const refreshProductData = useCallback(async () => {
        try {
            setDataLoading(true);
            const response = await getReviewByProductId(+id);
            if (response?.success && response?.data) {
                setProducts(response.data);
                if (response?.data.reviews?.[0]) {
                    const dataset = response?.data.reviews?.[0];
                    setReviewData(dataset);
                    setReviews(dataset.reviews)
                    setRating(dataset.rating)
                    setAdditionalDetails(dataset.additional_details ?? [])
                }
            }
        } catch (error) {
            console.error('Error fetching product:', error);
        } finally {
            setDataLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]); // Only depend on id to prevent infinite re-fetching

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
                    rating,
                    reviews,
                    additionalDetails,
                );
            } else {
                // Create new review
                result = await addReview(
                    +id,
                    rating,
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
                                            step="0.1"  // Allow decimal values, with steps of 0.1
                                        />

                                        {/* Rich Text Editor for Reviews */}
                                        <div className="row" style={{ minHeight: '320px' }}>
                                            <label htmlFor="reviews" className="block mb-2">Review</label>
                                            <ReactQuillWrapper
                                                value={reviews}
                                                onChange={setReviews}
                                                className="mb-4"
                                                id="reviews"
                                                style={{ backgroundColor: '#f9f9f9', height: '200px' }}
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

                                        {/* Submit Button */}
                                        <div className='my-4'>
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
                                <ReviewTransForm productId={+id} productName={productName} translations={reviewData.translations} />
                            </div>
                        }
                    </div>
                </div>
            )}
        </>
    );
};

export default ReviewForm;
