'use client'
import getErrors from '@/app/components/Form/validation';
import { apiEndpoints } from '@/lib/constants';
import fetchApi from '@/lib/fetchApi';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
type ErrorResponse = {
  message: string;
  code?: number;
};

// interface ErrorResponse {
//   name?: string[];
//   email?: string[];
//   password?: string[];
//   message?: string;
//   // Add other error fields as needed
// }

interface FormData {
  [key: string]: string; // Index signature allowing access to any string property
  username: string;
  email: string;
  password: string;
  password_confirmation: string;
  avatar: string;
}
interface FormErrors {
  [key: string]: string[]; // Allow arrays of strings for each error field
}

export const RegisterForm = () => {

  const router = useRouter();
  const [errors, setErrors] = useState<ErrorResponse | null>(null);

  const [formData, setFormData] = useState<FormData>({
    username: "",
    email: "",
    password: "",
    password_confirmation: "",
    avatar: "",
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const validationConfig = {
    username: { required: true },
    email: { required: true, email: true },
    password: { required: true, minLength: 8 },
    password_confirmation: { required: true, passwordConfirmation: true },
  };



  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const errors = getErrors(formData, validationConfig);
    setFormErrors(errors);
    if (Object.keys(errors).length === 0) {

      setSubmitted(true);
      register();
    }

  };


  const register = async () => {
    // Check if window object is defined (client-side check)
    if (typeof window !== "undefined") {


      const requestBody = {
        username: formData.username,
        email: formData.email,
        password: formData.password
      };

      try {

        const res = await fetchApi(apiEndpoints.register, {
          method: "POST",
          body: requestBody,
        });

        // fetchApi returns parsed JSON response directly
        if (res.success) {
          setSubmitted(false);
          router.push('/signin');
          setErrors({ message: "Registration successful! You can now sign in." });
        } else {
          // Check if the error field exists in the response data
          if (
            res.error &&
            Array.isArray(res.error) &&
            res.error.length > 0
          ) {
            // Extract and set the first error message
            const errorMessage = res.error[0];
            setErrors(errorMessage);
          } else {
            // Handle other types of errors or messages
            setErrors({ message: res.error || "An error occurred during registration." });
          }
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          setErrors({ message: error.message });
        } else {
          setErrors({ message: "An unknown error occurred." });
          console.error("An unknown error occurred:", errors);
        }
      }


    }
  }



  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto bg-white p-6 rounded-lg">
        <div className="space-y-2">
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">
            Username
          </label>
          <input
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            autoComplete="username"
            value={formData.username}
            onChange={handleChange}
            id="username"
            name="username"
          />

          {formErrors.username && formErrors.username.map((err, index) => (
            <span key={index} className="text-sm text-red-600">{err}</span>
          ))}



        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            value={formData.email}
            onChange={handleChange}
            autoComplete="email"
            id="email"
            name="email"
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

        <div className="space-y-2">
          <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700">
            Confirm Password
          </label>
          <input
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            value={formData.password_confirmation}
            onChange={handleChange}
            id="password_confirmation"
            name="password_confirmation"
            type="password"
          />
          {formErrors.password_confirmation && formErrors.password_confirmation.map((err, index) => (
            <span key={index} className="text-sm text-red-600">{err}</span>
          ))}

        </div>


        <div className="pt-4">
          <button
            type="submit"
            className="w-full px-4 py-2 font-medium text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {submitted ? "Register" : "Submitting"}

          </button>
        </div>
      </form>
    </>
  );
};
