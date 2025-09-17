"use client";
import Modal from '@/app/components/Modal/client';
import DragNdrop from "@/app/components/Uploader/Uploader";
import { useBrands } from "@/hooks/useBrands";
import { useCategory } from "@/hooks/useCategory";
import { apiEndpoints } from '@/lib/constants';
import fetchApi from '@/lib/fetchApi';
import { ApiResponse, Brand, Category, Product } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface ProductFormProps {
    product?: Product; // Optional for create case

}

const ProductForm = ({ product }: ProductFormProps) => {
    const [name, setName] = useState(product?.name || '');
    const [category, setCategory] = useState(product?.category_id?.toString() || '');
    const [brand, setBrand] = useState(product?.brand_id?.toString() || '');
    const [model, setModel] = useState(product?.model || '');
    const [price, setPrice] = useState(product?.price || 0);
    const [status, setStatus] = useState(product?.status || false);
    const [priority, setPriority] = useState(product?.priority || 1);
    const [submitStatus, setSubmitStatus] = useState('');
    const [loading, setLoading] = useState(false);

    // Define response types for API calls
    interface ProductCreateResponse {
        id?: number;        // Direct ID on the response
        message?: string;
        error?: string;
    }

    interface ProductUpdateResponse {
        id?: number;        // Direct ID on the response  
        message?: string;
        error?: string;
    }

    const { getCategory } = useCategory();
    const { getBrands } = useBrands();
    const router = useRouter();

    const [categories, setCategories] = useState<Category[]>([]);
    const [brands, setBrands] = useState<Brand[]>([]);

    useEffect(() => {
        // Fetch categories and brands on component mount
        const fetchCategoriesAndBrands = async () => {
            const categories = await getCategory();
            const brands = await getBrands();

            setCategories(categories.data as Category[]);
            setBrands(brands.data as Brand[]);
        };

        fetchCategoriesAndBrands();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Only run once on mount

    // Update form state when product changes (on initial load)
    useEffect(() => {
        if (product) {
            setName(product.name || '');
            setCategory(product.category_id?.toString() || '');
            setBrand(product.brand_id?.toString() || '');
            setModel(product.model || '');
            setPrice(product.price || 0);
            setStatus(product.status || false);
            setPriority(product.priority || 1);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [product?.id]); // Only depend on product ID to avoid loops

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true); // Set loading state

        const payload = {
            name: name,
            category_id: category ? Number(category) : null, // Go server expects snake_case and can be null
            brand_id: brand ? Number(brand) : null, // Go server expects snake_case and can be null
            price: parseFloat(price.toString()),
            status: !!status, // Convert to boolean (true/false)
            priority: Number(priority), // Priority field now exists in Go server's Product entity
        };


        try {
            setSubmitStatus('')
            let response: ApiResponse<ProductCreateResponse | ProductUpdateResponse>;
            if (product?.id) {
                // Update existing product
                response = await fetchApi(apiEndpoints.updateProduct(product.id), {
                    method: "PATCH",
                    body: payload,
                }) as ApiResponse<ProductUpdateResponse>;

                if (response.success && response.data) {
                    setSubmitStatus(response.data.message || 'Product updated successfully');
                } else {
                    // Handle error case - use response.error for failed requests
                    setSubmitStatus(response.error || response.data?.error || 'Failed to update product');
                }
            } else {
                // Create new product
                response = await fetchApi(apiEndpoints.createProduct, {
                    method: "POST",
                    body: payload,
                }) as ApiResponse<ProductCreateResponse>;

                if (response.success && response.data) {
                    const productId = response.data.id;

                    if (productId) {
                        // Optionally: Redirect after delay or handle the newly created product
                        setTimeout(() => {
                            router.push(`/admin/products/${productId}`); // Redirect to the product's page
                        }, 1000);
                    }
                }
            }

            // if (response.success && response.data) {
            //     setSubmitStatus(response.data.message || 'Operation completed successfully');
            // } else {
            //     setSubmitStatus(response.error || 'An error occurred during the operation');
            // }
        } catch (error) {
            console.error('Error submitting form', error);
            setSubmitStatus('Error submitting the form');
        } finally {
            setLoading(false);
        }

    };



    const [files, setFiles] = useState<File[]>([]);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
        setIsModalOpen(true);
    };


    useEffect(() => {
        console.log('Files selected:', files);
    }, [files]);


    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (

        <>
            {product &&
                <Modal isOpen={isModalOpen} onClose={closeModal}>
                    <DragNdrop onFilesSelected={setFiles} productId={product.id} width="auto" height="auto" />
                </Modal>
            }
            <div className="rounded px-8 pt-6 pb-8 mb-4">
                <button
                    className="bg-blue-500 mb-8 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                    onClick={openModal}
                >
                    Add Photos
                </button>

                <form onSubmit={handleSubmit} >
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
                            {Array.isArray(categories) && categories.map((item) => (
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
                            {Array.isArray(brands) && brands.map((item) => (
                                <option key={item.id as number} value={item.id as number}>
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
            </div>
        </>
    );
};

export default ProductForm;
