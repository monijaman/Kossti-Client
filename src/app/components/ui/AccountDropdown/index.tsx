'use client'; // This directive makes this component a client component

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
type AccountDropdownProps = {
  isAuthenticated: boolean; // Define the type for the prop
};

const AccountDropdown = ({ isAuthenticated }: AccountDropdownProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null); // Reference for the dropdown
  // const isAuthenticated = useAuth();

  const userType = typeof window !== 'undefined' ? localStorage.getItem('userType') : null;


  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false); // Close the dropdown
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      console.log('logout account dropdown')
      setIsOpen(false);

      // Clear localStorage first (before calling logout endpoints)
      localStorage.clear();

      // Step 1: Get the access token from cookies
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('accessToken='))
        ?.split('=')[1];

      // Step 2: Call server-side logout to invalidate refresh tokens
      if (token) {
        try {
          const serverLogoutResponse = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/v1/logout`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
              },
            }
          );
          console.log('Server-side logout:', serverLogoutResponse.status);
        } catch (error) {
          console.warn('Server logout failed (will continue with client logout):', error);
        }
      }

      // Step 3: Call client-side logout to clear cookies and redirect
      const response = await fetch("/api/admin/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
      });

      if (response.ok) {
        console.log('Logout successful, redirecting...');
        const loginPath = pathname.startsWith('/admin') ? '/admin/login' : '/signin';
        router.push(loginPath);
      } else {
        console.error('Failed to logout', response.status);
        const loginPath = pathname.startsWith('/admin') ? '/admin/login' : '/signin';
        router.push(loginPath);
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="text-white bg-blue-600 px-4 py-2 rounded-md focus:outline-none"
      >
        Account
      </button>
      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-48 bg-white text-gray-900 shadow-lg rounded-md"
          style={{ top: '100%', zIndex: 10 }}
        >
          {!isAuthenticated ? (
            <>
              <Link
                href="/signin"
                className="block px-4 py-2 hover:bg-gray-200 rounded-tl-md rounded-tr-md transition-colors"
              >


                Signin
              </Link>
              <Link
                href="/signup"
                className="block px-4 py-2 hover:bg-gray-200 rounded-md transition-colors"
              >
                Signup
              </Link>

            </>
          ) : (
            <>
              <Link href="/profile" className="block px-4 py-2 hover:bg-gray-200 rounded-tl-md rounded-tr-md transition-colors">
                Profile
              </Link>
              <Link
                href='#'
                onClick={(e) => {
                  e.preventDefault();
                  handleLogout();
                }}
                className="block px-4 py-2 hover:bg-gray-100">
                Logout
              </Link>
              {userType !== 'guest' && (
                <>
                  <hr className="my-1" />
                  <Link
                    href="/admin"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Admin Dashboard
                  </Link>
                  <Link href="/admin/users" className="block px-4 py-2 hover:bg-gray-100  rounded-bl-md rounded-br-md">
                    Manage Users
                  </Link>
                </>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default AccountDropdown;
