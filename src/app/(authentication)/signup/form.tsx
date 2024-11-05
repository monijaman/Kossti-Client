'use client'
import getErrors from '@/components/Form/validation';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

interface ErrorResponse {
  name?: string[];
  email?: string[];
  password?: string[];
  message?: string;
  // Add other error fields as needed
}

interface FormData {
  [key: string]: string; // Index signature allowing access to any string property
  name: string;
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
  const [error, setError] = useState<ErrorResponse | null>(null);

  const [formData, setFormData] = useState<FormData>({
    name: "",
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
    name: { required: true },
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


      const formDataToSend = new FormData();

      // Type assertion to inform TypeScript that the keys are strings
      for (const key in formData) {
        if (Object.prototype.hasOwnProperty.call(formData, key)) {
          formDataToSend.append(key, formData[key as keyof typeof formData]);
          // Using "as keyof typeof formData" to ensure only valid keys are used
        }
      }

      try {

        const res = await fetch(`${apiUrl}/api/v1/registration`, {
          method: "POST",
          body: formDataToSend,
          // Do not set Content-Type header for FormData
        });


        if (res.ok) {
          const userData = await res.json();
          setSubmitted(false);

          router.push("/signin");
        } else {
          const responseData = await res.json();
          // Check if the error field exists in the response data
          if (
            responseData.error &&
            Array.isArray(responseData.error) &&
            responseData.error.length > 0
          ) {
            // Extract and set the first error message
            const errorMessage = responseData.error[0];
            // console.log(responseData.error[0])
            setError(errorMessage);
            // console.log(errorMessage.email[0])
          } else {
            // Handle other types of errors or messages
            setError({ message: "An error occurred during registration." });
          }
        }
      } catch (error: any) {
        setError(error?.message);
      }

    }
  }



  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto bg-white p-6 rounded-lg">
        <div className="space-y-2">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            autoComplete="name"
            value={formData.name}
            onChange={handleChange}
            id="name"
            name="name"
          />

          {formErrors.name && formErrors.name.map((err, index) => (
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
