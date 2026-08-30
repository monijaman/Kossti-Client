'use client'; // This directive makes this component a client component

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
type AccountDropdownProps = {
  isAuthenticated: boolean; // Define the type for the prop
};

const AccountDropdown = ({ isAuthenticated }: AccountDropdownProps) => {
  const pathname = usePathname();
  const isBangla = pathname.startsWith('/bn');

  const [isOpen, setIsOpen] = useState(false);
  const [localAuthState, setLocalAuthState] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null); // Reference for the dropdown

  // Check authentication state on component mount and update. The JWT
  // itself lives only in an httpOnly cookie, invisible to this component -
  // `email` is non-secret display state written at sign-in and doubles as
  // the "is this browser signed in" signal.
  useEffect(() => {
    const checkAuthState = () => {
      const hasSession = typeof window !== 'undefined' && !!localStorage.getItem('email');
      setLocalAuthState(hasSession);
    };

    checkAuthState();

    // Listen for storage changes (when localStorage is cleared)
    window.addEventListener('storage', checkAuthState);

    return () => {
      window.removeEventListener('storage', checkAuthState);
    };
  }, []);

  // Combine server-side prop and client-side state
  const isUserAuthenticated = isAuthenticated || localAuthState;

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
      // Immediately update local auth state
      setLocalAuthState(false);

      // Clear the httpOnly session cookies server-side (this also
      // invalidates the session, since the backend only trusts the
      // Authorization header the proxy derives from these cookies).
      const response = await fetch("/api/admin/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
      });

      // Full page navigation (not router.push) - the header's authenticated
      // state comes from a server-rendered prop computed from cookies, which
      // a client-side route transition never re-fetches. Without a hard
      // reload here, the UI keeps showing "logged in" until the user
      // manually refreshes the page.
      const loginPath = pathname.startsWith('/admin') ? '/admin/login' : '/signin';
      if (!response.ok) {
        console.error('Failed to logout', response.status);
      }
      window.location.href = loginPath;
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="relative z-50" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="text-white bg-blue-600 px-2 md:px-4 py-1 md:py-2 text-xs md:text-sm rounded-md focus:outline-none"
      >
        {isBangla ? 'অ্যাকাউন্ট' : 'Account'}
      </button>
      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-40 md:w-48 bg-white text-gray-900 shadow-lg rounded-md"
          style={{ top: '100%', zIndex: 50 }}
        >
          {!isUserAuthenticated ? (
            <>
              <Link
                href="/admin/login"
                className="block px-4 py-2 hover:bg-gray-200 rounded-tl-md rounded-tr-md transition-colors"
              >


                {isBangla ? 'সাইন ইন' : 'Signin'}
              </Link>
              <Link
                href="/signup"
                className="block px-4 py-2 hover:bg-gray-200 rounded-md transition-colors"
              >
                {isBangla ? 'সাইন আপ' : 'Signup'}
              </Link>

            </>
          ) : (
            <>
              <Link href="/profile" className="block px-4 py-2 hover:bg-gray-200 rounded-tl-md rounded-tr-md transition-colors">
                {isBangla ? 'প্রোফাইল' : 'Profile'}
              </Link>
              <Link
                href='#'
                onClick={(e) => {
                  e.preventDefault();
                  handleLogout();
                }}
                className="block px-4 py-2 hover:bg-gray-100">
                {isBangla ? 'লগ আউট' : 'Logout'}
              </Link>
              {isUserAuthenticated && userType !== 'guest' && (
                <>
                  <hr className="my-1" />
                  <Link
                    href="/admin"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    {isBangla ? 'অ্যাডমিন ড্যাশবোর্ড' : 'Admin Dashboard'}
                  </Link>
                  <Link href="/admin/users" className="block px-4 py-2 hover:bg-gray-100  rounded-bl-md rounded-br-md">
                    {isBangla ? 'ব্যবহারকারী পরিচালনা' : 'Manage Users'}
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
