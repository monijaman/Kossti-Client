// components/ui/Sidebar/Sidebar.tsx

import Link from 'next/link'; // Assuming you're using Next.js for navigation

const Sidebar: React.FC = () => {
    return (
        <nav className="bg-gray-900 text-white w-64 p-4">
            <ul>
                <li className="mb-2">
                    <Link href="/admin/reviews" className="hover:underline">Manage Reviews</Link>
                </li>
                <li className="mb-2">
                    <Link href="/admin/products" className="hover:underline">Manage Products</Link>
                </li>
                <li className="mb-2">
                    <Link href="/admin/users" className="hover:underline">Manage Users</Link>
                </li>
                <li className="mb-2">
                    <Link href="/admin/settings" className="hover:underline">Settings</Link>
                </li>
            </ul>
        </nav>
    );
};

export default Sidebar;
