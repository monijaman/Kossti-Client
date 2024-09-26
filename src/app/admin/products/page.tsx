"use client"
import Link from 'next/link'
import SearchBox from '@/components/Search';
import ProductReview from '@/components/admin/ProducDetails';
import { SearchParams, ProductApiResponse, Product } from '@/lib/types';
import { useProducts } from '@/hooks/useProducts';
import Pagination from '@/components/Pagination/index';
import ProductDetails from '@/components/admin/ProducDetails';

interface PageProps {
    params: {
        slug: string; // Type for the slug
    };
    searchParams: SearchParams; // Include searchParams
}

const ManageReviews = async ({ params, searchParams }: PageProps) => {

    const { slug } = params;
    const { getProducts } = useProducts();

    const page = parseInt(searchParams.page as string, 10) || 1;
    const limit = 10;
    const activeCategory = searchParams.category || '';
    const activeBrands = searchParams.brand || '';
    const activePriceRange = searchParams.price || '';
    const searchTerm = searchParams.searchterm || '';
    const locale = searchParams.locale || 'bn';

    const { getAProductBySlug } = useProducts()
    // Mock function to fetch product data
    const fetchProductData = async () => {
        const response = await getProducts(page, limit, activeCategory, activeBrands, activePriceRange, searchTerm, locale);
        return response.success ? response.data : { products: [], totalProducts: 0 };
    };

    const dataset = await fetchProductData();
    const totalPages = Math.ceil(dataset.totalProducts / limit);
    const handleEdit = (id: number) => {
        console.log('Edit product with ID:', id);
        // Add your edit logic here
    };

    const handleDelete = (id: number) => {
        console.log('Delete product with ID:', id);
        // Add your delete logic here
    };

    const handleReview = (id: number) => {
        console.log('Review product with ID:', id);
        // Add your review logic here
    };


    return (
        <>
            <h2 className="text-2xl font-bold mb-4"> Products</h2>
            <SearchBox initialSearchTerm={searchTerm} />

            {/* Add your review management functionalities here */}
            <ProductDetails
                products={dataset.products}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onReview={handleReview}
            />
            <Pagination
                category={activeCategory}
                selectedBrands={activeBrands}
                currentPage={page}
                totalPages={totalPages}
            />
        </>
    );
};

export default ManageReviews;
