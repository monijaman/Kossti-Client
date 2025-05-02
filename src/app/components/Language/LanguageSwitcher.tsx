"use client";
import { DEFAULT_LOCALE, LOCALES } from '@/lib/constants';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const LanguageSwitcher = () => {
    const [locale, setLocale] = useState<string>(DEFAULT_LOCALE); // Default locale
    const router = useRouter();

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
                document.cookie = `country-code=${activeLocale}; path=/`; // Set cookie with path for the entire site


                // Use a slight delay to allow the server to read the cookie
                setTimeout(() => {
                    router.refresh();
                }, 100); // Delay by 100ms


            }
        } else {
            setLocale(storedLocale); // Use the stored locale if available
        }
    }, []);


    const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newLocale = event.target.value;
        localStorage.setItem('locale', newLocale)
        setLocale(newLocale);

        // Update the cookie
        document.cookie = `country-code=${newLocale}; path=/`;

        // Use window.location to manage the URL dynamically
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
        router.push(newPath); // Navigate to the updated path
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
