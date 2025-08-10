import { DEFAULT_LOCALE } from '@/lib/constants';
import { redirect } from 'next/navigation';

export default function RootPage() {
    // Redirect to default locale
    redirect(`/${DEFAULT_LOCALE}`);
}
