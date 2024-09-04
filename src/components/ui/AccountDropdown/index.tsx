'use client'; // This directive makes this component a client component

import { useState } from 'react';

const AccountDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-white bg-blue-600 px-4 py-2 rounded-md focus:outline-none"
      >
        Account
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white text-gray-900 shadow-lg rounded-md">
          <a href="#" className="block px-4 py-2 hover:bg-gray-100">Sign In</a>
          <a href="#" className="block px-4 py-2 hover:bg-gray-100">Sign Up</a>
        </div>
      )}
    </div>
  );
};

export default AccountDropdown;
