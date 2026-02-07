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
    const [priority, setPriority] = useState<number>(() => {
        const p = product?.priority;
        console.log('[ProductForm] Initial priority from product:', p);
        return (p && p > 0) ? p : 1;
    });
    const [submitStatus, setSubmitStatus] = useState('');
    const [loading, setLoading] = useState(false);
    const [commentLoading, setCommentLoading] = useState(false);
    const [commentStatus, setCommentStatus] = useState('');
    const [translateLoading, setTranslateLoading] = useState(false);
    const [translateStatus, setTranslateStatus] = useState('');

    // Debug log for submitStatus changes
    useEffect(() => {
        if (submitStatus) {
            console.log('Submit Status Changed:', submitStatus);
        }
    }, [submitStatus]);

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

    const { getCategory, getCategories } = useCategory();
    const { getBrands } = useBrands();
    const router = useRouter();

    const [categories, setCategories] = useState<Category[]>([]);
    const [brands, setBrands] = useState<Brand[]>([]);

    const fetchCategoriesAndBrands = async () => {
        // Try the wide categories endpoint (supports per_page) to avoid default pagination
        let categoriesResponse = await getCategory();
        try {
            const wide = await getCategories({ perPage: 1000, paginate: false, status: null });
            // getCategories returns { success: boolean; data: unknown }
            // The hook's getCategories currently returns the fetchApi response as `data`.
            // Handle both shapes: direct array or nested `data` field.
            if (wide && wide.data) {
                const maybeApiResp = wide.data as unknown;
                const inner = (maybeApiResp && ((maybeApiResp as { data?: unknown }).data ?? maybeApiResp)) as unknown;
                if (Array.isArray(inner)) {
                    categoriesResponse = { success: true, data: inner } as { success: boolean; data: unknown };
                }
            }
        } catch (err) {
            // fallback to the basic getCategory
            console.debug('getCategories wide fetch failed, falling back to getCategory', err);
        }

        const brands = await getBrands();

        setCategories(categoriesResponse.data as Category[]);
        setBrands(brands.data as Brand[]);
    };

    useEffect(() => {
        // Fetch categories and brands on component mount
        fetchCategoriesAndBrands();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Only run once on mount

    // Update form state when product changes (on initial load)
    useEffect(() => {
        if (product) {
            console.log('[ProductForm] Setting initial form values. Priority:', product.priority);
            setName(product.name || '');
            setCategory(product.category_id?.toString() || '');
            setBrand(product.brand_id?.toString() || '');
            setModel(product.model || '');
            setPrice(product.price || 0);
            setStatus(product.status || false);
            setPriority(product.priority && product.priority > 0 ? product.priority : 1);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [product?.id]); // Only depend on product ID to avoid loops

    // Handle pulling comments from OpenAI
    const handlePullComments = async () => {
        if (!product?.id) {
            setCommentStatus('Error: Product not found');
            return;
        }

        setCommentLoading(true);
        setCommentStatus('');

        try {
            console.log('[DEBUG] Starting comment pull process...');

            // Call API to generate comments
            const response = await fetch('/api/openai/generate-comments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ productName: name }),
            });

            const data = await response.json();
            console.log('[DEBUG] Generated comments:', data);

            if (!response.ok) {
                throw new Error(data.error || 'Failed to generate comments');
            }

            // Now save the comments to the database
            const comments = data.comments;
            console.log('[DEBUG] Sending to bulk-create:', { productId: product.id, commentCount: comments.length });

            // Save comments via API endpoint
            const saveResponse = await fetch('/api/comments/bulk-create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    productId: product.id,
                    comments: comments,
                }),
            });

            const saveData = await saveResponse.json();
            console.log('[DEBUG] Bulk-create response:', saveData);

            if (!saveResponse.ok) {
                throw new Error(saveData.error || 'Failed to save comments');
            }

            setCommentStatus(`✅ Successfully added ${comments.length} comments!`);
        } catch (error) {
            console.error('Error pulling comments:', error);
            setCommentStatus(
                `❌ Error: ${error instanceof Error ? error.message : 'Failed to pull comments'}`
            );
        } finally {
            setCommentLoading(false);
        }
    };

    // Handle translating existing comments
    const handleTranslateComments = async () => {
        if (!product?.id) {
            setTranslateStatus('Error: Product not found');
            return;
        }

        setTranslateLoading(true);
        setTranslateStatus('');

        try {
            console.log('[DEBUG] Starting comment translation process...');

            // Call API to translate comments and save to comment_translations
            const response = await fetch('/api/comments/bulk-translate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ productId: product.id }),
            });

            const data = await response.json();
            console.log('[DEBUG] Bulk translate response:', data);

            if (!response.ok) {
                throw new Error(data.error || 'Failed to translate comments');
            }

            setTranslateStatus(`✅ Successfully translated and saved ${data.translatedCount || 0} comments to comment_translations!`);
        } catch (error) {
            console.error('Error translating comments:', error);
            setTranslateStatus(
                `❌ Error: ${error instanceof Error ? error.message : 'Failed to translate comments'}`
            );
        } finally {
            setTranslateLoading(false);
        }
    };

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

        console.log('[ProductForm] Submit payload:', payload, 'Current priority state:', priority);


        try {
            setSubmitStatus('')
            console.log('=== FORM SUBMISSION DEBUG ===');
            console.log('Payload:', payload);
            console.log('Is Update?', !!product?.id);

            let response: ApiResponse<ProductCreateResponse | ProductUpdateResponse>;
            if (product?.id) {
                // Update existing product
                response = await fetchApi(apiEndpoints.updateProduct(product.id), {
                    method: "PATCH",
                    body: payload,
                }) as ApiResponse<ProductUpdateResponse>;

                console.log('Update Response:', response);

                if (response.success && response.data) {
                    const successMessage = response.data.message || 'Product updated successfully';
                    setSubmitStatus(successMessage);
                    console.log('Update success message set:', successMessage);
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

                console.log('Create Response:', response);

                if (response.success && response.data) {
                    // Backend returns the product directly, so response.data contains the product
                    const productId = response.data.id;
                    const successMessage = response.data.message || 'Product created successfully';
                    setSubmitStatus(successMessage);
                    console.log('Success message set:', successMessage);

                    if (productId) {
                        // Show success message for 3 seconds before redirect
                        setTimeout(() => {
                            router.push(`/admin/products/${productId}`); // Redirect to the product's page
                        }, 3000); // Increased to 3 seconds so user can see the message
                    }
                } else {
                    console.log('Create failed:', response);
                    // Handle error case for creation
                    setSubmitStatus(response.error || response.data?.error || 'Failed to create product');
                }
            }
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
                {product && <button
                    className="bg-blue-500 mb-8 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                    onClick={openModal}
                >
                    Add Photos
                </button>}

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
                                <option selected={item.id === parseInt(category)} key={item.id} value={item.id.toString()}>
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
                                <option key={item.id as number} value={item.id?.toString() ?? ''}>
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
                        <select
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="priority"
                            value={priority?.toString() || '1'}
                            onChange={(e) => {
                                const newPriority = Number(e.target.value);
                                console.log('[ProductForm] Priority changed:', newPriority, 'from event value:', e.target.value);
                                setPriority(newPriority);
                            }}
                            required
                        >
                            <option value="1">Low</option>
                            <option value="2">Medium</option>
                            <option value="3">High</option>
                        </select>
                    </div>

                    {/* Submit Button */}
                    <div className="flex mb-4 items-center justify-between gap-2">

                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? 'Submitting...' : product?.id ? 'Update Product' : 'Create Product'}
                        </button>




                    </div>
                    <hr />

                    <div className="flex items-center my-6 justify-between gap-2">
                        {/* Review Button - Only show if product exists */}
                        {product?.id && (
                            <button
                                className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                type="button"
                                onClick={() => router.push(`/admin/reviews/${product.id}`)}
                            >
                                Review
                            </button>
                        )}

                        {/* Edit Specs Button - Only show if product exists */}
                        {product?.id && (
                            <button
                                className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                type="button"
                                onClick={() => router.push(`/admin/specifications/${product.id}`)}
                            >
                                EditSpecs
                            </button>
                        )}
                    </div>
                        <hr />
                    <div className="flex mt-6 items-center justify-between gap-2">
                        {/* Pull Comments Button - Only show if product exists */}
                        {product?.id && (
                            <button
                                className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                type="button"
                                onClick={handlePullComments}
                                disabled={commentLoading}
                            >
                                {commentLoading ? 'Pulling Comments...' : 'Pull Comments'}
                            </button>
                        )}

                        {/* Translate Comments Button - Only show if product exists */}
                        {product?.id && (
                            <button
                                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                type="button"
                                onClick={handleTranslateComments}
                                disabled={translateLoading}
                            >
                                {translateLoading ? 'Translating...' : 'Translate Comments'}
                            </button>
                        )}
                    </div>

                    {/* Comment Status Message */}
                    {commentStatus && (
                        <div
                            className={`p-4 mt-4 text-sm rounded-lg border ${commentStatus.toLowerCase().includes('successfully') || commentStatus.toLowerCase().includes('success')
                                ? 'text-green-700 bg-green-100 border-green-300'
                                : 'text-red-700 bg-red-100 border-red-300'
                                }`}
                            role="alert"
                        >
                            {commentStatus}
                        </div>
                    )}

                    {/* Translate Status Message */}
                    {translateStatus && (
                        <div
                            className={`p-4 mt-4 text-sm rounded-lg border ${translateStatus.toLowerCase().includes('successfully') || translateStatus.toLowerCase().includes('success')
                                ? 'text-green-700 bg-green-100 border-green-300'
                                : 'text-red-700 bg-red-100 border-red-300'
                                }`}
                            role="alert"
                        >
                            {translateStatus}
                        </div>
                    )}

                    {/* Submission Status - Always visible if there's a status */}
                    {submitStatus && (
                        <div
                            className={`p-4 mt-4 text-sm rounded-lg border ${submitStatus.toLowerCase().includes('successfully') || submitStatus.toLowerCase().includes('success')
                                ? 'text-green-700 bg-green-100 border-green-300'
                                : 'text-red-700 bg-red-100 border-red-300'
                                }`}
                            role="alert"
                        >
                            <strong>{submitStatus.toLowerCase().includes('successfully') || submitStatus.toLowerCase().includes('success') ? '✅ Success: ' : '❌ Error: '}</strong>
                            {submitStatus}
                        </div>
                    )}


                </form>
            </div>
        </>
    );
};

export default ProductForm;
