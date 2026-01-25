'use client'
// pages/specifications/index.js
import KeyDetails from '@/app/components/admin/keys/KeyDetails';
import Pagination from '@/app/components/Pagination/index';
import Input from '@/app/components/ui/input';
import useSpecificationsKeys from '@/hooks/useSpecificationsKeys';
import { SpecificationKey } from '@/lib/types';
import useDebounce from '@/lib/useDebounce';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
export default function KeysListPage() {
    // Use useSearchParams hook for client-side access to search params
    const searchParamsFromHook = useSearchParams();
    const [specificationsKeys, setSpecificationsKeys] = useState<SpecificationKey[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [totalPages, setTotalPages] = useState(1);
    const [perPage] = useState(10);

    const { getSpecificationsKeys } = useSpecificationsKeys();
    const debouncedSearchTerm = useDebounce({ value: searchTerm, delay: 500 });

    const page = parseInt(searchParamsFromHook.get('page') || '1', 10);

    const userType = typeof window !== 'undefined' ? localStorage.getItem('userType') : null;

    const fetchKeys = async () => {
        setLoading(true);
        const response = await getSpecificationsKeys({ perPage, searchTerm: debouncedSearchTerm, page });

        if (response && response.data) {

            setSpecificationsKeys(response.data);
            setTotalPages(Math.ceil(response.total));
        } else {
            setSpecificationsKeys([]);
            setTotalPages(0);
        }

        setLoading(false);
    };


    useEffect(() => {
        if (debouncedSearchTerm) fetchKeys();
    }, [debouncedSearchTerm]);

    useEffect(() => {
        fetchKeys();
    }, []);

    const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };



    return (
        <div>
            <h2 className="text-2xl font-bold mb-4"> Specification Keys</h2>
            {userType !== 'reviewer' && (
                <Link className='bg-blue-500 text-white p-4 py-1 rounded mr-2 my-2' href="/admin/keys/manage">Add New Key</Link>
            )}

            <div className='my-4'>
                <Input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    placeholder="Search keys..."
                    className="border border-gray-300 p-2 w-full rounded"
                />
            </div>

            {loading ? (
                <div className="text-center py-4">Loading...</div>
            ) : (
                <>
                    {/* Add your review management functionalities here */}
                    <KeyDetails
                        keys={specificationsKeys}
                        onRefresh={fetchKeys}
                    />
                    {totalPages > 0 && (
                        <Pagination
                            currentPage={page}
                            totalPages={totalPages}
                        />
                    )}

                </>
            )}
        </div>
    );
}
