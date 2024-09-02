import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import Input from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUsers } from "@/hooks/useUsers";
import { useState } from "react";
import { useRouter } from "next/navigation";


interface FormData {
  [key: string]: string; // Define the type of form data fields
}

export const LoginForm = () => {
  const router = useRouter();

  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };
  const { loginUser } = useUsers();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if window object is defined (client-side check)
    if (typeof window !== "undefined") {
      const formDataToSend = new FormData();

      // Type assertion to inform TypeScript that the keys are strings
      for (const key in formData) {
        if (Object.prototype.hasOwnProperty.call(formData, key)) {
          formDataToSend.append(key, formData[key as keyof typeof formData]);
          // Using "as keyof typeof formData" to ensure only valid keys are used
        }
      }

      try {
        const response = await fetch("/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const resJson = await response.json();

        // Process resJson based on your application logic

        if (response.ok && resJson.success) {
          //const userData = await resJson.json();
          setError(null);

          const userData = resJson.dataset;
          localStorage.setItem('userName', userData.username);
          localStorage.setItem('avatar', userData.avatar);

          router.push("/dashboard");
        } else {
          setError(resJson.message[0]);
        }
      } catch (error: any) {
        setError(error?.message);
      }

      /*   try {
        const response = await loginUser(formData);

        if (!response) {
          throw new Error("No response from loginUser");
        }

        if (response.success) {
          setError(null);
        //  window.location.replace("/dashboard")
          router.push("/dashboard");
        } else {
          const errorMessages = Array.isArray(response.error)
            ? response.error.flat().join(" ")
            : response.error;

          setError(errorMessages);
        }
      } catch (error: any) {
        throw new Error("No response from loginUser");
      } */
    }
  };

  return (
    <>
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
            value={formData.email}
            onChange={handleChange}
            id="email"
            name="email"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
            value={formData.password}
            onChange={handleChange}
            id="password"
            name="password"
            type="password"
          />
        </div>

        {error && (
          <div className="text-red-600 text-sm">
            <span>{error}</span>
          </div>
        )}

        <div className="pt-4">
          <button
            type="submit"
            className="w-full px-4 py-2 font-medium text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Signin
          </button>
        </div>
      </form>

    </>
  );
};
