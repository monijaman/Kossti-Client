"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Product, Category, Brand } from '@/lib/types';
import { useCategory } from "@/hooks/useCategory";
import { useBrands } from "@/hooks/useBrands";
import { useProducts } from "@/hooks/useProducts";

interface ProductFormProps {
    product?: Product; // Optional for create case
    
}

const ProductForm = ({ product }: ProductFormProps) => {
    const [name, setName] = useState(product?.name || '');
    const [category, setCategory] = useState(product?.category_id || '');
    const [brand, setBrand] = useState(product?.brand_id || '');
    const [model, setModel] = useState(product?.model || '');
    const [price, setPrice] = useState(product?.price || 0);
    const [status, setStatus] = useState(product?.status || false);
    const [priority, setPriority] = useState(product?.priority || 1);
    const [submitStatus, setSubmitStatus] = useState('');
    const [loading, setLoading] = useState(false);

    const { getCategory } = useCategory();
    const { getBrands } = useBrands();
    const { createProduct, updateProduct } = useProducts();
    const router = useRouter();

    const [categories, setCategories] = useState<Category[]>([]);
    const [brands, setBrands] = useState<Brand[]>([]);

    useEffect(() => {
        // Fetch categories and brands on component mount
        const fetchCategoriesAndBrands = async () => {
            const categories = await getCategory();
            const brands = await getBrands();
            setCategories(categories.data);
            setBrands(brands.data);
        };

        fetchCategoriesAndBrands();
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true); // Set loading state

        const payload = {
            name,
            category_id: String(category),
            brand_id: String(brand),
            model,
            price: parseFloat(price.toString()),
            status: status ? 1 : 0, // Convert status to integer
            priority: Number(priority),
        };

        try {
            let response;

            if (product?.id) {
                // Update existing product
                response = await updateProduct(product.id, payload);
            } else {
                // Create new product
                response = await createProduct(payload);
            }

            if (response.success) {
                setSubmitStatus('Product successfully submitted!');

                // Reset form only if creating a new product
                if (!product) {
                    resetForm();
                }
                // Redirect after delay
                setTimeout(() => {
                   
                  //  router.push('/products');
                }, 1500);
            } else {
                setSubmitStatus('Error submitting the form');
                console.error('Form submission error', response);
            }
        } catch (error) {
            console.error('Error submitting form', error);
            setSubmitStatus('Error submitting the form');
        } finally {
            setLoading(false); // Reset loading state
        }
    };

    const resetForm = () => {
        setName('');
        setCategory('');
        setBrand('');
        setModel('');
        setPrice(0);
        setStatus(false);
        setPriority(1);
    };

    return (
        <form onSubmit={handleSubmit} className="rounded px-8 pt-6 pb-8 mb-4">
            {/* Product Name */}
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                    Product Name
                </label>
                <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="name"
                    type="text"
                    placeholder="Enter product name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </div>

            {/* Category */}
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
                    Category
                </label>
                <select
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    name="categories"
                    id="categories"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                >
                    <option value="" disabled>Select category</option>
                    {categories.map((item) => (
                        <option key={item.id} value={item.id}>
                            {item.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Brand */}
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="brand">
                    Brand
                </label>
                <select
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    name="brands"
                    id="brands"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    required
                >
                    <option value="" disabled>Select brand</option>
                    {brands.map((item) => (
                        <option key={item.id} value={item.id}>
                            {item.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Model */}
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="model">
                    Model
                </label>
                <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="model"
                    type="text"
                    placeholder="Enter product model"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                />
            </div>

            {/* Price */}
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">
                    Price
                </label>
                <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="price"
                    type="number"
                    step="0.01"
                    placeholder="Enter product price"
                    value={price}
                    onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                />
            </div>

            {/* Status */}
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Status</label>
                <input
                    className="mr-2 leading-tight"
                    id="status"
                    type="checkbox"
                    checked={!!status}  // Convert to boolean
                    onChange={() => setStatus(!status)}
                />
                <span className="text-sm">Active</span>
            </div>

            {/* Priority */}
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="priority">
                    Priority
                </label>
                <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="priority"
                    type="number"
                    placeholder="Enter priority"
                    value={priority}
                    onChange={(e) => setPriority(Number(e.target.value) || 1)}
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
                    {loading ? 'Submitting...' : product?.id ? 'Update Product' : 'Create Product'}
                </button>
            </div>

            {/* Submission Status */}
            {submitStatus && (
                <div
                    className={`p-4 mt-4 text-sm rounded-lg ${
                        submitStatus.includes('successfully')
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

export default ProductForm;
