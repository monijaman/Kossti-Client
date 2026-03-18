'use client'
import Link from 'next/link';
import { useState } from 'react';

interface SidebarProps {
    onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
    const [showSpecifications, setShowSpecifications] = useState(false);

    const toggleSpecifications = () => {
        setShowSpecifications(!showSpecifications);
    };

    const userType = typeof window !== 'undefined' ? localStorage.getItem('userType') : null;

    const handleLinkClick = () => {
        onClose?.();
    };

    return (
        <nav className="bg-gray-900 text-white w-full h-full overflow-y-auto p-4 lg:p-6">
            <ul className="space-y-2">
                {userType === 'guest' ? (
                    <li className="mb-2">
                        <Link
                            href="/profile"
                            className="block px-3 py-2 rounded hover:bg-gray-800 transition-colors"
                            onClick={handleLinkClick}
                        >
                            Profile
                        </Link>
                    </li>
                ) : (
                    <>
                        <li>
                            <Link
                                href="/admin/dashboard"
                                className="block px-3 py-2 rounded hover:bg-gray-800 transition-colors"
                                onClick={handleLinkClick}
                            >
                                Dashboard
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/admin/categories"
                                className="block px-3 py-2 rounded hover:bg-gray-800 transition-colors"
                                onClick={handleLinkClick}
                            >
                                Categories
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/admin/brand"
                                className="block px-3 py-2 rounded hover:bg-gray-800 transition-colors"
                                onClick={handleLinkClick}
                            >
                                Brands
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/admin/reviews"
                                className="block px-3 py-2 rounded hover:bg-gray-800 transition-colors"
                                onClick={handleLinkClick}
                            >
                                Manage Reviews
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/admin/products"
                                className="block px-3 py-2 rounded hover:bg-gray-800 transition-colors"
                                onClick={handleLinkClick}
                            >
                                Manage Products
                            </Link>
                        </li>
                        <li>
                            <button
                                onClick={toggleSpecifications}
                                className="w-full text-left px-3 py-2 rounded hover:bg-gray-800 transition-colors flex items-center justify-between"
                            >
                                <span>Specifications</span>
                                <svg
                                    className={`w-4 h-4 transform transition-transform ${showSpecifications ? 'rotate-180' : ''}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                </svg>
                            </button>
                            {showSpecifications && (
                                <ul className="ml-4 mt-2 space-y-1">
                                    <li>
                                        <Link
                                            href="/admin/specifications"
                                            className="block px-3 py-2 rounded text-sm hover:bg-gray-800 transition-colors"
                                            onClick={handleLinkClick}
                                        >
                                            Specifications
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="/admin/keys"
                                            className="block px-3 py-2 rounded text-sm hover:bg-gray-800 transition-colors"
                                            onClick={handleLinkClick}
                                        >
                                            Keys
                                        </Link>
                                    </li>
                                </ul>
                            )}
                        </li>
                    </>
                )}
            </ul>
        </nav>
    );
};

export default Sidebar;
