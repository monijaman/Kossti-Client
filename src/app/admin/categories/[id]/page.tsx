import CategoryBrandsClient from './CategoryBrandsClient';
import fetchApi from '@/lib/fetchApi';
import { apiEndpoints } from '@/lib/constants';
import { Category } from '@/lib/types';

interface PageProps {
    params: { id: string };
}

export default async function Page({ params }: PageProps) {
    // server-side fetch categories to preselect the option and avoid client flicker
    let categoriesFromServer: Category[] = [];
   
    try {
        const res = await fetchApi(apiEndpoints.getWideCategories, {
            queryParams: { per_page: 100, paginate: 'false' },
        });

        if (res && res.success) {
            const d: unknown = res.data;
            if (Array.isArray(d)) categoriesFromServer = d as Category[];
            else if (typeof d === 'object' && d !== null) {
                const obj = d as Record<string, unknown>;
                if (Array.isArray(obj.categories)) categoriesFromServer = obj.categories as Category[];
                else if (obj.data && typeof obj.data === 'object' && Array.isArray((obj.data as Record<string, unknown>).categories)) categoriesFromServer = (obj.data as Record<string, unknown>).categories as Category[];
                else categoriesFromServer = [];
            }
        }
    } catch (err) {
        // swallow; client fallback exists
        console.error('Server fetch categories failed:', err);
    }

    const category_id = params?.id ?? undefined;
    const numericCategoryId = category_id ? Number(category_id) : null;

    return (
        <CategoryBrandsClient
            numericCategoryId={numericCategoryId}
            categoriesFromServer={categoriesFromServer}
        />
    );
}
