"use client";
import { apiEndpoints } from "@/lib/constants";
import fetchApi from "@/lib/fetchApi";

interface loginInt {
  email: string;
  password: string;
}
export const useUsers = () => {
  const searchUsers = async (keyword: string) => {
    if (!keyword) {
      return;
    }

    try {
      const dataset = await fetchApi(
        `${apiEndpoints.searchUsersApi}?keyword=${keyword}`
      );
      return dataset;
    } catch (error) {
      console.error("Error fetching campaigns:", error);
    }
  };

  const addClient = async (name: number | null, email: string) => {
    try {
      const payload = {
        name: "test title",
        email: email,
      };
      const response = await fetchApi(apiEndpoints.users, {
        method: "POST",
        body: JSON.stringify(payload),
      });
      return response;
    } catch (error) {
      console.error("Error adding campaign:", error);
    }
  };

  const logoutUser = async () => {
    try {
      await fetchApi(apiEndpoints.logout, {
        method: "POST",
      });
      return { success: true };
    } catch (error) {
      console.error("Error adding campaign:", error);
    }
  };

  const loginUser = async ({ email, password }: loginInt) => {
    const payload = {
      email: email,
      password: password,
    };

    try {
      const response = await fetchApi(apiEndpoints.login, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      return response;
    } catch (error: unknown) {
      console.error("Error logging in:", error);
    }
  };

  return { addClient, searchUsers, loginUser, logoutUser };
};
