// app/[locale]/layout.tsx
import ClientProvider from '@/app/components/Provider/ClientProvider';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ReactNode } from 'react';
// import { LanguageProvider } from '../context/LanguageContext';
import '../globals.scss';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Viper Front',
  description: 'By Monir',
};

interface RootLayoutProps {
  children: ReactNode;
  params: Promise<{
    locale: string;
  }>;
}

export default async function RootLayout({ children, params }: RootLayoutProps) {
  const { locale } = await params;

  return (
    <html lang={locale}>
      <body className={inter.className}>
        {/* <LanguageProvider> */}
        <ClientProvider>{children}</ClientProvider>
        {/* </LanguageProvider> */}
      </body>
    </html>
  );
}
