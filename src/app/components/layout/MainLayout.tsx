import { SidebarParams } from '@/lib/types';
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
  isAuthenticated?: boolean;
}

const MainLayout = ({ children, sidebarProps, isAuthenticated = false }: MainLayoutProps) => {
  const locale = sidebarProps?.countryCode || 'bn';
  const withLocale = (path: string) => `/${locale}${path}`;

  return (
    <div className="min-h-screen flex flex-col mx-auto" suppressHydrationWarning>
      <header className="bg-gray-100 text-white px-2 md:px-4 py-2 md:py-3 flex flex-col md:flex-row items-start md:items-center md:justify-between gap-2 md:gap-4 relative z-40 overflow-visible">
        <Link href={withLocale('')} suppressHydrationWarning className="flex-shrink-0">
          <Image
            src="/logo.png"
            alt="Kosti"
            style={{
              width: "auto",
              height: "80px",
            }}
            width={500}
            height={170}
            className="rounded w-auto"
          />
        </Link>
        <div className="w-full md:w-auto md:ml-auto flex flex-row items-center justify-end gap-2 md:gap-4 relative z-50 overflow-visible">

          <AccountDropdown isAuthenticated={isAuthenticated} />
          <LanguageSwitcher currentLocale={locale} />
        </div>
      </header>

      <Breadcrumbs />
      <div className="flex flex-col md:flex-row flex-grow">
        <Sidebar {...sidebarProps} />

        <main className="flex-1 bg-white p-3 md:p-4 lg:p-6">
          {children}
        </main>
      </div>

      <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-12 px-4 border-t-4 border-blue-600">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {/* Column 1: About Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Kossti</h3>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">
                Your trusted source for honest, detailed product reviews and comparisons. Making informed decisions easier.
              </p>
              <div className="flex space-x-3 pt-2">
                <a href="#" className="bg-gray-700 hover:bg-blue-600 p-2 rounded-lg transition-colors" aria-label="Facebook">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="#" className="bg-gray-700 hover:bg-blue-600 p-2 rounded-lg transition-colors" aria-label="Twitter">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
                <a href="#" className="bg-gray-700 hover:bg-blue-600 p-2 rounded-lg transition-colors" aria-label="YouTube">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div>
              <h3 className="text-lg font-bold mb-4 text-white flex items-center">
                <span className="bg-blue-600 w-1 h-6 mr-2 rounded"></span>
                Quick Links
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link href={withLocale('')} className="text-gray-300 hover:text-blue-400 transition-colors text-sm flex items-center group">
                    <svg className="w-4 h-4 mr-2 text-blue-600 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    Home
                  </Link>
                </li>
                <li>
                  <Link href={withLocale('/about')} className="text-gray-300 hover:text-blue-400 transition-colors text-sm flex items-center group">
                    <svg className="w-4 h-4 mr-2 text-blue-600 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href={withLocale('/contact')} className="text-gray-300 hover:text-blue-400 transition-colors text-sm flex items-center group">
                    <svg className="w-4 h-4 mr-2 text-blue-600 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href={withLocale('/disclaimer')} className="text-gray-300 hover:text-blue-400 transition-colors text-sm flex items-center group">
                    <svg className="w-4 h-4 mr-2 text-blue-600 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    Disclaimer
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Legal */}
            <div>
              <h3 className="text-lg font-bold mb-4 text-white flex items-center">
                <span className="bg-blue-600 w-1 h-6 mr-2 rounded"></span>
                Legal
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link href={withLocale('/privacy-policy')} className="text-gray-300 hover:text-blue-400 transition-colors text-sm flex items-center group">
                    <svg className="w-4 h-4 mr-2 text-blue-600 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href={withLocale('/terms')} className="text-gray-300 hover:text-blue-400 transition-colors text-sm flex items-center group">
                    <svg className="w-4 h-4 mr-2 text-blue-600 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    Terms of Service
                  </Link>
                </li>
                <li className="pt-4 border-t border-gray-700">
                  <div className="flex items-center space-x-2 text-xs text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span>Your data is protected</span>
                  </div>
                </li>
              </ul>
            </div>

            {/* Column 4: Contact Info */}
            <div>
              <h3 className="text-lg font-bold mb-4 text-white flex items-center">
                <span className="bg-blue-600 w-1 h-6 mr-2 rounded"></span>
                Get in Touch
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Email</p>
                    <a href="mailto:monir0space@gmail.com" className="text-gray-300 hover:text-blue-400 transition-colors text-sm">
                      monir0space@gmail.com
                    </a>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Location</p>
                    <p className="text-gray-300 text-sm">Dhaka, Bangladesh</p>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Hours</p>
                    <p className="text-gray-300 text-sm">Mon-Fri: 9AM-6PM</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-700 pt-6 mt-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-sm text-gray-400 text-center md:text-left">
                &copy; 2026 <span className="text-white font-semibold">Kossti</span>. All rights reserved.
              </p>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <span>Crafted with</span>
                <svg className="w-4 h-4 text-red-500 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
                <span>by</span>
                <Link 
                  href="https://portfolio-three-theta-ephz9pve2c.vercel.app/" 
                  className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Monir
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
