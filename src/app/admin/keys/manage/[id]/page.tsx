'use client'
import { FormEvent, useEffect, useState, use } from 'react';
import KeyForm from "@/components/admin/keys/KeyForm";
import KeyTransForm from "@/components/admin/keys/KeyTransForm";
import useSpecificationsKeys from '@/hooks/useSpecificationsKeys';
import { SpecificationKey } from '@/lib/types'; // Assuming you have a Product type

interface PageProps {
    params: Promise<{
        id: number; // Type for the slug
    }>;
}

const CreateSpecificationKeys = (props: PageProps) => {
    const params = use(props.params);

    const { getSpecificationsKeysById } = useSpecificationsKeys();
    const { id } = params;
    const [key, setKey] = useState<SpecificationKey>()

    const fetchKeys = async () => {
        const response = await getSpecificationsKeysById(id);
        if (response.success) {
            setKey(response.data)

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
