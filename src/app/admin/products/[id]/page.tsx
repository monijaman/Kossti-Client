import ProductForm from "@/components/admin/ProductForm";
import ProductTransForm from "@/components/admin/ProductTransForm";

interface PageProps {
    params: {
        id: number; // Type for the slug
    };
}

// Function to fetch a product by ID
const fetchAProductData = async (id: number) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL + "/api/v1"; // Replace with your actual API URL
    if (!apiUrl) {
        throw new Error("API URL is not defined in environment variables");
    }

    const fullUrl = `${apiUrl}/products/${id}`;

    try {
        const response = await fetch(fullUrl);
        const data = await response.json();
        return data.success ? data : { products: [], totalProducts: 0 };
    } catch (error) {
        console.error("Error fetching product data:", error);
        return { products: [], totalProducts: 0 };
    }
};

const Products = async ({ params }: PageProps) => {
    const { id } = params;

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
