// app/components/ClientProvider.tsx
'use client';

import { setAccessTokenCookie } from '@/lib/utils';
import { store } from '@/redux/store';
import { ReactNode, useEffect } from 'react';
import { Provider } from 'react-redux';

interface ClientProviderProps {
    children: ReactNode;
}

export default function ClientProvider({ children }: ClientProviderProps) {
    useEffect(() => {
        // Sync localStorage token to cookie on app initialization
        const token = localStorage.getItem('token');
        if (token) {
            setAccessTokenCookie(token);
        }
    }, []);

    return <Provider store={store}>{children}</Provider>;
}
