
import getErrors from '@/app/components/Form/validation';
import { apiEndpoints } from '@/lib/constants';
import fetchApi from '@/lib/fetchApi';
import { setAccessTokenCookie } from '@/lib/utils';
import { useRouter } from "next/navigation";
import { useState } from "react";


interface FormData {
  [key: string]: string; // Define the type of form data fields
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  refresh_token: string;
  email: string;
  type: string;
}
interface FormErrors {
  [key: string]: string[]; // Allow arrays of strings for each error field
}
export const LoginForm = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({ email: "", password: "" });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);


  const validationConfig = {
    email: { required: true, email: true },
    password: { required: true, minLength: 6 },
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
      setIsLoading(true);
      setError(null);

      const requestBody = {
        email: formData.email,
        password: formData.password
      };


      try {
        const response = await fetchApi(apiEndpoints.login, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: requestBody,
          signal: 15000, // 15 second timeout for login
        });

        if (response.success) {
          setError(null);
          // Store the tokens and user info
          const loginData = response.data as LoginResponse;
          localStorage.setItem('token', loginData.token);
          localStorage.setItem('refresh_token', loginData.refresh_token);
          localStorage.setItem('email', loginData.email);
          localStorage.setItem('userType', loginData.type);

          // Also set the token as a cookie for API routes
          setAccessTokenCookie(loginData.token);

          router.push("/admin");
        } else {
          setError(response.error || "Login failed.");
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          if (error.name === 'AbortError') {
            setError("Request timed out. Please check your connection and try again.");
          } else if (error.message.includes('fetch')) {
            setError("Network error. Please check your internet connection.");
          } else {
            setError(`Login failed: ${error.message}`);
          }
        } else {
          setError("An unknown error occurred. Please try again.");
        }
      } finally {
        setIsLoading(false);
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
          disabled={isLoading}
          className="w-full px-4 py-2 font-medium text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Signing in..." : "Signin"}
        </button>
      </div>
    </form>
  );
};