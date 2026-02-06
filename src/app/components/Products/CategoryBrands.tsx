import CategoryBrandsClient from "./CategoryBrandsClient";

interface Brand {
    id: number;
    name: string;
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
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/category-brands?category_slug=${categorySlug}`,
            {
                next: { revalidate: 300 }, // Cache for 5 minutes
            }
        );

        if (response.ok) {
            const data: BrandsApiResponse = await response.json();
            brands = data.brands || [];
        }
    } catch (error) {
        console.error("Error fetching category brands:", error);
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
