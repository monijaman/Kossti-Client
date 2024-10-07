"use client";
import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { Product, Category, Brand } from '@/lib/types'; // Assuming you have a Product type
import { useCategory } from "@/hooks/useCategory";
import { useBrands } from "@/hooks/useBrands";
import { useProducts } from "@/hooks/useProducts";
// import { useBrands } from "@/hooks/useModel";

interface ProductFormProps {
    product?: Product; // Make it optional for the create case
}



const ProductForm = ({ product }: ProductFormProps) => {


    const [name, setName] = useState(product?.name || '');

    const [category, setCategory] = useState(product?.category_id || '');
    const [brand, setBrand] = useState(product?.brand_id || '');
    const [model, setModel] = useState(product?.model || '');
    const [price, setPrice] = useState(product?.price || 0);
    const [status, setStatus] = useState(product?.status || false); // Assuming status is boolean
    const [priority, setPriority] = useState(product?.priority || 1);
    const { getCategory } = useCategory();
    const { getBrands } = useBrands();
    const { createProduct, updateProduct } = useProducts();
    const router = useRouter();
    const id = product && product.id;
    const [submitstatus, setSubmitstatus] = useState('');

    const [categories, setCategories] = useState<Category[]>([]);
    const [brands, setBrands] = useState<Brand[]>([]);

    const fetchCategories = async () => {
        const categories = await getCategory();
        setCategories(categories.data)
    }
    const fetchBrands = async () => {
        const brands = await getBrands();
        setBrands(brands.data)
    }

    useEffect(() => {
        fetchCategories();
        fetchBrands();
    }, [])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const payload = {
            name,
            category_id: String(category),   // Ensure category is a string
            brand_id: String(brand),         // Ensure brand is a string
            model,
            price: parseFloat(price.toString()), // Convert price to a number
            status: status ? 1 : 0,          // Use 1/0 for boolean values
            priority: Number(priority),      // Ensure priority is a number
        };

        try {
            let response;

            // If there's an ID, update the product
            if (id) {
                response = await updateProduct(id, payload);  // Update product using its ID
            } else {
                response = await createProduct(payload);      // Create a new product
            }

            if (response.success) {
                setSubmitstatus('Form Submitted');
                // router.push('/products'); // Redirect to product listing on success
            } else {
                console.error('Error submitting form', response);
            }
        } catch (error) {
            console.error('Error submitting form', error);
        }
    };


    return (
        <form onSubmit={handleSubmit} className="max-w-lg   bg-white   rounded px-8 pt-6 pb-8 mb-4">
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
                />
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
                    Category
                </label>

                <select
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    name="categories"
                    id="categories"
                    value={category}  // Bind the selected value to the state
                    onChange={(e) => setCategory(e.target.value)}  // Update state on change
                >
                    {categories.map((item) => (
                        <option key={item.id} value={item.id}>
                            {item.name}
                        </option>
                    ))}
                </select>

            </div>

            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="brand">
                    Brand
                </label>

                <select
                    onChange={(e) => setBrand(e.target.value)}
                    value={brand}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    name="brands" id="brands" >
                    {brands.map((item) => {
                        return <option value={item.id}>{item.name}</option>
                    })}
                </select>

            </div>

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

            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                    Status
                </label>
                <input
                    className="mr-2 leading-tight"
                    id="status"
                    type="checkbox"
                    checked={!!status}  // Convert to boolean
                    onChange={() => setStatus(!status)} // Toggle the status between true/false
                />

                <span className="text-sm">Active</span>
            </div>

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
                />
            </div>




            <div className="flex items-center justify-between">
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="submit"
                >
                    {id ? 'Update Product' : 'Create Product'}
                </button>
            </div>

            {submitstatus && (
                <div
                    className={`p-4 mb-4 text-sm rounded-lg text-green-700 bg-green-100 text-green-700 bg-green-100`}
                    role="alert">
                    {submitstatus}
                </div>
            )}
        </form>

    );
};

export default ProductForm;
