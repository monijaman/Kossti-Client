"use client";
import Link from "next/link";

const Navigation = () => {
  const isAdmin = typeof window !== "undefined" && localStorage.getItem("userType")?.trim().toLowerCase() === "admin";
  return (
  <nav className="bg-gray-700 text-white p-4">
    <ul className="flex space-x-4">
      <li><Link href="/admin" className="hover:text-gray-300">Home</Link></li>
      <li><Link href="/admin/reviews" className="hover:text-gray-300">Products</Link></li>
      <li><Link href="/admin/specifications" className="hover:text-gray-300">Specifications</Link></li>
      <li><Link href="/admin/keys" className="hover:text-gray-300">Keys</Link></li>
      <li><Link href="/admin/contacts" className="hover:text-gray-300">Contacts</Link></li>
      {isAdmin && <li><Link href="/admin/feedback" className="hover:text-gray-300">Feedback</Link></li>}
    </ul>
  </nav>
  );
};

export default Navigation;
