import CategoryBrandsClient from './CategoryBrandsClient';

interface PageProps {
    params: { id: string };
}

export default function Page({ params }: PageProps) {
    return <CategoryBrandsClient params={params} />;
}
