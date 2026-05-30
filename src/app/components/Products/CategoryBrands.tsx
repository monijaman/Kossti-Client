import CategoryBrandsClient from "./CategoryBrandsClient";
import { getApiUrl } from "@/lib/apiUrl";

interface Brand {
    id: number;
    name: string;
    translated_name?: string;
    slug: string;
    status: number;
}

interface CategoryBrandsProps {
    categorySlug: string;
    countryCode: string;
}

type BrandsApiResponse = {
    brands: Brand[];
};

// Server Component - fetches data on the server
const CategoryBrands = async ({ categorySlug, countryCode }: CategoryBrandsProps) => {
    if (!categorySlug) {
        return null;
    }

    let brands: Brand[] = [];

    try {
        const apiUrl = getApiUrl();

        const params = new URLSearchParams({ category_slug: categorySlug });
        if (countryCode) {
            params.append("locale", countryCode);
        }

        const response = await fetch(
            `${apiUrl}/category-brands?${params.toString()}`,
            {
                next: { revalidate: 300 }, // Cache for 5 minutes
            }
        );

        if (response.ok) {
            const data: BrandsApiResponse = await response.json();
            brands = data.brands || [];
        } else {
            console.error(`[CategoryBrands] API returned status ${response.status}`);
        }
    } catch (error) {
        console.error("[CategoryBrands] Error fetching category brands:", error);
    }

    if (brands.length === 0) {
        return null;
    }

    return (
        <CategoryBrandsClient
            brands={brands}
            categorySlug={categorySlug}
            countryCode={countryCode}
        />
    );
};

export default CategoryBrands;
