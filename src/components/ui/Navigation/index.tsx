const Navigation = () => (
  <nav className="bg-gray-700 text-white p-4">
    <ul className="flex space-x-4">
      <li><a href="/admin" className="hover:text-gray-300">Home</a></li>
      <li><a href="/admin/products" className="hover:text-gray-300">Products</a></li>
      <li><a href="/admin/reviews" className="hover:text-gray-300">Products</a></li>
      <li><a href="/admin/specifications" className="hover:text-gray-300">Specifications</a></li>
      <li><a href="/admin/keys" className="hover:text-gray-300">Keys</a></li>
      <li><a href="#" className="hover:text-gray-300">Contact</a></li>
    </ul>
  </nav>
);

export default Navigation;
