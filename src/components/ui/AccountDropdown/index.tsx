'use client'; // This directive makes this component a client component

import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';

const AccountDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const isAuthenticated = useAuth();
  return (
    <div className="relative flex items-center">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-white bg-blue-600 px-4 py-2 rounded-md focus:outline-none"
      >
        Account
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white text-gray-900 shadow-lg rounded-md">
          {!isAuthenticated ? (
            <>
              <a href="/admin" className="block px-4 py-2 hover:bg-gray-100">Admin</a>
              <a href="/signup" className="block px-4 py-2 hover:bg-gray-100">Change Password</a>
            </>
          ) : (
            <>
              <a href="/profile" className="block px-4 py-2 hover:bg-gray-100">Profile</a>
              <a href="/logout" className="block px-4 py-2 hover:bg-gray-100">Logout</a>


              <>
                <hr className="my-1" />
                <a href="/admin/dashboard" className="block px-4 py-2 hover:bg-gray-100">Admin Dashboard</a>
                <a href="/admin/users" className="block px-4 py-2 hover:bg-gray-100">Manage Users</a>
              </>

            </>
          )}
        </div>
      )}
    </div>
  );
};

export default AccountDropdown;

