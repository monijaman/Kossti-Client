// MainLayout.tsx
import LanguageSwitcher from '@/components/Language/LanguageSwitcher';
import AccountDropdown from '@/components/ui/AccountDropdown';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import Sidebar from '@/components/ui/Sidebar/Sidebar';
import { useTranslation } from "@/hooks/useLocale";
import { DEFAULT_LOCALE } from '@/lib/constants';
import { cookies } from 'next/headers';
import { ReactNode } from 'react';
interface MainLayoutProps {
  children: ReactNode;
  sidebarProps?: {
    activeCategory?: string;
    selectedBrands?: string;
    activePriceRange?: string;
    searchTerm?: string;
  };
}

const MainLayout = ({ children, sidebarProps }: MainLayoutProps) => {

  const accessToken = cookies().get('accessToken')?.value; // Default to 'en' if not found
  const countryCode = cookies().get('country-code')?.value || DEFAULT_LOCALE; // Default to 'en' if not found
  const translation = useTranslation(countryCode);
  return (
    <div className="min-h-screen flex flex-col mx-auto">
      <header className="bg-gray-800 text-white p-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">CritBrit   </h1>
        <div className="ml-auto flex items-center space-x-4">

          <AccountDropdown isAuthenticated={!!accessToken} />
          <LanguageSwitcher />
        </div>
      </header>

      {/* <div className="w-full max-w-[1600px] mx-auto"> */}
      <Breadcrumbs />
      {/* <Navigation /> */}

      <div className="flex flex-grow">
        <Sidebar {...sidebarProps} />

        <main className="flex-1 bg-white p-4">
          {children}
        </main>
      </div>
      {/* </div> */}

      <footer className="bg-gray-800 text-white p-4 mt-auto">
        <p className="text-center">&copy; {translation.copyright}</p>
      </footer>
    </div>
  );
};

export default MainLayout;
