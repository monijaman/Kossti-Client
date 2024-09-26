import Link from 'next/link'
import SearchBox from '@/components/Search';
import ProductReview from '@/components/Products/ProductReview';
import { SearchParams, ProductApiResponse, Product } from '@/lib/types';
import { useProducts } from '@/hooks/useProducts';
import Pagination from '@/components/Pagination/index';


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

    return (
        <>
            <SearchBox initialSearchTerm={searchTerm} />
            {/* <ProductReview products={dataset.products} /> */}

            <h2 className="text-2xl font-bold mb-4">Manage Products</h2>
            {/* Add your review management functionalities here */}
            <ProductReview products={dataset.products} />

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
