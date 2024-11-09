'use client'
// pages/specifications/index.js
import CategoryDetails from '@/components/admin/categories/CategoryDetails';
import Pagination from '@/components/Pagination/index';
import CategorySearch from '@/components/Search/CategorySearch';
import { useCategory } from '@/hooks/useCategory';
import useSpecificationsKeys from '@/hooks/useSpecificationsKeys';
import { categoryInt, SearchParams } from '@/lib/types';
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
    const [categories, setCategories] = useState<categoryInt[]>([]);
    const [perPage, setPerPage] = useState(10);
    const [loading, setLoading] = useState(true);
    const { getSpecificationsKeys } = useSpecificationsKeys();
    const { getCategories } = useCategory();
    const paginate = true;


    const page = parseInt(searchParams.page as string, 10) || 1;
    const limit = 10;
    const activeCategory = searchParams.category || '';
    const activeBrands = searchParams.brand || '';
    const activePriceRange = searchParams.price || '';
    const searchTerm = searchParams.searchterm || '';
    const locale = searchParams.locale || 'bn';


    const fetchCategories = async () => {
        setLoading(true);
        const response = await getCategories({ perPage, searchTerm, paginate, page });
        console.log('response.dataresponse.data', response.data)
        setCategories(response.data);

        setTotalPages(Math.ceil(response.total / limit));

        // setSpecifications(response);
        setLoading(false);
    };

    useEffect(() => {
        fetchCategories();
    }, [searchTerm, perPage]);

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4"> Categories</h2>
            <Link className='bg-blue-500 text-white px-2 py-1 rounded mr-2 my-2' href="/admin/categories/manage">Add New Key</Link>
            <CategorySearch initialSearchTerm={searchTerm} />

            {/* Add your review management functionalities here */}
            <CategoryDetails
                categories={categories}
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
