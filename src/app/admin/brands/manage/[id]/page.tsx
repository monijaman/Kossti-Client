'use client'
import BrandForm from "@/app/components/admin/brands/BrandForm";
import BrandTransForm from "@/app/components/admin/brands/BrandTransForm";
import { useBrands } from "@/hooks/useBrands";
import { useCategory } from '@/hooks/useCategory';
import { Category } from '@/lib/types'; // Assuming you have a Product type
import { useEffect, useState } from 'react';
interface PageProps {
    params: {
        id: number; // Type for the slug
    };
}

const ManageBrands = ({ params }: PageProps) => {

    const { getCategoryById } = useCategory();
    const { getWideBrands } = useBrands();

    const { id: brandId } = params;
    const [brand, setBrand] = useState<Category>()

    const fetchBrand = async () => {
        try {
            const brandResponse = await getWideBrands({
                perPage: 10,        // Number of items per page (optional)
                search: '',   // Search term (optional)
                paginate: 'false',   // 'true' or 'false' to enable/disable pagination
                locale: 'en',        // Locale, e.g., 'en', 'bn', etc.
                brandId: brandId,      // Category ID (optional, can be empty)

            });

            if (brandResponse.success) {
                setBrand(brandResponse.data.data)
            } else {
                console.error('Failed to fetch categories');
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    useEffect(() => {
        if (brandId) {
            fetchBrand();
        }

    }, [])

    return (
        <>
            <div className="flex flex-row gap-4">
                <div className="w-1/2  bg-gray-100 border rounded">
                    <BrandForm brandData={brand} />
                </div>

                <div className="w-1/2">
                    {brand && <BrandTransForm brandData={brand} />}
                </div>
            </div>
        </>
    );
}

export default ManageBrands;
