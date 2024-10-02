"use client";
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useReviews } from '@/hooks/useReviews';
import { useProducts } from '@/hooks/useProducts';

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
    const [rating, setRating] = useState<number>(1);
    const [reviews, setReviews] = useState<string>(''); // This will hold rich text
    const [additionalDetails, setAdditionalDetails] = useState<AdditionalDetail[]>([]); // Changed the variable name to correct one
    const [priority, setPriority] = useState<number>(1);
    const { addReview } = useReviews();
    const { getAProductById } = useProducts();
    const [productId, setProductId] = useState<number | null>(null); // To hold the fetched product ID

    const fetchProductData = async () => {
        try {
            const response = await getAProductById(+id);
            if (response?.success && response?.data) {
                setProductId(response.data.id); // Set the actual product ID
                console.log('Product data:', response.data);
            }
        } catch (error) {
            console.error('Error fetching product:', error);
        }
    };

    useEffect(() => {
        fetchProductData();
    }, []);

    const formattedAdditionalDetails = additionalDetails.map(detail => JSON.stringify(detail));

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!productId) {
            console.error('No product ID found');
            return;
        }

        const formData = {
            product_id: productId,  // Use the fetched product ID
            rating: rating,
            reviews: reviews,
            additional_details: formattedAdditionalDetails, // Passing additional details
            priority: priority
        };

        try {
            const response = await addReview(
                +formData.product_id,
                formData.rating,
                formData.reviews,
                formData.additional_details,
                formData.priority
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
        <form onSubmit={handleSubmit} className="p-4 bg-gray-100 border rounded">
            <h2 className="font-bold mb-4">Submit a Review</h2>

            {/* Rating Field */}
            <label htmlFor="rating" className="block mb-2">Rating</label>
            <input
                type="number"
                id="rating"
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="w-full p-2 mb-4 border rounded"
                min="1"
                max="5"
            />

            {/* Rich Text Editor for Reviews */}
            <label htmlFor="reviews" className="block mb-2">Review</label>
            <ReactQuill
                value={reviews}
                onChange={setReviews}
                className="mb-4"
                id="reviews"
            />

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

            {/* Priority Field */}
            <label htmlFor="priority" className="block mb-2">Priority</label>
            <input
                type="number"
                id="priority"
                value={priority}
                onChange={(e) => setPriority(Number(e.target.value))}
                className="w-full p-2 mb-4 border rounded"
                min="1"
            />

            {/* Submit Button */}
            <button
                type="submit"
                className="bg-blue-500 text-white py-2 px-4 rounded"
            >
                Submit Review
            </button>
        </form>
    );
};

export default ReviewForm;
