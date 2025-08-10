import { Inter } from 'next/font/google';
// Ensure globals.scss is imported for Tailwind CSS
import './globals.scss';

// ...existing code...

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'KOSTI - Your trusted marketplace',
  description: 'Find the best products at KOSTI marketplace',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
