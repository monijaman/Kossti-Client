import { DEFAULT_LOCALE } from '@/lib/constants';
import { cookies } from 'next/headers';
import { ReactNode } from 'react';
import MainLayout from './MainLayout';

interface PageWrapperProps {
    children: ReactNode;
    searchParams: Record<string, string | string[] | undefined>;
}

interface SearchParams {
    category?: string;
    brand?: string;
    price?: string;
    searchterm?: string | string[];
}

export default async function PageWrapper({ children, searchParams }: PageWrapperProps) {
    const cookieStore = cookies();
    const accessToken = (await cookieStore).get('accessToken')?.value || null;
    const countryCode = (await cookieStore).get('country-code')?.value || DEFAULT_LOCALE;
    // const searchParams = (await cookieStore).get('searchParams')?.value as SearchParams || {};

    // Type assertion for searchParams to have the correct shape
    const activeCategory = Array.isArray(searchParams.category)
        ? searchParams.category.join(',')
        : searchParams.category || '';

    const activeBrands = Array.isArray(searchParams.brand)
        ? searchParams.brand.join(',')
        : searchParams.brand || '';

    const activePriceRange = Array.isArray(searchParams.price)
        ? searchParams.price.join(',')
        : searchParams.price || '';

    const searchTerm = Array.isArray(searchParams.searchterm)
        ? searchParams.searchterm.join(',')
        : searchParams.searchterm || '';

    // Dynamically populate sidebarProps from searchParams
    const sidebarProps = {
        activeCategory,
        activeBrands,
        activePriceRange,
        searchTerm,
    };

    console.log('ddd', accessToken)

    return (
        <MainLayout accessToken={accessToken} countryCode={countryCode} sidebarProps={sidebarProps}>
            33333333333 {searchParams.category}  {children}
        </MainLayout>
    );
}
