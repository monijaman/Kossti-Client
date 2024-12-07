"use client";
import { useCategory } from '@/hooks/useCategory';
import { Category } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
interface PageProps {
    categoryData?: Category; // Optional for create case

}

const CategoryForm = ({ categoryData }: PageProps) => {
    const [category, setCategory] = useState('');
    const [categoryId, setCategoryId] = useState<number | null>(null);
    const router = useRouter();
    const [submitStatus, setSubmitStatus] = useState('');
    const [loading, setLoading] = useState(false);
    const { submitCategory } = useCategory();

    useEffect(() => {
        setCategory(categoryData?.name || ''); // Fallback to empty string
        setCategoryId(categoryData?.id || null); // Fallback to null
    }, [categoryData]);



    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true)

        try {
            setSubmitStatus('')

            // Update existing product
            const response = await submitCategory({ categoryId, category });

            if (response.success) {
                router.push("/admin/categories");
                setSubmitStatus(response.data.message);
                setLoading(false)
            } else {
                setLoading(false)
                setSubmitStatus(response.message);
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
                    Category  Name {category}
                </label>
                <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="specification_key"
                    type="text"
                    placeholder="Enter product name"
                    value={category && category}
                    onChange={(e) => setCategory(e.target.value)}
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
                    {loading ? 'Submitting...' : categoryId ? 'Update Category' : 'Create Category'}
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

export default CategoryForm;
