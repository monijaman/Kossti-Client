// Assuming you have a Product type
import ProductForm from "@/app/components/admin/ProductForm";
import ProductTransForm from "@/app/components/admin/ProductTransForm";
import { apiEndpoints } from "@/lib/constants";
import fetchApi from "@/lib/fetchApi";
import { cookies } from "next/headers";
import { Product } from "@/lib/types";
 

interface PageProps {
    params: {
        id: number; // Type for the slug
    };
}


interface ProductResponse {
    product: Product;
    totalProducts: number;
}

const Products = async ({ params }: PageProps) => {

    const { id } = params;

    const fetchAProductData = async (): Promise<ProductResponse> => {
        const response = await fetchApi(
            apiEndpoints.getAProductById(id),
            {
                method: 'POST',
                accessToken: (await cookies()).get("accessToken")?.value || "",
                body: { status },
                headers: { 'Content-Type': 'application/json' },
            }
        );

        return response.data as ProductResponse
      
    };

    const dataset = await fetchAProductData();

    return <>
        <div className="flex flex-row gap-4">
            <div className="w-1/2  bg-gray-100 border rounded">
                <ProductForm product={dataset.product} />
            </div>

            <div className="w-1/2">
                <ProductTransForm product={dataset.product} />
            </div>
        </div>
    </>
};

export default Products;
