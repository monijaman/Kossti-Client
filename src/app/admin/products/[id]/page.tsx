import ProductForm from "@/components/admin/ProductForm";
import ProductTransForm from "@/components/admin/ProductTransForm";
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
    return <>
        <div className="flex flex-row gap-4">
            <div className="w-1/2  bg-gray-100 border rounded">
                <ProductForm product={dataset} /> 
            </div>

            <div className="w-1/2">
            <ProductTransForm product={dataset} /> 
            </div>
        </div>
    </>
};

export default UpdateProduct;
