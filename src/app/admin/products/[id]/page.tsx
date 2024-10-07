import ProductForm from "@/components/admin/ProductForm";
import { useProducts } from "@/hooks/useProducts";
import { Product } from '@/lib/types'; // Assuming you have a Product type

interface PageProps {
    params: {
        id: number; // Type for the slug
    };
}

const UpdateProduct = async ({ params }: PageProps) => {
    const { getAProductById } = useProducts();
    const { id } = params;
    const fetchAProductData = async () => {
        const response = await getAProductById(id);
        return response.success ? response.data : { products: [], totalProducts: 0 };
    };

    const dataset = await fetchAProductData();
    return <ProductForm product={dataset} />;
};

export default UpdateProduct;
