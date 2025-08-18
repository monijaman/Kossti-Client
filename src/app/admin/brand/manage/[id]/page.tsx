'use client'

import BrandForm from "@/app/components/admin/brands/BrandForm";
import BrandTransForm from "@/app/components/admin/brands/BrandTransForm";
import { useBrands } from "@/hooks/useBrands";
import { apiEndpoints } from "@/lib/constants";
import fetchApi from "@/lib/fetchApi";
import { Brand } from '@/lib/types'; // Assuming you have a Product type
import { use, useCallback, useEffect, useState } from 'react';
interface PageProps {
    params: Promise<{
        id: number; // Type for the slug
    }>;
}

const ManageBrands = ({ params }: PageProps) => {

    const { getWideBrands } = useBrands();

    const { id } = use(params);
    const [brand, setBrand] = useState<Brand | null>(null)
    const [brands, setBrands] = useState<Brand | null>(null)

    const fetchBrands = useCallback(async () => {

        const response = await fetchApi(`${apiEndpoints.Brands(id)}`, {
            method: 'GET',
        });
        if (response && response.success && response.data) {
            setBrands(response.data as Brand);
        }
    }, [id]);


    useEffect(() => {
        if (id) {
            fetchBrands();
        }

    }, [fetchBrands, id])

    return (
        <>
            <div className="flex flex-row gap-4">
                {brands &&
                    <div className="w-1/2  bg-gray-100 border rounded">
                        <BrandForm brandData={brands} />
                    </div>
                }

                <div className="w-1/2">
                    {brand && <BrandTransForm brandData={brand} />}
                </div>
            </div>
        </>
    );
}

export default ManageBrands;
