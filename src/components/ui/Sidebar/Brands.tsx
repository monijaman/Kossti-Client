// components/BrandsList.tsx
import { useBrands } from '@/hooks/useBrands';
import InteractiveBrandFilter from '@/components/ui/Sidebar/InteractiveBrandFilter';
 
interface brandInt {
    id: number;
    name: string;
    priority: number;
    deleted_at: null;
    created_at: string;
    updated_at: string;
}

interface SearchParams {
    category?: string;
    brand?: string;
}

const BrandsList = async ({ category, brand }: SearchParams) => {
    const { getBrands } = useBrands();

    // Fetch brand data server-side
    const response = await getBrands();
    const dataset: brandInt[] = response.success ? response.data : [];

    const activeCategory = category || '';
    const selectedBrands = brand ? brand.split(',') : [];

    return (
        <div>
            <h2 className="text-lg font-semibold mb-4">Brands</h2>
            <InteractiveBrandFilter
                dataset={dataset}
                selectedBrands={selectedBrands}
                activeCategory={activeCategory}
            />
        </div>
    );
};

export default BrandsList;
