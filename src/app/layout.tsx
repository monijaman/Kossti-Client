import ClientProvider from '@/app/components/Provider/ClientProvider';
import type { Metadata, Viewport } from 'next';
import { Inter, Poppins } from 'next/font/google';
import Script from 'next/script';
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
    canonical: '/en',
    languages: {
      'x-default': '/en',
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
  openGraph: {
    title: 'Kossti - Honest Product Reviews & Comparisons',
    description: 'Compare products and read honest reviews, specifications, prices, pros and cons before you buy.',
    siteName: 'Kossti',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Kossti honest product reviews' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kossti - Honest Product Reviews & Comparisons',
    description: 'Compare products and read honest reviews before you buy.',
    images: ['/og-image.png'],
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
    <html lang="en" suppressHydrationWarning style={{
      // @ts-ignore
      '--font-poppins': poppins.style.fontFamily
    } as React.CSSProperties}>
      <head>
        {/* Warm up the DNS/TLS connection to the S3 image host ahead of time.
            Product pages fire many concurrent image requests to this origin
            on first paint; without a pre-established connection, that burst
            of simultaneous first-time connections can fail/time out on the
            initial load and only succeed on reload once the connection is warm. */}
        <link rel="preconnect" href="https://kossti-review.s3.ap-south-1.amazonaws.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://kossti-review.s3.ap-south-1.amazonaws.com" />
      </head>
      <body className={inter.className}>
        <ClientProvider>
          {children}
        </ClientProvider>
        {/* Honeypot: invisible to real users (hidden from screen readers,
            unreachable by tab/mouse), only followed by bots that parse
            every <a href> in the raw DOM. See middleware.ts HONEYPOT_PATH. */}
        <a
          href="/products-full-export"
          aria-hidden="true"
          tabIndex={-1}
          style={{
            position: "absolute",
            width: 1,
            height: 1,
            margin: -1,
            padding: 0,
            overflow: "hidden",
            clip: "rect(0,0,0,0)",
            whiteSpace: "nowrap",
            border: 0,
          }}
        >
          Full product export
        </a>
        {allowIndexing && <Analytics />}
        {allowIndexing && (
          <Script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8172172530139900"
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  )
}
