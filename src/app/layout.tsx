import ClientProvider from '@/app/components/Provider/ClientProvider';
import type { Metadata, Viewport } from 'next';
import { Inter, Poppins } from 'next/font/google';
// Ensure globals.scss is imported for Tailwind CSS
import './globals.scss';

const inter = Inter({ subsets: ['latin'] });
const poppins = Poppins({
  weight: ['400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  variable: '--font-poppins',
})

export const metadata: Metadata = {
  title: 'Kossti - Honest Product Reviews & Comparisons',
  description: 'Read honest, unbiased product reviews and expert comparisons. Find the best products with detailed analysis, ratings, and user feedback.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://kossti.com'),
  icons: {
    icon: [
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon.ico' },
    ],
    apple: { url: '/apple-touch-icon.png', sizes: '180x180' },
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
      </body>
    </html>
  )
}
