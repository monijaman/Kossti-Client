"use client";
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useReviews } from '@/hooks/useReviews';
import { useProducts } from '@/hooks/useProducts';
import ReviewTransForm from '@/components/reviews/SpecificationTranslations';
import { SpecTranslation, ProductApiResponse, Product } from '@/lib/types';



// Dynamically import React Quill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css'; // Import styles

interface PageProps {
    params: {
        id: string; // Type for the slug
    };
}

interface AdditionalDetail {
    detail: string;
}

const ReviewForm = ({ params }: PageProps) => {
    const { id } = params;
    const [rating, setRating] = useState<number | null>(null);
    const [reviews, setReviews] = useState<string>(''); // This will hold rich text
    const [additionalDetails, setAdditionalDetails] = useState<AdditionalDetail[]>([]); // Hold additional details
    const [priority, setPriority] = useState<number>(1);
    const { addReview } = useReviews();
    const { getAProductById } = useProducts();
    const [productId, setProductId] = useState<number | null>(null); // To hold the fetched product ID
    const [productName, setProductName] = useState<string>(''); // To hold the fetched product name
    const [reviewsError, setReviewsError] = useState<string>(''); // Validation error state for reviews
    const [translations, setTranslations] = useState<SpecTranslation[]>([]); // Hold product translations
    const [selectedTranslation, setSelectedTranslation] = useState<SpecTranslation | null>(null);

    const fetchProductData = async () => {
        try {
            const response = await getAProductById(+id); // Fetch product by ID
            if (response?.success && response?.data) {
                setProductId(response.data.id); // Set the actual product ID
                setProductName(response.data.name); // Set the actual product name
                setTranslations(response.data.translations); // Set translations
            }
        } catch (error) {
            console.error('Error fetching product:', error);
        }
    };

    useEffect(() => {
        fetchProductData();
    }, []);

    const formattedAdditionalDetails = additionalDetails.map(detail => JSON.stringify(detail));

    const handleReviewSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setReviewsError('');
        // Validate the reviews field
        if (!reviews.trim()) {
            setReviewsError('Review content is required.');
            return; // Stop form submission
        }

        if (!productId) {
            console.error('No product ID found');
            return;
        }

        try {
            const response = await addReview(
                productId,
                rating,
                reviews,
                formattedAdditionalDetails,
                priority
            );
            console.log('Review submitted:', response);
        } catch (error) {
            console.error('Error submitting review:', error);
        }
    };

    const handleAdditionalDetailsChange = (index: number, value: string) => {
        const updatedDetails = [...additionalDetails];
        updatedDetails[index] = { detail: value };
        setAdditionalDetails(updatedDetails);
    };



    return (
        <>

            <div className="flex flex-row gap-4">
                <div className="w-1/2">
                    {/* Review Form */}
                    <form onSubmit={handleReviewSubmit} className="p-4 bg-gray-100 border rounded">
                        <h2 className="font-bold mb-4">Submit a Review for {productName && productName}</h2>

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

                        {/* Priority Field */}
                        <label htmlFor="priority" className="block mb-2">Priority</label>
                        <input
                            type="number"
                            id="priority"
                            value={priority || ''}
                            onChange={(e) => setPriority(Number(e.target.value))}
                            className="w-full p-2 mb-4 border rounded"
                            min="1"
                        />

                        {/* Rich Text Editor for Reviews */}
                        <div className="row"  >
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
                        </div>

                        {/* Additional Details Field */}
                        {additionalDetails.map((detail, index) => (
                            <div key={index}>
                                <label htmlFor={`additionalDetail_${index}`} className="block mb-2">
                                    Additional Detail {index + 1}
                                </label>
                                <input
                                    type="text"
                                    id={`additionalDetail_${index}`}
                                    value={detail.detail}
                                    onChange={(e) => handleAdditionalDetailsChange(index, e.target.value)}
                                    className="w-full p-2 mb-4 border rounded"
                                />
                            </div>
                        ))}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="bg-blue-500 text-white py-2 px-4 rounded"
                        >
                            Submit Review
                        </button>
                    </form>

                </div>
                <div className="w-1/2">

                    <ReviewTransForm id={productId} productName={productName} translations={translations} />
                </div>
            </div>

        </>
    );
};

export default ReviewForm;
