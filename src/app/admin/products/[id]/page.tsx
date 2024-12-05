import ProductForm from "@/components/admin/ProductForm";
import ProductTransForm from "@/components/admin/ProductTransForm";

interface PageProps {
    params: Promise<{ id: string }>; // Ensure params is treated as a Promise
}

// Function to fetch a product by ID
const fetchAProductData = async (id: string) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL + "/api/v1"; // Replace with your actual API URL
    if (!apiUrl) {
        throw new Error("API URL is not defined in environment variables");
    }

    const fullUrl = `${apiUrl}/products/${id}`;

    try {
        const response = await fetch(fullUrl, { next: { revalidate: 10 } });
        const data = await response.json();
        return data.success ? data : { products: null };
    } catch (error) {
        console.error("Error fetching product data:", error);
        return { products: null };
    }
};

const Products = async ({ params }: PageProps) => {
    const resolvedParams = await params; // Resolve the Promise for params
    const { id } = resolvedParams;

    // Fetch product data directly
    const dataset = await fetchAProductData(id);

    return (
        <div className="flex flex-row gap-4">
            <div className="w-1/2 bg-gray-100 border rounded">
                <ProductForm product={dataset.products} />
            </div>
            <div className="w-1/2">
                <ProductTransForm product={dataset.products} />
            </div>
        </div>
    );
};

export default Products;
