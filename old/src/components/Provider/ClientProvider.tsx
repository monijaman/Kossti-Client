// app/components/ClientProvider.tsx
'use client';

import { store } from '@/redux/store';
import { ReactNode } from 'react';
import { Provider } from 'react-redux';

interface ClientProviderProps {
    children: ReactNode;
}

export default function ClientProvider({ children }: ClientProviderProps) {
    return <Provider store={store}>{children}</Provider>;
}
