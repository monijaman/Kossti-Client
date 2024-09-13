// components/InteractiveBrandFilter.tsx
'use client';

import { useState } from 'react';

interface brandInt {
    id: number;
    name: string;
}

interface FilterProps {
    dataset: brandInt[];
    selectedBrands: string[];
    activeCategory: string;
}

const InteractiveBrandFilter = ({ dataset, selectedBrands, activeCategory }: FilterProps) => {
    const [selected, setSelected] = useState<string[]>(selectedBrands);

    const handleBrandChange = (brandName: string) => {
        setSelected((prevSelected) =>
            prevSelected.includes(brandName)
                ? prevSelected.filter((name) => name !== brandName)
                : [...prevSelected, brandName]
        );
    };

    const cleanUrl = `/?${activeCategory ? `category=${activeCategory}` : ''}${selected.length ? `&brand=${selected.join(',')}` : ''
        }`;

    return (
        <>
            <div className="mb-4">
                {dataset.map((brand: brandInt) => (
                    <div key={brand.id} className="flex items-center mb-2">
                        <input
                            type="checkbox"
                            id={`brand-${brand.id}`}
                            checked={selected.includes(brand.name)}
                            onChange={() => handleBrandChange(brand.name)}
                            className="mr-2"
                        />
                        <label htmlFor={`brand-${brand.id}`} className="cursor-pointer">
                            {brand.name}
                        </label>
                    </div>
                ))}
            </div>

            <a href={cleanUrl} className="text-blue-500 hover:underline mb-4 block">
                Apply Filters
            </a>
            <a href="/" className="text-blue-500 hover:underline mb-4 block">
                Clear Categories
            </a>
        </>
    );
};

export default InteractiveBrandFilter;
