// app/layout.tsx
import ClientProvider from '@/components/Provider/ClientProvider';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ReactNode } from 'react';
// import { LanguageProvider } from '../context/LanguageContext';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Viper Front',
  description: 'By Monir',
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* <LanguageProvider> */}

        <ClientProvider>{children}</ClientProvider>
        {/* </LanguageProvider> */}
      </body>
    </html>
  );
}
