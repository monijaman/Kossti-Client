"use client";

import Sidebar from '@/app/components/admin/Sidebar';
import AccountDropdown from '@/app/components/ui/AccountDropdown';
import Navigation from '@/app/components/ui/Navigation';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

interface AdminLayoutClientProps {
    children: ReactNode;
    accessToken?: string;
}

const AdminLayoutClient = ({ children, accessToken }: AdminLayoutClientProps) => {
    const pathname = usePathname();
    const isLoginPage = pathname.startsWith('/admin/login');

    if (isLoginPage) {
        return <>{children}</>;
    }

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

export default AdminLayoutClient;
