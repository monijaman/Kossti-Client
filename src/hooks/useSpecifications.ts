const cacheBuster = new Date().getTime(); // Cache-busting parameter
const apiUrl = process.env.NEXT_PUBLIC_API_URL + "/api/v1";
import {
  SpecificationInt,
  SpecificationKey,
  SpecKeyTranslation,
} from "@/lib/types"; // Assuming you have a Product type

export const useSpecifications = () => {
  const getSpecificationsKeys = async (serachTem = "") => {
    const apiEndpoint = `specificationsearch?searchTerm=${serachTem}`;

    if (!apiUrl) {
      return Promise.reject(
        new Error("API URL is not defined in environment variables")
      );
    }

    const fullUrl = `${apiUrl}/${apiEndpoint}`;

    try {
      const response = await fetch(fullUrl); // Adjust API endpoint
      const dataset = await response.json();
      // console.log("Fetching category URL:-", dataset); // Ensure this URL is correct

      return {
        success: true,
        data: dataset.specifications,
      };
    } catch (error) {
      console.error("Error fetching category:", error);
      return { success: false, data: [] };
    }
  };

  const getSpecifications = async (id: number) => {
    const apiEndpoint = `get-specifications/${id}`;

    if (!apiUrl) {
      return Promise.reject(
        new Error("API URL is not defined in environment variables")
      );
    }

    const fullUrl = `${apiUrl}/${apiEndpoint}`;

    try {
      const response = await fetch(fullUrl); // Adjust API endpoint
      const dataset = await response.json();
      // console.log("Fetching getSpecifications URL:-", dataset); // Ensure this URL is correct

      return {
        success: true,
        ...dataset,
      };
    } catch (error) {
      console.error("Error fetching category:", error);
      return { success: false, data: [] };
    }
  };

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
      // console.log("Fetching getSpecifications URL:-", dataset); // Ensure this URL is correct

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

    let apiEndpoint = `?action=formgenerator/${id}`;
    try {
      const response = await fetch(`/api/get${apiEndpoint}`); // Adjust API endpoint
      const dataset = await response.json();
      return dataset.data;
    } catch (error) {
      console.error("Error fetching campaigns:", error);
    }
  };
  const getSpecTranslations = async (id: number, locale: string) => {
    if (!id) {
      return;
    }

    let apiEndpoint = `?action=spec_translation/${id}&locale=${locale}`;

    try {
      const response = await fetch(`/api/get${apiEndpoint}`, {
        cache: "no-store",
      }); // Adjust API endpoint
      const dataset = await response.json();

      return dataset.data;
    } catch (error) {
      console.error("Error fetching campaigns:", error);
    }
  };

  // Submit form
  const submitSpecifications = async (
    categoryId: number,
    specifications: SpecificationKey[]
  ): Promise<any> => {
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
  ): Promise<any> => {
    try {
      // Prepare the payload with productId, specifications, and apiUrl
      const payload = {
        productId,
        specifications,
        apiUrl: "specifications",
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
  const submitSpecKeyTranslation = async (
    productId: number,
    specifications: SpecKeyTranslation[]
  ): Promise<any> => {
    try {
      // Prepare the payload with productId, specifications, and apiUrl
      const payload = {
        productId,
        specifications,
        apiUrl: "spec_translation",
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
    getFormSpecifications,
    getSpecificationsByCategory,
    submitSpecificationsKeys,
  };
};
