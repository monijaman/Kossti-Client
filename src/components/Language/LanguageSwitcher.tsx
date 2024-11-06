"use client"
import { LOCALES } from '@/lib/constants';
// Uncomment the following line if you're using a context for managing language state
// import { useLanguage } from '@/context/LanguageContext';
import React, { useEffect, useState } from 'react';

const LanguageSwitcher = () => {
    // Uncomment if using LanguageContext
    // const { locale, setLocale } = useLanguage();

    // Local state for the language selection
    const [locale, setLocale] = useState<string>('en'); // Default locale

    // Load the locale from local storage when the component mounts
    useEffect(() => {
        const storedLocale = localStorage.getItem('locale');
        if (storedLocale) {
            setLocale(storedLocale);
        }
    }, []);

    const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newLocale = event.target.value;
        setLocale(newLocale);
        localStorage.setItem('locale', newLocale); // Save the locale in local storage
        // Uncomment if using LanguageContext
        // setLocale(newLocale);
    };

    return (
        <div className="flex items-center">
            <label htmlFor="language-select" className="block mb-2 text-gray-700 mr-2">
                Select Language:
            </label>
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
