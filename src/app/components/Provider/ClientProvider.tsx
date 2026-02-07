// app/components/ClientProvider.tsx
'use client';
import { store } from '@/redux/store';
import { ReactNode, useEffect } from 'react';
import { Provider } from 'react-redux';

interface ClientProviderProps {
    children: ReactNode;
}

export default function ClientProvider({ children }: ClientProviderProps) {
    useEffect(() => {
        // NOTE: Disabled localStorage sync because it was causing logout tokens to reappear
        // after page refresh. Logout handler now properly clears localStorage.
        // If needed for session persistence, implement a more secure token storage solution.
        // const token = localStorage.getItem('token');
        // if (token) {
        //     setAccessTokenCookie(token);
        // }

        // Sync locale preference from localStorage to cookie for middleware
        const locale = localStorage.getItem('locale');
        if (locale) {
            // Check if cookie already exists
            const cookieExists = document.cookie
                .split('; ')
                .some(row => row.startsWith('locale-preference='));

            if (!cookieExists) {
                console.log('Syncing locale from localStorage to cookie:', locale);
                document.cookie = `locale-preference=${locale}; path=/; max-age=${365 * 24 * 60 * 60}; SameSite=Lax`;

                // Refresh the page to let middleware handle the locale routing
                window.location.reload();
            }
        }
    }, []);

    return <Provider store={store}>{children}</Provider>;
}
