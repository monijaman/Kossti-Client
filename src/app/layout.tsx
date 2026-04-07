import ClientProvider from '@/app/components/Provider/ClientProvider';
import type { Metadata, Viewport } from 'next';
import { Inter, Poppins } from 'next/font/google';
// Ensure globals.scss is imported for Tailwind CSS
import './globals.scss';
import { Analytics } from "@vercel/analytics/next"
const inter = Inter({ subsets: ['latin'] });
const poppins = Poppins({
  weight: ['400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  variable: '--font-poppins',
})

const allowIndexing = process.env.NEXT_PUBLIC_ALLOW_INDEXING === 'true';

export const metadata: Metadata = {
  title: 'Kossti - Honest Product Reviews & Comparisons',
  description: 'Read honest, unbiased product reviews and expert comparisons. Find the best products with detailed analysis, ratings, and user feedback.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://kossti.com'),
  // Block indexing on develop branch
  ...((!allowIndexing) && {
    robots: {
      index: false,
      follow: false,
      nocache: true,
      googleBot: {
        index: false,
        follow: false,
        noimageindex: true,
      },
    },
  }),
  alternates: {
    canonical: '/',
    languages: {
      'x-default': '/',
      'en-US': '/en',
      'en': '/en',
      'bn-BD': '/bn',
      'bn': '/bn',
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
    other: [
      {
        rel: 'icon',
        url: '/favicon-32x32.png',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        rel: 'icon',
        url: '/favicon-16x16.png',
        sizes: '16x16',
        type: 'image/png',
      },
      {
        rel: 'manifest',
        url: '/site.webmanifest',
      },
    ],
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1f2937', // gray-800
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" style={{
      // @ts-ignore
      '--font-poppins': poppins.style.fontFamily
    } as React.CSSProperties}>
      <body className={inter.className}>
        <ClientProvider>
          {children}
        </ClientProvider>
        {allowIndexing && <Analytics />}
      </body>
    </html>
  )
}
