"use client"
import Pagination from '@/components/Pagination/index';
import ProductDetails from '@/components/admin/ProducDetails';
import { useProducts } from '@/hooks/useProducts';
import { Product, SearchParams } from '@/lib/types';
import useDebounce from '@/lib/useDebounce';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface PageProps {
    params: {
        slug: string; // Type for the slug
    };
    searchParams: SearchParams; // Include searchParams
}

const ManageReviews = ({ params, searchParams }: PageProps) => {

    const { slug } = params;
    const { getProducts } = useProducts();
    const page = parseInt(searchParams.page as string, 10) || 1;
    const [searchTerm, setSearchTerm] = useState('');

    const debouncedSearchTerm = useDebounce({ value: searchTerm, delay: 500 });
    const limit = 10;
    const activeCategory = searchParams.category || '';
    const activeBrands = searchParams.brand || '';
    const activePriceRange = searchParams.price || '';
    const locale = searchParams.locale || 'bn';
    const [products, setProducts] = useState<Product[]>([]);
    const [totalPage, setTotalPage] = useState(0);

    const { getAProductBySlug } = useProducts()
    // Mock function to fetch product data
    const fetchProductData = async () => {
        const response = await getProducts(page, limit, activeCategory, activeBrands, activePriceRange, searchTerm, locale);
        //  return response.success ? response.data : { products: [], totalProducts: 0 };
        setTotalPage(Math.ceil(response.totalProducts / limit))
        setProducts(response.data.products);
    };



    useEffect(() => {
        fetchProductData();
    }, [])


    useEffect(() => {
        if (debouncedSearchTerm) {
            fetchProductData();
        }
    }, [debouncedSearchTerm]);

    const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };


    return (
        <>
            <h2 className="text-2xl font-bold mb-4"> Products</h2>
            <Link className='bg-blue-500 text-white px-2 py-1 rounded mr-2 my-2' href="/admin/createproduct">Add New Product</Link>

            <div className='py-4'>

                <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    placeholder="Search products..."
                    className="border border-gray-300 p-2 w-full rounded"
                />
            </div>


            {/* Add your review management functionalities here */}
            <ProductDetails
                products={products}
            />
            <Pagination
                category={activeCategory}
                selectedBrands={activeBrands}
                currentPage={page}
                totalPages={totalPage}
            />
        </>
    );
};

export default ManageReviews;
