// app/[locale]/layout.tsx
import ClientProvider from '@/app/components/Provider/ClientProvider';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import { ReactNode } from 'react';
// import { LanguageProvider } from '../context/LanguageContext';
import '../globals.scss';

const inter = Inter({ subsets: ['latin'] });

interface RootLayoutProps {
  children: ReactNode;
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({ params }: RootLayoutProps): Promise<Metadata> {
  const { locale } = await params;
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://kossti.com';

  return {
    title: 'Kossti - Honest Product Reviews & Comparisons | Best Tech Reviews',
    description: 'Get honest, unbiased reviews of mobiles, electronics, and tech products. Compare prices, features, and specifications to make informed buying decisions. Trusted reviews in English and Bengali.',
    keywords: 'product reviews, mobile reviews, tech reviews, electronics, comparison, buying guide, honest reviews, bangladesh, bengali reviews',
    authors: [{ name: 'Kossti Team' }],
    creator: 'Kossti',
    publisher: 'Kossti',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: `/${locale}`,
      languages: {
        'x-default': '/',
        'en-US': '/en',
        'en': '/en',
        'bn-BD': '/bn',
        'bn': '/bn',
      },
    },
    openGraph: {
      title: 'Kossti - Honest Product Reviews & Comparisons',
      description: 'Get honest, unbiased reviews of mobiles, electronics, and tech products. Compare prices, features, and specifications.',
      url: SITE_URL,
      siteName: 'Kossti',
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: 'Kossti - Product Reviews Platform',
        },
      ],
      locale: locale === 'en' ? 'en_US' : 'bn_BD',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Kossti - Honest Product Reviews & Comparisons',
      description: 'Get honest, unbiased reviews of mobiles, electronics, and tech products.',
      images: ['/og-image.png'],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
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
