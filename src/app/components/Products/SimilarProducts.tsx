"use client"
import { useTranslation } from "@/hooks/useLocale"; // Assuming this hook exists or similar
import { Product } from "@/lib/types";
import { useEffect, useState } from "react";
import ProducShortDetails from "./ProducShortDetails";
import fetchApi from "@/lib/fetchApi";

interface PageProps {
    countryCode: string;
    slug: string;
}

const SimilarProducts = ({ countryCode, slug }: PageProps) => {
    const [dataset, setDataSet] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchSimilarProducts = async () => {
        try {
            setLoading(true);
            const response = await fetchApi(`/products-by-slug/${slug}/similar`, {
                method: 'GET',
            });

            if (response.success && response.data && typeof response.data === 'object' && 'products' in response.data) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const dataset = (response.data as any).products as Product[];
                setDataSet(dataset);
            } else {
                setDataSet([]);
            }
        } catch (error) {
            console.error("Failed to fetch similar products", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (slug) {
            fetchSimilarProducts();
        }
    }, [slug]);

    if (!loading && dataset.length === 0) {
        return null;
    }

    return (
        <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Similar Products
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {dataset.map((product) => (
                    <ProducShortDetails key={product.id} product={product} countryCode={countryCode} />
                ))}
            </div>
        </div>
    );
};

export default SimilarProducts;
