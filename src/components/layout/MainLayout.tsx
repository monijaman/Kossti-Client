// MainLayout.tsx
import { FC, ReactNode } from 'react';
import AccountDropdown from '@/components/ui/AccountDropdown';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import Navigation from '@/components/ui/Navigation';
import Sidebar from '@/components/ui/Sidebar/Sidebar';

interface MainLayoutProps {
  children: ReactNode;
  sidebarProps?: {
    activeCategory?: string;
    selectedBrands?: string;
    activePriceRange?: string;
    searchTerm?: string;
  };
}

const MainLayout: FC<MainLayoutProps> = ({ children, sidebarProps }) => {

  return (
    <div className="min-h-screen flex flex-col mx-auto">
      <header className="bg-gray-800 text-white p-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">Your Site Title</h1>
        <AccountDropdown />
      </header>


      {/* <div className="w-full max-w-[1600px] mx-auto"> */}

      <Breadcrumbs />
      <Navigation />

      <div className="flex flex-grow">
        <Sidebar {...sidebarProps} />

        <main className="flex-1 bg-white p-4">
          {children}
        </main>
      </div>
      {/* </div> */}

      <footer className="bg-gray-800 text-white p-4 mt-auto">
        <p className="text-center">&copy; 2024 Your Site. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default MainLayout;
