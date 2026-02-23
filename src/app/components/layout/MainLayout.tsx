import { SidebarParams } from '@/lib/types';
import { cookies } from 'next/headers';
import Image from 'next/image';
import Link from 'next/link';
import { ReactNode } from 'react';
import LanguageSwitcher from '../Language/LanguageSwitcher';
import AccountDropdown from '../ui/AccountDropdown';
import Breadcrumbs from '../ui/Breadcrumbs';
import Sidebar from '../ui/Sidebar/Sidebar';

const DEFAULT_LOCALE = 'en';

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
      <header className="bg-gray-100 text-white p-4 flex items-center justify-between">
        <Link href="/" suppressHydrationWarning>
          <Image
            src="/kossti.svg"
            alt="Kosti"
            style={{
              width: "auto",
              height: "90px",
            }}
            width={300}
            height={90}
            className="rounded"
          />
        </Link>
        <div className="ml-auto flex items-center space-x-4">

          <AccountDropdown isAuthenticated={!!accessToken} />
          <LanguageSwitcher />
        </div>
      </header>

      <Breadcrumbs />
      <div className="flex flex-grow">
        <Sidebar {...sidebarProps} />

        <main className="flex-1 bg-white p-4">
          {children}
        </main>
      </div>

      <footer className="bg-gray-800 text-white p-4 text-center">
        <p>&copy; 2026 Kosti. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default MainLayout;
