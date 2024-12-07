const cacheBuster = new Date().getTime(); // Cache-busting parameter
const apiUrl = process.env.NEXT_PUBLIC_API_URL + "/api/v1";

export const useCategory = () => {
  // get all categories
  const getCategory = async () => {
    const apiEndpoint = `categories`;

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
        data: dataset,
      };
    } catch (error) {
      console.error("Error fetching category:", error);
      return { success: false, data: [] };
    }
  };

  // get all categories
  const getCategories = async ({
    perPage = "",
    search = "",
    paginate = "false",
    locale = "en",
    categoryId = "",
    status = null,
    page = null,
  }: {
    perPage?: number | string;
    search?: string;
    paginate?: "true" | "false";
    locale?: string;
    categoryId?: number | string;
    status?: number | null;
    page?: number | null;
  }) => {
    // Construct query parameters dynamically
    const queryParams = new URLSearchParams({
      per_page: perPage.toString(),
      search,
      paginate,
      locale,
      category_id: categoryId.toString(),
    });

    queryParams.append("status", status !== null ? status.toString() : "");
    queryParams.append("page", page !== null ? page.toString() : "");

    if (!apiUrl) {
      return Promise.reject(
        new Error("API URL is not defined in environment variables")
      );
    }

    // Construct the full URL with the query string
    const fullUrl = `${apiUrl}/wide-categories?${queryParams.toString()}`;

    try {
      const response = await fetch(fullUrl);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const dataset = await response.json();

      return {
        success: true,
        data: dataset,
      };
    } catch (error) {
      console.error("Error fetching category:", error);
      return { success: false, data: [] };
    }
  };

  const getCategoriess = async ({
    perPage = 10,
    searchTerm = "",
    paginate = false,
    page = 1,
    locale = "en",
  } = {}) => {
    // Construct query parameters
    const params = new URLSearchParams({
      action: "wide-categories",
      search: searchTerm,
      per_page: perPage.toString(),
      paginate: paginate.toString(),
      page: page.toString(),
      locale: page.toString(),
    });

    // const fullUrl = `${apiUrl}/${apiEndpoint}`;

    // Define the API endpoint
    const apiEndpoint = `${apiUrl}/api/get?${params.toString()}`;
    try {
      // Fetch data with 'no-store' cache policy to avoid cached responses
      const response = await fetch(apiEndpoint, { cache: "no-store" });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Parse and return JSON response data
      const dataset = await response.json();
      return dataset.data;
    } catch (error) {
      console.error("Error fetching specification keys:", error);
      return null; // Return null in case of an error
    }
  };

  const submitCategory = async ({
    categoryId = null,
    category,
  }: {
    categoryId?: number | null;
    category: string;
  }): Promise<any> => {
    try {
      // Prepare the payload with productId, specificationKey, and apiUrl
      const payload = {
        id: categoryId, // Consistent naming with snake_case
        name: category,
        apiUrl: "categories",
      };

      // Send the request to the backend
      const response = await fetch("/api/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      // Return the JSON response
      const dataset = await response.json();
      console.log("dataset", dataset);
      return dataset;
    } catch (error) {
      // console.error("Error submitting specifications:", error);
      // throw error; // Properly propagate the error
    }
  };

  const getCategoryById = async (id: number) => {
    const apiEndpoint = `?action=categories/${id}`;

    try {
      const response = await fetch(`/api/get${apiEndpoint}`); // Adjust API endpoint

      const dataset = await response.json();

      return dataset;
    } catch (error) {
      console.error("Error fetching campaigns:", error);
    }
  };

  const getCategoryTranslationById = async ({
    category_id = 0,
    locale = "",
  } = {}) => {
    const params = new URLSearchParams({
      action: `category-translation/${category_id}`,
      locale,
    });

    // Define the API endpoint
    const apiEndpoint = `/api/get?${params.toString()}`;

    try {
      const response = await fetch(apiEndpoint); // Adjust API endpoint

      const dataset = await response.json();

      return dataset.data;
    } catch (error) {
      console.error("Error fetching campaigns:", error);
    }
  };

  const submitKeysTranslation = async ({
    locale = "bn",
    categoryId = 0,
    category,
  }: {
    locale: string;
    categoryId?: number | null;
    category: string;
  }): Promise<any> => {
    try {
      // Prepare the payload with consistent naming
      const payload = {
        category_id: categoryId, // Use speckeyId as the identifier
        name: category, // Ensure this matches the key you expect on the server
        locale,
        apiUrl: "category-translation",
      };

      // Send the request to the backend
      const response = await fetch("/api/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // Return the JSON response
      return await response.json();
    } catch (error) {
      console.error("Error submitting specifications:", error);
      throw error; // Properly propagate the error
    }
  };

  // get all categories
  const getCategoryRelBrands = async (options: {
    category_id: number;
    locale?: string;
  }) => {
    const { category_id, locale } = options;

    // Ensure the API URL is defined
    if (!apiUrl) {
      return Promise.reject(
        new Error("API URL is not defined in environment variables")
      );
    }

    // Build query string based on optional parameters
    const queryParams = new URLSearchParams();
    if (category_id !== undefined) {
      queryParams.append("category_id", category_id.toString());
    }
    if (locale) {
      queryParams.append("locale", locale);
    }

    // Construct the full URL with query parameters
    const apiEndpoint = `category-brands`;
    const fullUrl = `${apiUrl}/${apiEndpoint}?${queryParams.toString()}`;
    try {
      // Fetch data from the API
      const response = await fetch(fullUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Check if the response is successful
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
      }

      // Parse the JSON data
      const dataset = await response.json();

      // Return success with data
      return {
        success: true,
        data: dataset,
      };
    } catch (error: any) {
      // Log any errors and return failure
      console.error("Error fetching category:", error);
      return {
        success: false,
        data: [],
        error: error.message || "An unknown error occurred",
      };
    }
  };

  const categoryStatUpdate = async ({
    category_id,
    status,
  }: {
    category_id: number;
    status: number;
  }): Promise<any> => {
    try {
      // Prepare the payload with consistent naming
      const payload = {
        status: status, // Use speckeyId as the identifier
        apiUrl: `category-status/${category_id}`,
      };

      // Send the request to the backend
      const response = await fetch("/api/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // Return the JSON response
      return await response.json();
    } catch (error) {
      console.error("Error submitting specifications:", error);
      throw error; // Properly propagate the error
    }
  };

  return {
    getCategory,
    getCategories,
    submitCategory,
    getCategoryById,
    getCategoryTranslationById,
    submitKeysTranslation,
    getCategoryRelBrands,
    categoryStatUpdate,
  };
};
