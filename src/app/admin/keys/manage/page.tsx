'use client'
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import useSpecificationsKeys from '@/hooks/useSpecificationsKeys';

export default function CreateSpecification() {
    const [productId, setProductId] = useState('');
    const [specificationKeyId, setSpecificationKeyId] = useState('');
    const [specKey, setSpecKey] = useState('');
    const [submitStatus, setSubmitStatus] = useState('');
    const router = useRouter();
    const { submitSpecificationsKeys } = useSpecificationsKeys();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const response = await submitSpecificationsKeys(specKey);

        if (response.success) {
            router.push(`/keys/manage/${response.data.id}`); // Redirect to the list page
            
        }

        if (response.error) {
            setSubmitStatus(response.error)
        }

        console.log(response)

    };

    return (
        <div className="bg-gray-100 border border-gray-300 rounded-lg shadow-md max-w-md mx-auto p-6 mt-8">
            <h1 className="text-2xl font-bold text-gray-700 mb-4">Create a New Specification</h1>
            <form onSubmit={handleSubmit} className="space-y-4">

                <div className="flex flex-col">
                    <label className="text-gray-600 font-medium mb-2">Value</label>
                    <input
                        type="text"
                        value={specKey}
                        onChange={(e) => setSpecKey(e.target.value)}
                        required
                        className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <button
                    type="submit"
                    className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300 w-full">
                    Create
                </button>
            </form>

            {submitStatus && (
                <div
                    className={`p-4 mt-4 text-sm rounded-lg ${submitStatus.includes('successfully')
                            ? 'text-green-700 bg-green-100'
                            : 'text-red-700 bg-red-100'
                        }`}
                    role="alert"
                >
                    {submitStatus}
                </div>
            )}

        </div>

    );
}
