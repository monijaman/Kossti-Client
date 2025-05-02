'use client'
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import useSpecificationsKeys from '@/hooks/useSpecificationsKeys';
import KeyForm from "@/app/components/admin/keys/KeyForm";

export default function CreateSpecification() {


    return (
        <div className="flex flex-row gap-4">
            <div className="w-1/2  bg-gray-100 border rounded">
                <KeyForm   />
            </div>
        </div>

    );
}
