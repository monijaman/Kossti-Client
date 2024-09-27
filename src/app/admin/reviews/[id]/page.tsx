"use client"
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { useReviews } from '@/hooks/useReviews';

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
    const [additionalDdetails, setAdditionalDdetails] = useState<AdditionalDetail[]>([]);
    const [priority, setPriority] = useState<number>(1);
    const { addReview } = useReviews()

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const formData = {
            product_id: 1,
            review_id: id,
            rating: rating,
            reviews: reviews,
            additional_details: [],
            priority: priority
        };

        try {
            const response = await addReview(
                +formData.product_id,
                +formData.review_id,
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
            {/* <label htmlFor="additional_details" className="block mb-2">Additional Details</label>
            <textarea
                id="additional_details"
                value={additionalDetails}
                onChange={(e) => setAdditionalDetails(e.target.value)}
                className="w-full p-2 mb-4 border rounded"
            /> */}

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
