"use client";

interface loginInt {
  email: string;
  password: string;
}
export const useUsers = () => {
  const formData = {
    apiUrl: "",
    id: "",
    name: "",
    email: "",
  };

  const searchUsers = async (keyword: string) => {
    if (!keyword) {
      return;
    }

    const apiEndpoint = `?action=search-users&keyword=${keyword}`;
    try {
      const response = await fetch(`/api/get${apiEndpoint}`); // Adjust API endpoint
      const dataset = await response.json();
      return dataset;
    } catch (error) {
      console.error("Error fetching campaigns:", error);
    }
  };

  const addClient = async (name: number | null, email: string) => {
    try {
      const newFormData = {
        ...formData,
        name: "test title",
        email: email,
        apiUrl: `clients`,
      };
      const response = await fetch("/api/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newFormData),
      });
      if (!response.ok) {
        throw new Error("Failed to add campaign");
      }
    } catch (error) {
      console.error("Error adding campaign:", error);
    }
  };

  const logoutUser = async () => {
    try {
      const response = await fetch("/api/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to add campaign");
      }
      return { success: true };
    } catch (error) {
      console.error("Error adding campaign:", error);
    }
  };

  const loginUser = async ({ email, password }: loginInt) => {
    const newFormData = {
      ...formData,
      email: email,
      password: password,
      apiUrl: `login`,
    };

    try {
      const response = await fetch("/api/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newFormData),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const resJson = await response.json();

      return resJson;
    } catch (error: unknown) {
      console.error("Error logging in:", error);
    }
  };

  return { addClient, searchUsers, loginUser, logoutUser };
};
