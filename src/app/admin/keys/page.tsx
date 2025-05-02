'use client'
// pages/specifications/index.js
import KeyDetails from '@/app/components/admin/keys/KeyDetails';
import Pagination from '@/app/components/Pagination/index';
import useSpecificationsKeys from '@/hooks/useSpecificationsKeys';
import { SearchParams } from '@/lib/types';
import useDebounce from '@/lib/useDebounce';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface PageProps {
    params: {
        slug: string; // Type for the slug
    };
    searchParams: SearchParams; // Include searchParams
}

const ListSpecifications = ({ params, searchParams }: PageProps) => {


    const [totalPages, setTotalPages] = useState(0);
    const [specificationsKeys, setSpecificationsKeys] = useState([]);
    const [perPage, setPerPage] = useState(10);
    const [loading, setLoading] = useState(true);
    const { getSpecificationsKeys } = useSpecificationsKeys();
    const paginate = true;
    const [searchTerm, setSearchTerm] = useState('');

    const debouncedSearchTerm = useDebounce({ value: searchTerm, delay: 500 });

    const page = parseInt(searchParams.page as string, 10) || 1;
    const limit = 10;
    const activeCategory = searchParams.category || '';
    const activeBrands = searchParams.brand || '';
    const activePriceRange = searchParams.price || '';
    const locale = searchParams.locale || 'bn';


    const fetchKeys = async () => {
        setLoading(true);
        const response = await getSpecificationsKeys({ perPage, searchTerm, paginate, page });
        setSpecificationsKeys(response.data);

        setTotalPages(Math.ceil(response.total / limit));

        // setSpecifications(response);
        setLoading(false);
    };

    useEffect(() => {
        fetchKeys();
    }, [searchTerm, perPage]);


    useEffect(() => {
        if (debouncedSearchTerm) {
            fetchKeys();
        }
    }, [debouncedSearchTerm]);

    const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    useEffect(() => {
        fetchKeys();
    }, []);



    return (
        <div>
            <h2 className="text-2xl font-bold mb-4"> Specification Keys</h2>
            <Link className='bg-blue-500 text-white px-2 py-1 rounded mr-2 my-2' href="/admin/keys/manage">Add New Key</Link>


            <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search products..."
                className="border border-gray-300 p-2 w-full rounded"
            />

            {/* Add your review management functionalities here */}
            <KeyDetails
                keys={specificationsKeys}
            />
            <Pagination
                category={activeCategory}
                selectedBrands={activeBrands}
                currentPage={page}
                totalPages={totalPages}
            />
        </div>
    );
}


export default ListSpecifications;
