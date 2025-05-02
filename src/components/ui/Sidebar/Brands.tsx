// components/BrandsList.tsx
import InteractiveBrandFilter from '@/components/ui/Sidebar/InteractiveBrandFilter';
import { brandInt, SidebarParams } from '@/lib/types';
import fetchApi from "@/lib/fetchApi";
import { apiEndpoints } from "@/lib/constants";

const BrandsList = async ({ activeCategory, selectedBrands, searchTerm }: SidebarParams) => {

    // Fetch brand data server-side
    // const response = await getPublicBrands();
    const response = await fetchApi<{ data: brandInt[] }>(apiEndpoints.getPublicBrands);

    // return await fetchApi(apiEndpoints.getPublicBrands())

    const dataset: brandInt[] = response && response.success && Array.isArray(response.data)
        ? response.data
        : [];

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
