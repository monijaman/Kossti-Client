// Assuming you have a Product type
import ProductForm from "@/app/components/admin/ProductForm";
import ProductTransForm from "@/app/components/admin/ProductTransForm";
import { apiEndpoints } from "@/lib/constants";
import fetchApi from "@/lib/fetchApi";
import { Product } from "@/lib/types";
import { cookies } from "next/headers";


interface PageProps {
    params: Promise<{
        id: number; // Type for the slug
    }>;
}


const Products = async ({ params }: PageProps) => {

    const { id } = await params;

    const fetchAProductData = async (): Promise<Product> => {
        const response = await fetchApi(
            apiEndpoints.getAProductById(id),
            {
                method: 'GET',
                accessToken: (await cookies()).get("accessToken")?.value || "",
                queryParams: { type: 'public' },
            }
        );
        return response.data as Product;
    };

    let dataset: Product;

    try {
        dataset = await fetchAProductData();
    } catch (error) {
        console.error('Error fetching product:', error);
        // Return a fallback response or redirect
        return <div className="p-4 text-red-500">Error loading product. Product not found.</div>;
    }

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

export default Products;
