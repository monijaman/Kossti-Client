'use client'
import KeyForm from "@/app/components/admin/keys/KeyForm";
import KeyTransForm from "@/app/components/admin/keys/KeyTransForm";
import useSpecificationsKeys from '@/hooks/useSpecificationsKeys';
import { SpecificationKey } from '@/lib/types'; // Assuming you have a Product type
import { use, useCallback, useEffect, useState } from 'react';

interface PageProps {
    params: Promise<{
        id: string; // Type for the slug
    }>;
}

const CreateSpecificationKeys = ({ params }: PageProps) => {
    const { getSpecificationsKeysById } = useSpecificationsKeys();
    const { id } = use(params);
    const [key, setKey] = useState<SpecificationKey>();
    const [loading, setLoading] = useState(true);

    const fetchKeys = useCallback(async () => {
        setLoading(true);
        const response = await getSpecificationsKeysById(parseInt(id));
        if (response.success && response.data) {
            setKey(response.data as SpecificationKey);
        }

        setLoading(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]); // Remove getSpecificationsKeysById from dependencies to prevent infinite loop

    useEffect(() => {
        if (id) {
            fetchKeys();
        }
    }, [id, fetchKeys])

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-lg">Loading...</div>
            </div>
        );
    }

    return (
        <>
            <div className="mb-4">
                <h2 className="text-2xl font-bold">Edit Specification Key</h2>
            </div>
            <div className="flex flex-row gap-4">
                <div className="w-1/2 bg-gray-100 border rounded">
                    <KeyForm speckeyData={key} />
                </div>

                <div className="w-1/2">
                    {key && <KeyTransForm speckeyData={key} />}
                </div>
            </div>
        </>
    );
}

export default CreateSpecificationKeys;
