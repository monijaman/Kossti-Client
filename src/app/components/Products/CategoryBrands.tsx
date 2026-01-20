"use client"
import Link from "next/link";
import { useEffect, useState } from "react";

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

const CategoryBrands = ({ categorySlug, countryCode }: CategoryBrandsProps) => {
    const [brands, setBrands] = useState<Brand[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAll, setShowAll] = useState(false);

    useEffect(() => {
        if (!categorySlug) {
            setBrands([]);
            setLoading(false);
            return;
        }

        const fetchBrands = async () => {
            try {
                setLoading(true);
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/category-brands?category_slug=${categorySlug}`
                );

                if (response.ok) {
                    const data = await response.json();
                    setBrands(data.brands || []);
                } else {
                    setBrands([]);
                }
            } catch (error) {
                console.error("Error fetching category brands:", error);
                setBrands([]);
            } finally {
                setLoading(false);
            }
        };

        fetchBrands();
    }, [categorySlug]);

    if (!categorySlug || loading || brands.length === 0) {
        return null;
    }

    const displayedBrands = showAll ? brands : brands.slice(0, 10);
    const hasMore = brands.length > 10;

    return (
        <div className="category-brands-section my-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">By Brand</h3>
            <div className="brand-grid grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                {displayedBrands.map((brand) => (
                    <Link
                        key={brand.id}
                        href={`/${countryCode}?category=${categorySlug}&brand=${brand.slug}`}
                        className="brand-card text-center p-3 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all"
                    >
                        <span className="text-sm font-medium text-gray-700 hover:text-blue-600">
                            {brand.name}
                        </span>
                    </Link>
                ))}
            </div>
            {hasMore && !showAll && (
                <button
                    onClick={() => setShowAll(true)}
                    className="mt-4 px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline transition-all"
                >
                    See More ({brands.length - 10} more brands)
                </button>
            )}
        </div>
    );
};

export default CategoryBrands;
