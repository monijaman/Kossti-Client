import { DEFAULT_LOCALE } from '@/lib/constants';
import { SidebarParams } from '@/lib/types';
import { cookies } from 'next/headers';
import Image from 'next/image';
import Link from 'next/link';
import { ReactNode } from 'react';
import LanguageSwitcher from '../Language/LanguageSwitcher';
import AccountDropdown from '../ui/AccountDropdown';
import Breadcrumbs from '../ui/Breadcrumbs';
import Sidebar from '../ui/Sidebar/Sidebar';

interface MainLayoutProps {
  children: ReactNode;
  sidebarProps?: SidebarParams;
}

const MainLayout = async ({ children, sidebarProps }: MainLayoutProps) => {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('accessToken')?.value; // Default to 'en' if not found
  const countryCode = cookieStore.get('country-code')?.value || DEFAULT_LOCALE;
  return (
    <div className="min-h-screen flex flex-col mx-auto" suppressHydrationWarning>
      <header className="bg-gray-100 text-white px-2 md:px-4 py-2 md:py-3 flex flex-col md:flex-row items-start md:items-center md:justify-between gap-2 md:gap-4 relative z-40 overflow-visible">
        <Link href="/" suppressHydrationWarning className="flex-shrink-0">
          <Image
            src="/logo.png"
            alt="Kosti"
            style={{
              width: "auto",
              height: "auto",
            }}
            width={500}
            height={170}
            className="rounded h-10 sm:h-12 md:h-16 lg:h-20 w-auto"
          />
        </Link>
        <div className="w-full md:w-auto md:ml-auto flex flex-row items-center justify-end gap-2 md:gap-4 relative z-50 overflow-visible">

          <AccountDropdown isAuthenticated={!!accessToken} />
          <LanguageSwitcher />
        </div>
      </header>

      <Breadcrumbs />
      <div className="flex flex-col md:flex-row flex-grow">
        <Sidebar {...sidebarProps} />

        <main className="flex-1 bg-white p-3 md:p-4 lg:p-6">
          {children}
        </main>
      </div>

      <footer className="bg-gray-800 text-white p-4 text-center">
        <p>&copy; <Link href={"https://portfolio-three-theta-ephz9pve2c.vercel.app/"}>  2026 Kosti. All rights reserved by Monir</Link> </p>
      </footer>
    </div>
  );
};

export default MainLayout;
