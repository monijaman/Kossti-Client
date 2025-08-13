"use client";
import { useBrands } from '@/hooks/useBrands';

import { Brand } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
interface PageProps {
    brandData?: Brand; // Optional for create case

}

const BrandForm = ({ brandData }: PageProps) => {
    const [brand, setBrand] = useState('');
    const [brandId, setBrandId] = useState<number | null>(null);
    const router = useRouter();
    const [submitStatus, setSubmitStatus] = useState('');
    const [loading, setLoading] = useState(false);


    const { addNewBrand } = useBrands();

    useEffect(() => {
        setBrand(brandData?.name || ''); // Fallback to empty string
        setBrandId(brandData?.id || null); // Fallback to null
    }, [brandData]);



    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true)

        try {
            setSubmitStatus('')

            // Update existing product
            const response = await addNewBrand({ brand, brandId });


            if (response.success && response.data) {
                router.push(`/admin/brand`);
                setSubmitStatus(response.data.message);
            } else {
                setSubmitStatus(response.error || "Failed to add brand");
            }

            setLoading(false);

        } catch (error) {
            console.error('Error submitting form', error);
            setSubmitStatus('Error submitting the form');
        } finally {
            setLoading(false);
        }

    };

    return (
        <form onSubmit={handleSubmit} className="rounded px-8 pt-6 pb-8 mb-4">
            {/* Brand Name */}
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                    Brand  Name {brand}
                </label>
                <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="specification_key"
                    type="text"
                    placeholder="Enter product name"
                    value={brand && brand}
                    onChange={(e) => setBrand(e.target.value)}
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
                    {loading ? 'Submitting...' : brandId ? 'Update Brand' : 'Create Brand'}
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

export default BrandForm;
