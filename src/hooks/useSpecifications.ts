import { apiEndpoints } from "@/lib/constants";
import fetchApi from "@/lib/fetchApi";

import {
  ApiResponse,
  SpecificationInt,
  SpecificationKey,
  SpecKeyTranslation,
} from "@/lib/types";
import { useCallback } from "react";
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const useSpecifications = () => {
  const getSpecificationsKeys = useCallback(async (searchTerm = "") => {
    // Use the correct endpoint for getting specification keys with a high limit to get all
    const apiEndpoint = `speckey${
      searchTerm
        ? `?search=${encodeURIComponent(searchTerm)}&limit=1000`
        : "?limit=1000"
    }`;

    if (!apiUrl) {
      return Promise.reject(
        new Error("API URL is not defined in environment variables")
      );
    }

    const fullUrl = `${apiUrl}/${apiEndpoint}`;

    try {
      const response = await fetch(fullUrl);
      const dataset = await response.json();

      return {
        success: true,
        data: dataset.specification_keys || [],
      };
    } catch (error) {
      console.error("Error fetching specification keys:", error);
      return { success: false, data: [] };
    }
  }, []);

  const getSpecifications = useCallback(async (id: number) => {
    const apiEndpoint = `get-specifications/${id}`;

    if (!apiUrl) {
      return Promise.reject(
        new Error("API URL is not defined in environment variables")
      );
    }

    const fullUrl = `${apiUrl}/${apiEndpoint}`;

    try {
      const [specificationsResponse, productResponse] = await Promise.all([
        fetch(fullUrl),
        fetch(`${apiUrl}/products/${id}`),
      ]);

      const specificationsData = await specificationsResponse.json();
      const productData = await productResponse.json();

      // Transform the Go server response to match the expected frontend structure
      return {
        success: true,
        dataset: {
          specifications: specificationsData.specifications || [],
          name: productData.name || `Product ${specificationsData.product_id}`,
          formspecs: specificationsData.specifications || [], // Fallback for the existing component logic
        },
        count: specificationsData.count || 0,
        product_id: specificationsData.product_id,
      };
    } catch (error) {
      console.error("Error fetching specifications:", error);
      return { success: false, data: [] };
    }
  }, []);

  const getSpecificationsByCategory = async (categoryId: number) => {
    const apiEndpoint = `catgory-specs/${categoryId}`;

    if (!apiUrl) {
      return Promise.reject(
        new Error("API URL is not defined in environment variables")
      );
    }

    const fullUrl = `${apiUrl}/${apiEndpoint}`;

    try {
      const response = await fetch(fullUrl); // Adjust API endpoint
      const dataset = await response.json();

      return {
        success: true,
        ...dataset,
      };
    } catch (error) {
      console.error("Error fetching category:", error);
      return { success: false, data: [] };
    }
  };

  const getFormSpecifications = async (id: number) => {
    if (!id) {
      return;
    }

    const apiEndpoint = `?action=formgenerator/${id}`;
    try {
      const response = await fetch(`/api/get${apiEndpoint}`); // Adjust API endpoint
      const dataset = await response.json();
      return dataset.data;
    } catch (error) {
      console.error("Error fetching campaigns:", error);
    }
  };
  const getSpecTranslations = useCallback(
    async (id: number, locale: string) => {
      if (!id) {
        return;
      }

      if (!apiUrl) {
        console.error("API URL is not defined in environment variables");
        return;
      }

      const apiEndpoint = `spec_translation/${id}?locale=${locale}`;
      const fullUrl = `${apiUrl}/${apiEndpoint}`;

      try {
        const response = await fetch(fullUrl, {
          cache: "no-store",
        });
        const dataset = await response.json();

        return dataset.dataset; // Go API returns data in 'dataset' field
      } catch (error) {
        console.error("Error fetching spec translations:", error);
        return [];
      }
    },
    []
  );

  // Submit form
  const submitSpecifications = async (
    categoryId: number,
    specifications: SpecificationKey[]
  ): Promise<ApiResponse> => {
    try {
      // Prepare the payload with productId, specifications, and apiUrl

      const specArrays = specifications
        .map((spec) => spec.id) // Return the `id` directly
        .filter((id): id is number => id !== null) // Ensure non-null values
        .sort((a, b) => a - b); // Sort numerically
      const payload = {
        category_id: categoryId,
        specification_id: specArrays,
        apiUrl: "formgenerator",
      };

      // Send the request to the backend
      const response = await fetch("/api/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload), // Send payload including apiUrl
      });

      // Check if the response is successful
      if (!response.ok) {
        throw new Error("Failed to submit specifications");
      }

      // Return the JSON response if the request was successful
      return await response.json();
    } catch (error) {
      console.error("Error submitting specifications:", error);
      throw error; // Properly propagate the error
    }
  };

  // Submit form
  // const submitSpecKeyTranslation = async (
  //   productId: number,
  //   specifications: SpecKeyTranslation[]
  // ): Promise<any> => {
  //   try {
  //     // Prepare the payload with productId, specifications, and apiUrl
  //     const payload = {
  //       productId,
  //       specifications,
  //       apiUrl: "transspecifications",
  //     };

  //     // Send the request to the backend
  //     const response = await fetch("/api/post", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(payload), // Send payload including apiUrl
  //     });

  //     // Check if the response is successful
  //     if (!response.ok) {
  //       throw new Error("Failed to submit specifications");
  //     }

  //     // Return the JSON response if the request was successful
  //     return await response.json();
  //   } catch (error) {
  //     console.error("Error submitting specifications:", error);
  //     throw error; // Properly propagate the error
  //   }
  // };

  const submitSpecificationsKeys = async (
    productId: number,
    specifications: SpecificationInt[]
  ): Promise<ApiResponse> => {
    console.log("=== DEBUGGING SUBMISSION ===");
    console.log(
      "Raw input specifications:",
      JSON.stringify(specifications, null, 2)
    );
    console.log("Product ID:", productId);

    if (!apiUrl) {
      return {
        success: false,
        error: "API URL is not defined in environment variables",
      };
    }

    try {
      // Check if specifications array is empty or invalid
      if (!specifications || specifications.length === 0) {
        console.error("No specifications provided");
        return {
          success: false,
          error: "No specifications to submit",
        };
      }

      // Start with real form data but enhanced validation and transformation
      const validSpecs = [];

      for (let index = 0; index < specifications.length; index++) {
        const spec = specifications[index];
        console.log(`Processing spec ${index}:`, {
          raw: spec,
          id: spec.id,
          specification_key_id: spec.specification_key_id,
          value: spec.value,
          types: {
            id: typeof spec.id,
            specification_key_id: typeof spec.specification_key_id,
            value: typeof spec.value,
          },
        });

        // Check for invalid specification_key_id
        let specKeyId = spec.specification_key_id;
        if (specKeyId === null || specKeyId === undefined || specKeyId === "") {
          console.warn(`Skipping spec ${index}: no specification_key_id`);
          continue;
        }

        if (typeof specKeyId === "string") {
          specKeyId = parseInt(specKeyId, 10);
          if (isNaN(specKeyId)) {
            console.warn(
              `Skipping spec ${index}: invalid specification_key_id "${spec.specification_key_id}"`
            );
            continue;
          }
        }

        // Check for empty values
        if (!spec.value || spec.value.toString().trim() === "") {
          console.warn(`Skipping spec ${index}: empty value`);
          continue;
        }

        const result: {
          id?: number;
          product_id: number;
          specification_key_id: number;
          value: string;
        } = {
          product_id: Number(productId), // Ensure it's a number
          specification_key_id: Number(specKeyId), // Ensure it's a number
          value: spec.value.toString().trim(),
        };

        // Only add ID if it exists and is not 0
        if (spec.id && spec.id > 0) {
          result.id = Number(spec.id); // Ensure it's a number
        }

        console.log(`Valid spec ${index}:`, result);
        validSpecs.push(result);
      }

      const realPayload = {
        specifications: validSpecs,
      };

      // Double-check the payload structure before sending
      if (
        !realPayload.specifications ||
        !Array.isArray(realPayload.specifications)
      ) {
        console.error(
          "Invalid payload structure - specifications should be an array"
        );
        return {
          success: false,
          error:
            "Invalid payload structure - specifications should be an array",
        };
      }

      // Check if we have any valid specifications
      if (realPayload.specifications.length === 0) {
        console.error("No valid specifications to submit");
        return {
          success: false,
          error: "All specifications have invalid or empty data",
        };
      }

      const response = await fetchApi(apiEndpoints.buckSpecUpdate, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: realPayload,
      });

      console.log("Success response:", response);

      return {
        success: true,
        data: response,
      };
    } catch (error) {
      console.error("Catch error:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  };

  // Submit translated values only (simplified version)
  const submitSpecTranslationValues = async (
    productId: number,
    specifications: SpecKeyTranslation[]
  ): Promise<ApiResponse> => {
    console.log("=== SUBMITTING SPEC TRANSLATION VALUES ===");
    console.log("Product ID:", productId);
    console.log("Specifications:", JSON.stringify(specifications, null, 2));

    if (!apiUrl) {
      return {
        success: false,
        error: "API URL is not defined in environment variables",
      };
    }

    try {
      if (!specifications || specifications.length === 0) {
        return {
          success: false,
          error: "No specifications to submit",
        };
      }

      // Transform to simpler payload structure
      const validSpecs = specifications
        .filter((spec) => spec.id && spec.locale && spec.translated_value)
        .map((spec) => ({
          id: Number(spec.id),
          locale: spec.locale,
          translated_value: spec.translated_value,
        }));

      if (validSpecs.length === 0) {
        return {
          success: false,
          error: "No valid specifications with translated values",
        };
      }

      const payload = {
        productId: Number(productId),
        specifications: validSpecs,
      };

      console.log("Sending payload:", JSON.stringify(payload, null, 2));

      const response = await fetchApi(
        apiEndpoints.updateSpecTranslationValues,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: payload,
        }
      );

      console.log("Success response:", response);

      return {
        success: true,
        data: response,
      };
    } catch (error) {
      console.error("Error submitting specification values:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  };

  // Submit form (original version for backwards compatibility)
  const submitSpecKeyTranslation = async (
    productId: number,
    specifications: SpecKeyTranslation[]
  ): Promise<ApiResponse> => {
    console.log("=== DEBUGGING SPEC TRANSLATION SUBMISSION ===");
    console.log(
      "Raw input specifications:",
      JSON.stringify(specifications, null, 2)
    );
    console.log("Product ID:", productId);

    if (!apiUrl) {
      return {
        success: false,
        error: "API URL is not defined in environment variables",
      };
    }

    try {
      // Check if specifications array is empty or invalid
      if (!specifications || specifications.length === 0) {
        console.error("No specifications provided");
        return {
          success: false,
          error: "No specifications to submit",
        };
      }

      // Transform the specifications to match Go API format
      const validSpecs = [];

      for (let index = 0; index < specifications.length; index++) {
        const spec = specifications[index];
        console.log(`Processing spec ${index}:`, {
          raw: spec,
          id: spec.id,
          specification_key_id: spec.specification_key_id,
          locale: spec.locale,
          translated_value: spec.translated_value,
        });

        // Check for required fields
        if (
          !spec.id || // Use spec.id instead of specification_key_id
          !spec.locale ||
          !spec.translated_value
        ) {
          console.warn(`Skipping spec ${index}: missing required fields`);
          continue;
        }

        const result = {
          id: Number(spec.id), // Use the actual specification ID
          locale: spec.locale,
          translated_key: spec.translated_key || "",
          translated_value: spec.translated_value,
        };

        console.log(`Valid spec ${index}:`, result);
        validSpecs.push(result);
      }

      const payload = {
        productId: Number(productId),
        specifications: validSpecs,
      };

      console.log("Final payload:", JSON.stringify(payload, null, 2));
      console.log("API URL:", apiUrl);
      console.log("Full endpoint:", `${apiUrl}/spec_translation`);

      // Check if we have any valid specifications
      if (payload.specifications.length === 0) {
        console.error("No valid specifications to submit");
        return {
          success: false,
          error: "All specifications have invalid or empty data",
        };
      }

      const response = await fetchApi(apiEndpoints.createSpecTranslation, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: payload,
      });

      console.log("Success response:", response);

      return {
        success: true,
        data: response,
      };
    } catch (error) {
      console.error("Error submitting specifications:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  };

  const getPublicSpecs = async (productId: number, locale: string) => {
    const apiEndpoint = `get-public-spec/${productId}?locale=${locale}`;
    if (!apiUrl) {
      return Promise.reject(
        new Error("API URL is not defined in environment variables")
      );
    }

    const fullUrl = `${apiUrl}/${apiEndpoint}`;

    try {
      const response = await fetch(fullUrl); // Adjust API endpoint
      const dataset = await response.json();

      return {
        success: true,
        ...dataset,
      };
    } catch (error) {
      console.error("Error fetching category:", error);
      return { success: false, data: [] };
    }
  };

  return {
    getPublicSpecs,
    getSpecificationsKeys,
    getSpecTranslations,
    submitSpecifications,
    getSpecifications,
    submitSpecKeyTranslation,
    submitSpecTranslationValues,
    getFormSpecifications,
    getSpecificationsByCategory,
    submitSpecificationsKeys,
  };
};
