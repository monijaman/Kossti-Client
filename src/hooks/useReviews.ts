const cacheBuster = new Date().getTime(); // Cache-busting parameter
const apiUrl = process.env.NEXT_PUBLIC_API_URL + "/api/v1";
import { useState, useEffect } from "react";
import {  AdditionalDetails } from '@/lib/types';

export const useReviews = () => {
  const getReview = async (
    page: number,
    limit: number,
    category?: string,
    brands?: string,
    priceRange?: string,
    searchTerm?: string,
    locale?: string
  ) => {
    const params: Record<string, string> = {
      page: page.toString(),
      limit: limit.toString(),
      // _: cacheBuster.toString(), // Cache-busting parameter
    };

    // Add optional parameters only if they are defined
    if (category) params.category = category;
    if (brands) params.brand = brands;
    if (priceRange) params.pricerange = priceRange;
    if (searchTerm) params.searchterm = searchTerm;
    if (locale) params.locale = locale;

    // Build the query string
    const queryString = new URLSearchParams(params).toString();

    console.log("queryString", queryString);

    // Ensure API URL is defined
    if (!apiUrl) {
      return Promise.reject(
        new Error("API URL is not defined in environment variables")
      );
    }

    const fullUrl = `${apiUrl}/products?${queryString}`;
    console.log("Fetching URL:", fullUrl); // Ensure this URL is correct

    try {
      const response = await fetch(fullUrl);
      const dataset = await response.json();

      return {
        success: true,
        data: dataset,
        totalProducts: dataset.totalProducts,
      };
    } catch (error) {
      console.error("Error fetching products:", error);
      return { success: false, data: [] };
    }
  };

  const getReviewByProductSlug= async (slug: string, locale?: string) => {
    const params: Record<string, string> = {};

    // Add optional parameters only if they are defined
    if (locale) params.locale = locale;

    // Build the query string
    const queryString = new URLSearchParams(params).toString();

    // Ensure API URL is defined
    if (!apiUrl) {
      return Promise.reject(
        new Error("API URL is not defined in environment variables")
      );
    }

    const fullUrl = `${apiUrl}/${slug}?${queryString}`;

    try {
      const response = await fetch(fullUrl);
      const dataset = await response.json();

      return {
        success: true,
        data: dataset.products,
        totalProducts: dataset.totalProducts,
      };
    } catch (error) {
      console.error("Error fetching products:", error);
      return { success: false, data: [] };
    }
  };
  const getReviewByProductId = async (id: number, locale?: string) => {
    const params: Record<string, string> = {};

    // Add optional parameters only if they are defined
    if (locale) params.locale = locale;

    // Build the query string
    const queryString = new URLSearchParams(params).toString();

    // Ensure API URL is defined
    if (!apiUrl) {
      return Promise.reject(
        new Error("API URL is not defined in environment variables")
      );
    }

    const fullUrl = `${apiUrl}/products/${id}/reviews?${queryString}`;

    try {
      const response = await fetch(fullUrl);
      const dataset = await response.json();
 
      return {
        success: true,
        data: dataset.product,
      };
    } catch (error) {
      console.error("Error fetching products:", error);
      return { success: false, data: [] };
    }
  };


  const getImagesByProductId = async (id: number) => {
    const params: Record<string, string> = {};

   
    // Build the query string
    const queryString = new URLSearchParams(params).toString();

    // Ensure API URL is defined
    if (!apiUrl) {
      return Promise.reject(
        new Error("API URL is not defined in environment variables")
      );
    }

    const fullUrl = `${apiUrl}/productimages/${id}/`;

    try {
      const response = await fetch(fullUrl);
      const dataset = await response.json();
 
      return {
        success: true,
        data: dataset.product,
      };
    } catch (error) {
      console.error("Error fetching products:", error);
      return { success: false, data: [] };
    }
  };

  // services/reviewService.ts
  const addReview = async (
    product_id: number | null = null,
    rating: number | null = null,
    reviews: string = "",
    additional_details: AdditionalDetails[] = [], // Change here
  ) => {
    try {
      // Prepare the form data
      const newFormData = {
        product_id,
        rating,
        reviews,
        additional_details, // Extract detail strings if needed
        apiUrl: `reviews/${product_id}`
      };

      // Make the POST request
      const response = await fetch("/api/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newFormData),
      });

      // Handle response
      if (!response.ok) {
        throw new Error("Failed to submit review");
      }

      const responseData = await response.json();
      return responseData; // Return the response if needed
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  // services/reviewService.ts
  const addReviewTranslation = async (
    product_id: number | null = null, // Changed to product_review_id
    rating: number | null = null,
    review: string = "",
    locale: string = "",
    additional_details: AdditionalDetails[] = [], // Change here
  ) => {

   
    try {
      // Prepare the form data
      const newFormData = {
        product_id, // Keep the id as per your backend requirement
        rating,
        review,
        locale,
        additional_details, // Send additional details as an array
        apiUrl: "review/translation", // Assuming this is used on the backend for some routing logic
      };

     
      // Make the POST request
      const response = await fetch("/api/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newFormData),
      });
     
 
      // Handle response
      if (!response.ok) {
        throw new Error("Failed to submit review");
      }

      const responseData = await response.json();
      return responseData; // Return the response if needed
    } catch (error) {
      console.error("Error submitting review:", error);
      throw error;
    }
  };

  return { addReview, getReview, getReviewByProductId, getImagesByProductId, addReviewTranslation };
};
