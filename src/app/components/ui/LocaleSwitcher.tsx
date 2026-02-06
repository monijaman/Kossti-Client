'use client';

import { getLocaleFromPath, setLocalePreference } from '@/lib/localeUtils';
import { usePathname } from 'next/navigation';

interface LocaleSwitcherProps {
    className?: string;
}

const LocaleSwitcher = ({ className = '' }: LocaleSwitcherProps) => {
    const pathname = usePathname();
    const currentLocale = getLocaleFromPath(pathname);

    const handleLocaleChange = (newLocale: string) => {
        if (newLocale !== currentLocale) {
            setLocalePreference(newLocale);
        }
    };

    return (
        <div className={`flex items-center space-x-2 ${className}`}>
            <button
                onClick={() => handleLocaleChange('bn')}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${currentLocale === 'bn'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
            >
                বাংলা
            </button>
            <button
                onClick={() => handleLocaleChange('en')}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${currentLocale === 'en'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
            >
                English
            </button>
        </div>
    );
};

export default LocaleSwitcher;