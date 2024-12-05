import Link from 'next/link'; // Import Next.js Link component

const Breadcrumbs: React.FC = () => (
    <nav className="bg-gray-200 p-4">
        <ol className="flex space-x-2">
            <li>
                <Link href="/" className="text-blue-600 hover:underline">
                    Home
                </Link>
            </li>
            <li>&gt;</li>
            <li className="text-gray-600">Current Page</li>
        </ol>
    </nav>
);

export default Breadcrumbs;
