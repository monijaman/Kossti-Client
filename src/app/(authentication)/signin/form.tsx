import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import Input from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUsers } from "@/hooks/useUsers";
import { useState } from "react";
import { useRouter } from "next/navigation";
import getErrors from '@/components/Form/validation';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;


interface FormData {
  [key: string]: string; // Define the type of form data fields
}
interface FormErrors {
  [key: string]: string[]; // Allow arrays of strings for each error field
}
export const LoginForm = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({ email: "", password: "" });
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const { loginUser } = useUsers();

  const validationConfig = {
    email: { required: true, email: true },
    password: { required: true, minLength: 8 },
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors = getErrors(formData, validationConfig);
    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      try {
        const response = await fetch("/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        
        const resJson = await response.json();
      

        if (!resJson.success) {
          setError(resJson.error || "An unexpected error occurred.");
        } else if (resJson.success) {
          console.log('resJson.success', resJson.success)
          setError(null);
          localStorage.setItem('userName', resJson.dataset.username);
          localStorage.setItem('avatar', resJson.dataset.avatar);
          localStorage.setItem('email', resJson.dataset.email);
          console.log('Navigating to dashboard...');
      
          router.push("/");
        } else {
          setError(resJson.error || "Login failed.");
        }
      } catch (error: any) {
        setError(error.message || "An error occurred.");
      }
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          value={formData.email}
          onChange={handleChange}
          id="email"
          name="email"
          type="email"
        />
        {formErrors.email && formErrors.email.map((err, index) => (
          <span key={index} className="text-sm text-red-600">{err}</span>
        ))}
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          value={formData.password}
          onChange={handleChange}
          id="password"
          name="password"
          type="password"
        />
        {formErrors.password && formErrors.password.map((err, index) => (
          <span key={index} className="text-sm text-red-600">{err}</span>
        ))}
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
  );
};