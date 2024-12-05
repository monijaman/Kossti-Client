import { getPublicBrands } from '@/app/ServerCalls/fetchPublicBrands';
import InteractiveBrandFilter from '@/components/ui/Sidebar/InteractiveBrandFilter';
import { brandInt, SidebarParams } from '@/lib/types';
const BrandsList = async ({ activeCategory, selectedBrands, searchTerm }: SidebarParams) => {

    // Fetch brand data server-side
    const response = await getPublicBrands();
    const dataset: brandInt[] = response.success ? response.data : [];

    // Convert the selectedBrands and activeCategory to the appropriate format
    const brands = selectedBrands ? selectedBrands : '';
    const categories = activeCategory || '';
    const searchterm = searchTerm || '';
    return (
        <div>
            <h2 className="text-lg font-semibold mb-4">Brands</h2>
            <InteractiveBrandFilter
                dataset={dataset}
                selectedBrands={brands}
                activeCategory={categories}
                searchTerm={searchterm}
            />
        </div>
    );
};

export default BrandsList;
