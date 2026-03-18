"use client"
import { useTranslation } from "@/hooks/useLocale";
import Link from "next/link";
import { useParams } from "next/navigation";

const Breadcrumbs: React.FC = () => {
    const params = useParams();
    const locale = (params?.locale as string) || 'en';
    const t = useTranslation(locale);

    return (
        <nav className="bg-kossti-cream px-4 py-2 border-t-2 border-kossti-tan">
            <ol className="flex space-x-2">
                <li><Link href={`/${locale}`} className="text-kossti-dark hover:text-kossti-brown font-medium transition-colors">{t.nav_home || 'Home'}</Link></li>
                <li className="text-kossti-tan">&gt;</li>
                <li className="text-kossti-brown">Current Page</li>
            </ol>
        </nav>
    );
};

export default Breadcrumbs;
