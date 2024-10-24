'use client'
// pages/specifications/index.js
import { useState, useEffect } from 'react';
import useSpecificationsKeys from '@/hooks/useSpecificationsKeys';
import { SearchParams, ProductApiResponse, Product } from '@/lib/types';
import KeyDetails from '@/components/admin/keys/KeyDetails';
import Pagination from '@/components/Pagination/index';
import Link from 'next/link';
import KeySearch from '@/components/Search/KeySearch';

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



    const page = parseInt(searchParams.page as string, 10) || 1;
    const limit = 10;
    const activeCategory = searchParams.category || '';
    const activeBrands = searchParams.brand || '';
    const activePriceRange = searchParams.price || '';
    const searchTerm = searchParams.searchterm || '';
    const locale = searchParams.locale || 'bn';


    const fetchSpecifications = async (search = '', perPage = 10) => {
        setLoading(true);
        const response = await getSpecificationsKeys();
        setSpecificationsKeys(response.data);

        setTotalPages(Math.ceil(response.data.total / limit));

        // setSpecifications(response);
        setLoading(false);
    };

    useEffect(() => {
        fetchSpecifications(searchTerm, perPage);
    }, [searchTerm, perPage]);

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4"> Products</h2>
            <Link className='bg-blue-500 text-white px-2 py-1 rounded mr-2 my-2' href="/admin/keys/manage">Add New Key</Link>
            <KeySearch initialSearchTerm={searchTerm} />

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
