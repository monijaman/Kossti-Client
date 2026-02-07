const apiUrl = process.env.NEXT_PUBLIC_API_URL;
import { AdditionalDetails } from "@/lib/types";
import { useCallback } from "react";

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

    // Ensure API URL is defined
    if (!apiUrl) {
      return Promise.reject(
        new Error("API URL is not defined in environment variables")
      );
    }

    const fullUrl = `${apiUrl}/products?${queryString}`;

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
    
    // Use the new /product-reviews endpoint to fetch reviews by product_id
    // Append locale parameter if provided
    const fullUrl = `${apiUrl}/product-reviews/${id}${locale ? `?locale=${locale}` : ''}`;

    try {
      const response = await fetch(fullUrl);
      const dataset = await response.json();
 
      // The API returns { product_id: <id>, count: <n>, reviews: [...] }
      // Return the whole dataset as `data` so callers can access reviews
      return {
        success: true,
        data: dataset,
      };
    } catch (error) {
      console.error("Error fetching reviews by product id:", error);
      return { success: false, data: [] };
    }
  };

  const getImagesByProductId = async (id: number) => {
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
        data: dataset.images,
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
    additional_details: AdditionalDetails[] = [] // Change here
  ) => {
    try {
      // Ensure API base URL is available
      if (!apiUrl) {
        throw new Error("API URL is not defined in environment variables");
      }

      // Validate rating is a number
      const numRating = rating ? Number(rating) : null;
      if (numRating === null || isNaN(numRating)) {
        throw new Error("Rating must be a valid number");
      }

      // Ensure additional_details is an array and filter out empty entries
      const cleanedDetails = Array.isArray(additional_details) 
        ? additional_details.filter(detail => {
            const youtubeUrl = (detail as any).youtubeUrl?.trim();
            const sourceUrl = (detail as any).sourceUrl?.trim();
            return youtubeUrl || sourceUrl;
          })
        : [];

      // POST to the backend create-review endpoint: {BASEURL}/reviews/{product_id}
      // If you want to update an existing review instead, use /product/{id}/review/{reviewid}
      const fullUrl = `${apiUrl}/reviews/${product_id}`;

      const payload: Record<string, any> = {
        rating: numRating,
        reviews,
      };

      // Only include additional_details if there are non-empty items
      if (cleanedDetails.length > 0) {
        payload.additional_details = cleanedDetails;
      }

      const response = await fetch(fullUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Failed to submit review: ${response.status} ${text}`);
      }

      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  // services/reviewService.ts
  const addReviewTranslation = async (
    product_id: number | null = null, // Changed to product_review_id
    rating: string | null = null, // Changed to string to accept Bangla numerals
    review: string = "",
    locale: string = "",
    additional_details: AdditionalDetails[] = [] // Change here
  ) => {
    try {
      // Ensure API base URL is available
      if (!apiUrl) {
        throw new Error("API URL is not defined in environment variables");
      }

      // Serialize additional_details as JSON
      let serializedDetails: string | null = null;
      if (additional_details && additional_details.length > 0) {
        serializedDetails = JSON.stringify(additional_details);
      }

      // Build the payload expected by the Go server
      const payload: Record<string, string | number | null | object> = {
        product_id,
        locale,
        review,
        rating: rating || "", // Send rating as string (Bangla numerals or ASCII)
      };

      // Add additional_details only if it's not empty
      if (serializedDetails) {
        payload.additional_details = JSON.parse(serializedDetails);
      }

      // POST directly to the Go server translation endpoint
      const fullUrl = `${apiUrl}/review/translation`;

      const response = await fetch(fullUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(
          `Failed to submit translation: ${response.status} ${text}`
        );
      }

      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.error("Error submitting review:", error);
      throw error;
    }
  };

  const getReviews = useCallback(async (
    page: number,
    limit: number,
    searchTerm?: string,
    category?: number | null
  ) => {
    const params: Record<string, string> = {
      page: page.toString(),
      limit: limit.toString(),
    };

    // Add optional parameters only if they are defined
    if (searchTerm) params.searchterm = searchTerm;
    if (category) params.category = category.toString();

    // Build the query string
    const queryString = new URLSearchParams(params).toString();

    const apiEndpoint = `/api/get?action=reviews&${queryString}`;

    try {
      const response = await fetch(apiEndpoint, { cache: "no-store" });

      // Log the response for debugging

      if (!response.ok) {
        // Attempt to parse the error message from the response
        const errorMessage = await response.text();
        throw new Error(`Failed to fetch reviews: ${errorMessage}`);
      }

      const dataset = await response.json();
      return dataset;
    } catch (error) {
      if (error instanceof Error) {
        // Handle error if it's an instance of Error
        console.error("Error fetching reviews:", error.message);
        return { success: false, message: error.message, data: [] };
      } else {
        // Handle unexpected error types
        console.error("Unknown error fetching reviews:", error);
        return {
          success: false,
          message: "An unknown error occurred",
          data: [],
        };
      }
    }
  }, []);

  const getPublicReviewsByProductId = async (id: number, locale?: string) => {
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

    // const fullUrl = `${apiUrl}/products/${id}/reviews?${queryString}`;
    const fullUrl = `${apiUrl}/public-reviews/${id}/?${queryString}`;

    try {
      const response = await fetch(fullUrl);
      const dataset = await response.json();

      return {
        success: true,
        data: dataset.reviews,
      };
    } catch (error) {
      console.error("Error fetching products:", error);
      return { success: false, data: [] };
    }
  };
  // Update review helper (used by updateReview below)
  async function updateReviewInternal(
    apiUrlVal: string | undefined,
    product_id: number | null,
    review_id: number | null,
    rating: number | null,
    reviewsStr: string,
    additional_details: AdditionalDetails[]
  ) {
    if (!apiUrlVal)
      throw new Error("API URL is not defined in environment variables");
    if (!product_id || !review_id)
      throw new Error("product_id and review_id are required");

    // Validate rating is a number
    const numRating = rating ? Number(rating) : null;
    if (numRating === null || isNaN(numRating)) {
      throw new Error("Rating must be a valid number");
    }

    // Ensure additional_details is an array and filter out empty entries
    const cleanedDetails = Array.isArray(additional_details) 
      ? additional_details.filter(detail => {
          const youtubeUrl = (detail as any).youtubeUrl?.trim();
          const sourceUrl = (detail as any).sourceUrl?.trim();
          return youtubeUrl || sourceUrl;
        })
      : [];

    const fullUrl = `${apiUrlVal}/product/${product_id}/review/${review_id}`;

    const payload: Record<string, any> = {
      rating: numRating,
      reviews: reviewsStr,
    };

    // Only include additional_details if there are non-empty items
    if (cleanedDetails.length > 0) {
      payload.additional_details = cleanedDetails;
    }

    const response = await fetch(fullUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Failed to update review: ${response.status} ${text}`);
    }

    return await response.json();
  }

  // expose updateReview for hook users
  const updateReview = async (
    product_id: number | null = null,
    review_id: number | null = null,
    rating: number | null = null,
    reviews: string = "",
    additional_details: AdditionalDetails[] = []
  ) => {
    try {
      return await updateReviewInternal(
        apiUrl,
        product_id,
        review_id,
        rating,
        reviews,
        additional_details
      );
    } catch (error) {
      console.error("Error updating review:", error);
      throw error;
    }
  };

  return {
    addReview,
    updateReview,
    getReview,
    getReviews,
    getReviewByProductId,
    getImagesByProductId,
    addReviewTranslation,
    getPublicReviewsByProductId,
  };
};
