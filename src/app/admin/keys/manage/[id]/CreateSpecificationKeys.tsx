'use client'
import KeyForm from "@/app/components/admin/keys/KeyForm";
import KeyTransForm from "@/app/components/admin/keys/KeyTransForm";
import useSpecificationsKeys from '@/hooks/useSpecificationsKeys';
import { SpecificationKey } from '@/lib/types'; // Assuming you have a Product type
import { use, useCallback, useEffect, useState } from 'react';

interface PageProps {
    params: Promise<{
        id: number; // Type for the slug
    }>;
}

const CreateSpecificationKeys = ({ params }: PageProps) => {

    const { getSpecificationsKeysById } = useSpecificationsKeys();
    const { id } = use(params);
    const [key, setKey] = useState<SpecificationKey>()

    const fetchKeys = useCallback(async () => {
        const response = await getSpecificationsKeysById(id);
        if (response.success) {
            setKey(response.data)

        }

    }, [id, getSpecificationsKeysById]);

    useEffect(() => {
        if (id) {
            fetchKeys();
        }

    }, [id, fetchKeys])

    return (
        <>
            <div className="flex flex-row gap-4">
                <div className="w-1/2  bg-gray-100 border rounded">
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
