'use client'
// pages/specifications/index.js
import KeyDetails from '@/app/components/admin/keys/KeyDetails';
import Pagination from '@/app/components/Pagination/index';
import useSpecificationsKeys from '@/hooks/useSpecificationsKeys';
import { SpecificationKey } from '@/lib/types';
import useDebounce from '@/lib/useDebounce';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

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

    const fetchKeys = useCallback(async () => {
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
    }, [getSpecificationsKeys, perPage, debouncedSearchTerm, page]);

    useEffect(() => {
        fetchKeys();
    }, []);

    const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };



    return (
        <div>
            <h2 className="text-2xl font-bold mb-4"> Specification Keys</h2>
            <Link className='bg-blue-500 text-white p-4 py-1 rounded mr-2 my-2' href="/admin/keys/manage">Add New Key</Link>

            <div className='my-4'>
                <input
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
