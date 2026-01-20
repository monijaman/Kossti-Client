'use client'; // This directive makes this component a client component

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
type AccountDropdownProps = {
  isAuthenticated: boolean; // Define the type for the prop
};

const AccountDropdown = ({ isAuthenticated }: AccountDropdownProps) => {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null); // Reference for the dropdown
  // const isAuthenticated = useAuth();


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
      const response = await fetch("/api/admin/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
      });

      if (response.ok) {
        // Redirect the user to login after successful logout
        router.push('/admin/login');
      } else {
        console.error('Failed to logout', response.status);
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
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default AccountDropdown;
