import { SidebarParams } from '@/lib/types';
import Link from 'next/link';

const Price = async ({ activeCategory, selectedBrands, activePriceRange }: SidebarParams) => {

    const clearPriceRangeUrl = `/?category=${activeCategory || ''}${selectedBrands || ''}`;
    return (
        <>
            <h2 className="text-lg font-semibold mb-4">Price Range</h2>
            <div className="mb-4">
                <Link
                    href={`/?price=0-50${activeCategory ? `&category=${activeCategory}` : ''}${selectedBrands ? `&branch=${selectedBrands}` : ''}`}
                    className={`block px-4 py-2 rounded-md ${activePriceRange === '0-50' ? 'bg-blue-100' : 'bg-gray-200'}`}
                >
                    $0 - $50
                </Link>
                <Link
                    href={`/?price=51-100${activeCategory ? `&category=${activeCategory}` : ''}${selectedBrands ? `&branch=${selectedBrands}` : ''}`}
                    className={`block px-4 py-2 rounded-md ${activePriceRange === '51-100' ? 'bg-blue-100' : 'bg-gray-200'}`}
                >
                    $51 - $100
                </Link>
                <Link
                    href={`/?price=101-200${activeCategory ? `&category=${activeCategory}` : ''}${selectedBrands ? `&branch=${selectedBrands}` : ''}`}
                    className={`block px-4 py-2 rounded-md ${activePriceRange === '101-200' ? 'bg-blue-100' : 'bg-gray-200'}`}
                >
                    $101 - $200
                </Link>
                <Link
                    href={`/?price=200+${activeCategory ? `&category=${activeCategory}` : ''}${selectedBrands ? `&branch=${selectedBrands}` : ''}`}
                    className={`block px-4 py-2 rounded-md ${activePriceRange === '200+' ? 'bg-blue-100' : 'bg-gray-200'}`}
                >
                    $200+
                </Link>
            </div>
            <Link href={clearPriceRangeUrl} className="text-blue-500 hover:underline block">
                Clear Price Range
            </Link>
        </>
    );
};

export default Price;
