// app/[locale]/layout.tsx
import ClientProvider from '@/app/components/Provider/ClientProvider';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import { ReactNode } from 'react';
// import { LanguageProvider } from '../context/LanguageContext';
import '../globals.scss';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Kossti - Review Platform',
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
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-8JP2X3MRQ5"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-8JP2X3MRQ5');
          `}
        </Script>
      </head>
      <body className={inter.className}>
        {/* <LanguageProvider> */}
        <ClientProvider>{children}</ClientProvider>
        {/* </LanguageProvider> */}
      </body>
    </html>
  );
}
