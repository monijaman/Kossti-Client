"use client";
import { DEFAULT_LOCALE, LOCALES } from '@/lib/constants';
import React, { useEffect, useState } from 'react';

const LanguageSwitcher = () => {
    const [locale, setLocale] = useState<string>(DEFAULT_LOCALE); // Default locale

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
            }
        } else {
            setLocale(storedLocale); // Use the stored locale if available
        }
    }, []);


    const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newLocale = event.target.value;
        localStorage.setItem('locale', newLocale)
        setLocale(newLocale);

        // Update the cookie (use the same name that middleware expects)
        document.cookie = `locale-preference=${newLocale}; path=/; max-age=${365 * 24 * 60 * 60}; SameSite=Lax`;

        // Use window.location.href instead of router.push for a full page reload
        // This ensures middleware re-reads the cookie and updates locale properly
        const currentUrl = window.location.pathname;
        const pathSegments = currentUrl.split("/");

        // Detect if the first path segment is a valid locale
        const isValidLocale = LOCALES.includes(pathSegments[1]);

        // Replace or prepend the locale in the URL
        if (isValidLocale) {
            pathSegments[1] = newLocale; // Replace the current locale
        } else {
            pathSegments.unshift(newLocale); // Add the new locale as the first segment
        }

        const newPath = pathSegments.join("/");
        // Full page reload to ensure middleware processes the new locale cookie
        window.location.href = newPath;
    };

    return (
        <div className="flex items-center">

            <select
                id="language-select"
                value={locale}
                onChange={handleLanguageChange}
                className="border border-gray-300 rounded-md p-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
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
