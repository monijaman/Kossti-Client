"use client"
import { useTranslation } from "@/hooks/useLocale";
import Link from "next/link";
import { useParams } from "next/navigation";

const Breadcrumbs: React.FC = () => {
    const params = useParams();
    const locale = (params?.locale as string) || 'en';
    const t = useTranslation(locale);

    return (
        <nav className="bg-gray-200 px-4 py-1 border-t-1 border-gray-800">
            <ol className="flex space-x-2">
                <li><Link href={`/${locale}`} className="text-blue-600 hover:underline">{t.nav_home || 'Home'}</Link></li>
                <li>&gt;</li>
                <li className="text-gray-600">Current Page</li>
            </ol>
        </nav>
    );
};

export default Breadcrumbs;
