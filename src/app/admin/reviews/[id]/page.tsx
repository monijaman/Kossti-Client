"use client";
import React, { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import { useReviews } from '@/hooks/useReviews';
import { useProducts } from '@/hooks/useProducts';

import ReviewTransForm from '@/components/admin/reviews/ReviewTransForm';
import { ProductTranslation, AdditionalDetails, Review, Product } from '@/lib/types';
import AdditionalDetailsForm from '@/components/reviews/AdditionalDetails';
import Modal from '@/components/Modal/client';
// Dynamically import React Quill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css'; // Import styles
import DragNdrop from "@/components/Uploader/Uploader";

interface PageProps {
    params: {
        id: number; // Type for the slug
    };
}

const ReviewForm = ({ params }: PageProps) => {
    const { id } = params;
    const [reviewData, setReviewData] = useState<Review>();
    const [reviews, setReviews] = useState<string>('');
    const [rating, setRating] = useState<number>(0);
    const { addReview, getReviewByProductId } = useReviews();
    const { getAProductById } = useProducts();
    // const [productId, setProductId] = useState<number | null>(id); // To hold the fetched product ID
    const [productName, setProductName] = useState<string>(''); // To hold the fetched product name
    const [reviewsError, setReviewsError] = useState<string>(''); // Validation error state for reviews
    const [translations, setTranslations] = useState<ProductTranslation[]>([]); // Hold product translations
    const [additionalDetails, setAdditionalDetails] = useState<AdditionalDetails[]>([]);
    const [formStatus, setFormStatus] = useState("");
    const [products, setProducts] = useState<Product>();
    const [files, setFiles] = useState<File[]>([]);
    const filesRef = useRef<File[]>([]); // Updated type

    const fetchProductData = async () => {
        try {
            const response = await getReviewByProductId(+id); // Fetch product by ID
            if (response?.success && response?.data) {
                // setProductId(id); // Set the actual product ID

                setProducts(response.data); // Set the actual review content
                if (response?.data.reviews?.[0]) {
                    const dataset = response?.data.reviews?.[0];
                    setReviewData(dataset);
                    setReviews(dataset.reviews)
                    setRating(dataset.rating)
                    setAdditionalDetails(dataset.additional_details ?? [])
                }
                // setTranslations(response.data.translations); // Set translations
            }
        } catch (error) {
            console.error('Error fetching product:', error);
        }
    };

    useEffect(() => {
        if (id) {
            fetchProductData();
        }
    }, []);


    const formattedAdditionalDetails = Array.isArray(additionalDetails)
        ? additionalDetails.map(detail => JSON.stringify(detail))
        : [];

    const handleReviewSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setReviewsError('');
        setFormStatus('')
        // Validate the reviews field
        if (!reviews.trim()) {
            setReviewsError('Review content is required.');
            return; // Stop form submission
        }

        if (!id) {
            console.error('No product ID found');
            return;
        }

        try {
            const response = await addReview(
                id,
                rating,
                reviews,
                additionalDetails,
            );
            setFormStatus('Review submitted!');
        } catch (error) {
            console.error('Error submitting review:', error);
        }
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
                <DragNdrop onFilesSelected={setFiles} productId={id} width="auto" height="auto" />
            </Modal>
            <div className="flex flex-row gap-4">
                <div className="w-1/2">
                    {/* Navigates back to the base URL - closing the modal */}
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                        onClick={openModal}
                    >
                        Add Photos
                    </button>
                    {/* Review Form */}
                    <form onSubmit={handleReviewSubmit} className="p-4 bg-gray-100 border rounded">
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
                            <ReactQuill
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
                        />

                        {/* Submit Button */}
                        <div className='my-4'>
                            <button
                                type="submit"
                                className="bg-blue-500 text-white py-2 px-4 rounded"
                            >
                                Submit Review
                            </button>
                        </div>
                    </form>

                    {formStatus && (
                        <div
                            className={`p-4 mb-4 text-sm rounded-lg ${formStatus.includes('success')
                                ? 'text-green-700 bg-green-100'
                                : 'text-black-700 bg-green-100'
                                }`}
                            role="alert">
                            {formStatus}
                        </div>
                    )}
                </div>

                {/* Translation Form */}
                {reviewData && 
                <div className="w-1/2">
                    <ReviewTransForm productId={id} productName={productName} translations={reviewData.translations} />
                </div>
                }
            </div>
        </>
    );
};

export default ReviewForm;
