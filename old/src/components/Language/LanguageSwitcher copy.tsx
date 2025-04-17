"use client";
import { LOCALES } from '@/lib/constants';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const LanguageSwitcher = () => {
    const [locale, setLocale] = useState<string>('en'); // Default locale
    const router = useRouter();

    // Load the locale from local storage or cookies when the component mounts
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedLocale = localStorage.getItem('locale');

            if (!storedLocale) {
                // Retrieve country code from cookies if available
                const countryCookie = document.cookie
                    .split('; ')
                    .find((row) => row.startsWith('country-code='))
                    ?.split('=')[1];

                if (countryCookie) {
                    let activeLocale = countryCookie.toLowerCase();

                    // Set locale in localStorage, update state, and set cookie
                    localStorage.setItem('locale', activeLocale);
                    setLocale(activeLocale);
                    document.cookie = `country-code=${activeLocale}; path=/`;

                    // Use a slight delay to allow the server to read the cookie
                    setTimeout(() => {
                        router.push(`/${activeLocale}`);
                    }, 100); // Delay by 100ms

                }
            } else {
                setLocale(storedLocale); // Use the stored locale if available
            }
        }
    }, []);

    const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newLocale = event.target.value;
        setLocale(newLocale);
        localStorage.setItem('locale', newLocale);

        // Update the cookie when language is changed
        document.cookie = `country-code=${newLocale}; path=/`; // Sets cookie for the entire site

        // Navigate to the selected locale's route
        router.push(`/${newLocale}`);
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
