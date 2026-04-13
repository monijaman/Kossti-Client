"use client";
import { DEFAULT_LOCALE, LOCALES } from '@/lib/constants';
import React, { useEffect, useState } from 'react';

interface LanguageSwitcherProps {
    currentLocale?: string;
}

const LanguageSwitcher = ({ currentLocale }: LanguageSwitcherProps) => {
    const [locale, setLocale] = useState<string>(currentLocale || DEFAULT_LOCALE);

    // Load the locale from local storage or cookies when the component mounts
    useEffect(() => {
        const storedLocale = localStorage.getItem('locale');

        if (!storedLocale) {
            // Retrieve country code from cookies if available
            const countryCookie = document.cookie
                .split('; ')
                .find((row) => row.startsWith('country-code='))
                ?.split('=')[1];
            if (countryCookie) {
                const activeLocale = countryCookie.toLowerCase();

                // Set locale in localStorage, update state, and set cookie
                localStorage.setItem('locale', activeLocale);
                setLocale(activeLocale);
                document.cookie = `locale-preference=${activeLocale}; path=/; max-age=${365 * 24 * 60 * 60}; SameSite=Lax`;
                document.cookie = `country-code=${activeLocale}; path=/; max-age=${365 * 24 * 60 * 60}; SameSite=Lax`;
            }
        } else {
            setLocale(storedLocale); // Use the stored locale if available
        }
    }, []);

    useEffect(() => {
        if (currentLocale && LOCALES.includes(currentLocale)) {
            setLocale(currentLocale);
        }
    }, [currentLocale]);


    const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newLocale = event.target.value;
        localStorage.setItem('locale', newLocale)
        setLocale(newLocale);

        // Update the cookie (use the same name that middleware expects)
        document.cookie = `locale-preference=${newLocale}; path=/; max-age=${365 * 24 * 60 * 60}; SameSite=Lax`;
        document.cookie = `country-code=${newLocale}; path=/; max-age=${365 * 24 * 60 * 60}; SameSite=Lax`;

        // Rebuild URL safely, preserving current route and query string
        const segments = window.location.pathname.split('/').filter(Boolean);
        if (segments.length > 0 && LOCALES.includes(segments[0])) {
            segments[0] = newLocale;
        } else {
            segments.unshift(newLocale);
        }

        const newPath = `/${segments.join('/')}`;
        const query = window.location.search || '';
        window.location.href = `${newPath}${query}`;
    };

    return (
        <div className="flex items-center relative z-50 overflow-visible">

            <select
                id="language-select"
                value={locale}
                onChange={handleLanguageChange}
                className="border border-gray-300 rounded-md p-1 md:p-2 text-xs md:text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out z-50 w-14 md:w-auto"
            >
                {LOCALES.map((translation) => (
                    <option key={translation} value={translation}>
                        {translation.toUpperCase()}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default LanguageSwitcher;
