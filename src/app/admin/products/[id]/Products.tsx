 // Assuming you have a Product type
import ProductForm from "@/app/components/admin/ProductForm";
import ProductTransForm from "@/app/components/admin/ProductTransForm";
interface PageProps {
    params: {
        id: number; // Type for the slug
    };
}

const Products = async ({ params }: PageProps) => {
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
                <ProductForm product={dataset.products} />
            </div>

            <div className="w-1/2">
                <ProductTransForm product={dataset.products} />
            </div>
        </div>
    </>
};

export default Products;
