"use client";

import Sidebar from '@/app/components/admin/Sidebar';
import AccountDropdown from '@/app/components/ui/AccountDropdown';
import Navigation from '@/app/components/ui/Navigation';
import { usePathname } from 'next/navigation';
import { ReactNode, useState } from 'react';

interface AdminLayoutClientProps {
    children: ReactNode;
    accessToken?: string;
}

const AdminLayoutClient = ({ children, accessToken }: AdminLayoutClientProps) => {
    const pathname = usePathname();
    const isLoginPage = pathname.startsWith('/admin/login');
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Always show clean layout for login page, regardless of accessToken
    if (isLoginPage) {
        return <>{children}</>;
    }

    // For all other admin pages, show full layout
    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            <header className="bg-gray-800 text-white p-3 sm:p-4 flex items-center justify-between sticky top-0 z-40">
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="lg:hidden p-2 hover:bg-gray-700 rounded transition-colors"
                    aria-label="Toggle sidebar"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
                <h1 className="text-lg sm:text-xl font-bold">Admin Panel</h1>
                <AccountDropdown isAuthenticated={!!accessToken} />
            </header>

            <Navigation />

            <div className="flex flex-grow overflow-hidden">
                {/* Sidebar - Hidden on mobile, visible on lg and above */}
                <div className={`fixed lg:relative z-30 inset-y-0 left-0 w-64 transform lg:transform-none transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
                    <Sidebar onClose={() => setSidebarOpen(false)} />
                </div>

                {/* Mobile backdrop */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-20"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                <main className="flex-1 overflow-auto bg-white">
                    <div className="p-3 sm:p-4 md:p-6">
                        {children}
                    </div>
                </main>
            </div>

            <footer className="bg-gray-800 text-white p-3 sm:p-4 mt-auto text-center text-sm sm:text-base">
                <p>&copy; 2024 Your Site. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default AdminLayoutClient;
