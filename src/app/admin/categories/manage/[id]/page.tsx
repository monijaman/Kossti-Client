'use client'
import CategoryForm from "@/components/admin/categories/CategoryForm";
import CategoryTransForm from "@/components/admin/categories/CategoryTransForm";
import { useCategory } from '@/hooks/useCategory';
import useSpecificationsKeys from '@/hooks/useSpecificationsKeys';
import { Category } from '@/lib/types'; // Assuming you have a Product type
import { useEffect, useState } from 'react';
interface PageProps {
    params: {
        id: number; // Type for the slug
    };
}

const CreateSpecificationKeys = ({ params }: PageProps) => {

    const { getSpecificationsKeysById } = useSpecificationsKeys();
    const { getCategoryById } = useCategory();
    const { id } = params;
    const [category, setCategory] = useState<Category>()

    const fetchKeys = async () => {
        const response = await getCategoryById(id);
        if (response.success) {
            setCategory(response.data)
        }

    };

    useEffect(() => {
        if (id) {
            fetchKeys();
        }

    }, [])

    return (
        <>
            <div className="flex flex-row gap-4">
                <div className="w-1/2  bg-gray-100 border rounded">
                    <CategoryForm categoryData={category} />
                </div>

                <div className="w-1/2">
                    {category && <CategoryTransForm categoryData={category} />}
                </div>
            </div>
        </>
    );
}

export default CreateSpecificationKeys;
