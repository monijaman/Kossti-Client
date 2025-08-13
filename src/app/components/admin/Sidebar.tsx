'use client'
import Link from 'next/link'; // Assuming you're using Next.js for navigation
import { useState } from 'react';

const Sidebar: React.FC = () => {

    const [showSpecifications, setShowSpecifications] = useState(false);

    const toggleSpecifications = () => {
        setShowSpecifications(!showSpecifications);
    };


    return (
        <nav className="bg-gray-900 text-white w-64 p-4">
            <ul>
                <li className="mb-2">
                    <Link href="/admin/categories" className="hover:underline">Categories</Link>
                </li>
                <li className="mb-2">
                    <Link href="/admin/brand" className="hover:underline">Brands</Link>
                </li>
                <li className="mb-2">
                    <Link href="/admin/reviews" className="hover:underline">Manage Reviews</Link>
                </li>
                <li className="mb-2">
                    <Link href="/admin/products" className="hover:underline">Manage Products</Link>
                </li>
                <li className="mb-2">
                    <span onClick={toggleSpecifications} className="cursor-pointer hover:underline">
                        Specifications
                    </span>
                    {showSpecifications && (
                        <ul className="ml-4 mt-2">
                            <li>
                                <Link href="/admin/specifications" className="hover:underline">Specifications</Link>
                            </li>
                            <li>
                                <Link href="/admin/keys" className="hover:underline">Keys</Link>
                            </li>
                        </ul>
                    )}

                </li>
                {/* <li className="mb-2">
                    <Link href="/admin/users" className="hover:underline">Manage Users</Link>
                </li>
                <li className="mb-2">
                    <Link href="/admin/settings" className="hover:underline">Settings</Link>
                </li> */}
            </ul>
        </nav>
    );
};

export default Sidebar;
