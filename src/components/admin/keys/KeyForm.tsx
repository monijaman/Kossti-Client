"use client";
import useSpecificationsKeys from '@/hooks/useSpecificationsKeys';
import { SpecificationKey } from '@/lib/types';
import { useEffect, useState } from 'react';
import { SubmitSpecResponse } from '@/lib/types';
interface PageProps {
    speckeyData?: SpecificationKey; // Optional for create case

}

const KeyForm = ({ speckeyData }: PageProps) => {

    const [speckey, setSpeckey] = useState('');
    const [speckeyId, setSpeckeyID] = useState<number | null>(null);

    const [submitStatus, setSubmitStatus] = useState('');
    const [loading, setLoading] = useState(false);

    const { submitSpecificationsKeys } = useSpecificationsKeys();
 
    useEffect(() => {
        setSpeckey(speckeyData?.specification_key || ''); // Fallback to empty string
        setSpeckeyID(speckeyData?.id || null); // Fallback to null
    }, [speckeyData]);



    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true)

        try {
            setSubmitStatus('')

            // Update existing product
            const response = await submitSpecificationsKeys({ speckeyId, speckey }) as SubmitSpecResponse;

            if (response.success) {
                setSubmitStatus(response?.data?.message ?? '');
                setLoading(false)
            } else {
                setLoading(false)
                setSubmitStatus(response?.error ?? '');
            }
        } catch (error) {
            console.error('Error submitting form', error);
            setSubmitStatus('Error submitting the form');
        } finally {
            setLoading(false);
        }

    };

    return (
        <form onSubmit={handleSubmit} className="rounded px-8 pt-6 pb-8 mb-4">
            {/* Product Name */}
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                    Key  Name {speckey}
                </label>
                <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="specification_key"
                    type="text"
                    placeholder="Enter product name"
                    value={speckey && speckey}
                    onChange={(e) => setSpeckey(e.target.value)}
                    required
                />
            </div>



            {/* Submit Button */}
            <div className="flex items-center justify-between">
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="submit"
                    disabled={loading}
                >
                    {loading ? 'Submitting...' : speckeyId ? 'Update Product' : 'Create Product'}
                </button>
            </div>

            {/* Submission Status */}
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
        </form>
    );
};

export default KeyForm;
