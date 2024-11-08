import Pagination from '@/components/Pagination/index';
import SearchBox from '@/components/Search';
import ProductDetails from '@/components/admin/ProducDetails';
import { useProducts } from '@/hooks/useProducts';
import { SearchParams } from '@/lib/types';
import Link from 'next/link';

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
            <h2 className="text-2xl font-bold mb-4"> Products</h2>
            <Link className='bg-blue-500 text-white px-2 py-1 rounded mr-2 my-2' href="/admin/createproduct">Add New Product</Link>
            <SearchBox initialSearchTerm={searchTerm} searchUrl='products/' />

            {/* Add your review management functionalities here */}
            <ProductDetails
                products={dataset.products}
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
