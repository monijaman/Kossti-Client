import { FC } from 'react';
import { useCategory } from '@/hooks/useCategory';

interface categoryInt {
    id: number;
    name: string;
    priority: number;
    deleted_at: null;
    created_at: string;
    updated_at: string;
}
interface SearchParams {
    page?: string;
    category?: string;
    brand?: string;
    price?: string;
}

const Brands = async ({ searchParams }: { searchParams: SearchParams }) => {

    const { getCategory } = useCategory()

    // Fetch the products data using the async function
    const response = await getCategory();
    // Handle the fetched data
    const dataset = response.success ? response.data : [];

    const activeCategory = searchParams.category || '';

    const clearBrandhUrl = `/?category=${activeCategory || ''}${activePriceRange ? `&price=${activePriceRange}` : ''}`;


    return (
        <>
            <h2 className="text-lg font-semibold mb-4">Categories</h2>
            <div className="mb-4">

                {
                    dataset && dataset.map((category: categoryInt) => {
                        return (
                            <a
                                href={`/?category=${activeCategory}`}
                                className={`block px-4 py-2 rounded-md ${activeCategory === category.name ? 'bg-blue-100' : 'bg-gray-200'}`}
                            >
                                {category.name}
                            </a>
                        )
                    })
                }


            </div>
            <a href={clearBrandhUrl} className="text-blue-500 hover:underline mb-4 block">
                Clear Categories
            </a>

        </>
    );
};

export default Brands;
