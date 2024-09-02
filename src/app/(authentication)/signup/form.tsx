'use client'
import styles from './style.module.scss';
import { Alert } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import Input from '@/components/ui/input';
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'

import { useState } from 'react'
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

interface ErrorResponse {
  name?: string[];
  email?: string[];
  password?: string[];
  message?: string;
  // Add other error fields as needed
}

interface FormData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  avatar: string;
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

  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const getErrors = (): string[] => [
    'name',
    'email',
    'password',
    'password_confirmation' 
  ].filter((k) => {
    if (!formData[k as keyof FormData]) {
      return true;
    } else if (k === 'email') {
      return !/\S+@\S+\.\S+/.test(formData.email);
    } else if (k === 'phoneNumber') {
      return !/^\+?\d{8,11}$/.test(formData[k as keyof FormData]?.replace(/\s/g, ''));
    } else if (k === 'password_confirmation') {

      return formData.password !== formData.password_confirmation
    }
    return false;
  });

  const errors = submitted ? getErrors() : [];

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);

    if (!getErrors().length) {
     console.log('hellow')
      
    }
   
  };

  const requiredMessage = (name: string, text: string) => {
    return (
      errors.includes(name) && (
        <div className="error flex items-center bg-nsw-red-04">

          <div className="nsw-in-page-alert__content">
            <p>
              <strong>{text} is required</strong>
            </p>
          </div>
        </div>
      )
    )
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

          <span className="text-sm text-red-600">{requiredMessage('name', 'username')}</span>


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

          <span className="text-sm text-red-600">{requiredMessage('email', 'Email')}</span>

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

          <span className="text-sm text-red-600">{requiredMessage('password', 'password')}</span>

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
          <span className="text-sm text-red-600">{requiredMessage('password_confirmation', 'Password Confirmation')}</span>

        </div>

        <div className="pt-4">
          <button
            type="submit"
            className="w-full px-4 py-2 font-medium text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Register
          </button>
        </div>
      </form>
    </>
  );
};
