// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';


// import './globals.css';
import Sidebar from '@/components/admin/Sidebar';
import AccountDropdown from '@/components/ui/AccountDropdown'; // Import your account dropdown or user info component
import Navigation from '@/components/ui/Navigation'; // A navigation component for admin
import { cookies } from 'next/headers';
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Viper Front',
  description: 'By Monir dev',
};

interface AdminLayoutProps {
  children: React.ReactNode; // Children components
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const accessToken = cookies().get('theAccessToken')?.value; // Default to 'en' if not found

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-gray-800 text-white p-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">Admin Panel</h1>
        <AccountDropdown isAuthenticated={!!accessToken} />

      </header>

      <Navigation />

      <div className="flex flex-grow">
        <Sidebar />

        <main className="flex-1 bg-white p-4">
          {children}
        </main>
      </div>

      <footer className="bg-gray-800 text-white p-4 mt-auto">
        <p className="text-center">&copy; 2024 Your Site. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default AdminLayout;