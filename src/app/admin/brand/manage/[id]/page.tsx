'use client'

import BrandForm from "@/app/components/admin/brands/BrandForm";
import BrandTransForm from "@/app/components/admin/brands/BrandTransForm";
import { apiEndpoints } from "@/lib/constants";
import fetchApi from "@/lib/fetchApi";
import { Brand } from '@/lib/types'; // Assuming you have a Product type
import { useRouter } from 'next/navigation';
import { use, useCallback, useEffect, useState } from 'react';
interface PageProps {
    params: Promise<{
        id: number; // Type for the slug
    }>;
}

const ManageBrands = ({ params }: PageProps) => {
    const { id } = use(params);
    const router = useRouter();
    const [brand, setBrand] = useState<Brand | null>(null)

    const fetchBrands = useCallback(async () => {
        const response = await fetchApi(`${apiEndpoints.Brands(id)}`, {
            method: 'GET',
        });

        const apiResponse = response.data as { data?: Brand; message?: string };

        if (response && response.success && apiResponse.data) {
            setBrand(apiResponse.data);
        }
    }, [id]);


    useEffect(() => {
        if (id) {
            fetchBrands();
        }

    }, [fetchBrands, id])

    return (
        <>
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-xl font-semibold text-gray-800">
                    Manage Brand
                </h1>
                <button
                    type="button"
                    onClick={() => router.push('/admin/brand/manage')}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
                >
                    Add New Brand
                </button>
            </div>
            <div className="flex flex-row gap-4">
                {brand &&
                    <div className="w-1/2  bg-gray-100 border rounded">
                        <BrandForm brandData={brand} />
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
