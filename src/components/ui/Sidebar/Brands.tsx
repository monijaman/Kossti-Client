// components/BrandsList.tsx
import InteractiveBrandFilter from '@/components/ui/Sidebar/InteractiveBrandFilter';
import { useBrands } from '@/hooks/useBrands';
import { useTranslation } from "@/hooks/useLocale";
import { DEFAULT_LOCALE } from '@/lib/constants';
import { brandInt, SidebarParams } from '@/lib/types';
import { cookies } from 'next/headers';

const BrandsList = async ({ activeCategory, selectedBrands, searchTerm }: SidebarParams) => {
    const { getPublicBrands } = useBrands();
    const countryCode = cookies().get('country-code')?.value || DEFAULT_LOCALE; // Default to 'en' if not found

    const translation = useTranslation(countryCode);

    // Fetch brand data server-side
    const response = await getPublicBrands();
    const dataset: brandInt[] = response.success ? response.data : [];

    // Convert the selectedBrands and activeCategory to the appropriate format
    const brands = selectedBrands ? selectedBrands : '';
    const categories = activeCategory || '';
    const searchterm = searchTerm || '';
    return (
        <div>
            <h2 className="text-lg font-semibold mb-4">{translation.brand}</h2>
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
