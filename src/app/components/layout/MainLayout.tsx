import { SidebarParams } from '@/lib/types';
import Image from 'next/image';
import Link from 'next/link';
import { ReactNode } from 'react';
import LanguageSwitcher from '../Language/LanguageSwitcher';
import Sidebar from '../ui/Sidebar/Sidebar';

// const DEFAULT_LOCALE = 'en';

interface MainLayoutProps {
  children: ReactNode;
  sidebarProps?: SidebarParams;
}

const MainLayout = async ({ children, sidebarProps }: MainLayoutProps) => {
  // const cookieStore = await cookies()
  // const countryCode = cookieStore.get('country-code')?.value || DEFAULT_LOCALE;

  return (
    <div className="min-h-screen flex flex-col mx-auto">
      <header className="bg-gray-100 text-white p-4 flex items-center justify-between">
        <Link href="/">
          <Image
            src="/kossti.png"
            alt="Kosti"
            width={100}
            height={40}
            className="cursor-pointer"
          />
        </Link>
        <div className="text-black">
          <LanguageSwitcher />
        </div>
      </header>

      <div className="flex flex-1">
        {sidebarProps && <Sidebar {...sidebarProps} />}
        <main className="flex-1 p-4">
          {children}
        </main>
      </div>

      <footer className="bg-gray-800 text-white p-4 text-center">
        <p>&copy; 2024 Kosti. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default MainLayout;
