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
    }, []);

    return <Provider store={store}>{children}</Provider>;
}
