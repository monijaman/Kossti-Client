import Link from "next/link";

const Navigation = () => (
  <nav className="bg-gray-700 text-white p-4">
    <ul className="flex space-x-4">
      <li><Link href="/admin" className="hover:text-gray-300">Home</Link></li>
      <li><Link href="/admin/reviews" className="hover:text-gray-300">Products</Link></li>
      <li><Link href="/admin/specifications" className="hover:text-gray-300">Specifications</Link></li>
      <li><Link href="/admin/keys" className="hover:text-gray-300">Keys</Link></li>
      <li><Link href="#" className="hover:text-gray-300">Contact</Link></li>
    </ul>
  </nav>
);

export default Navigation;
