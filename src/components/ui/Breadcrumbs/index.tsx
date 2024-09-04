const Breadcrumbs: React.FC = () => (
    <nav className="bg-gray-200 p-4">
        <ol className="flex space-x-2">
            <li><a href="#" className="text-blue-600 hover:underline">Home</a></li>
            <li>&gt;</li>
            <li><a href="#" className="text-blue-600 hover:underline">Products</a></li>
            <li>&gt;</li>
            <li className="text-gray-600">Current Page</li>
        </ol>
    </nav>
);

export default Breadcrumbs;
