import { FC } from 'react';
import AccountDropdown from '@/components/ui/AccountDropdown';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import Navigation from '@/components/ui/Navigation';
import Sidebar from '@/components/ui/Sidebar';
import ProductReview from '@/components/Products/ProductReview';
import PopularProducts from '@/components/Products/PopularProducts';
import Pagination from '@/components/Pagination/index';

export interface Product {
  id: number;
  name: string;
  description: string;
  category: string;
  branch: string;
  price: number;
}

const fetchProducts = async (
  page: number,
  productsPerPage: number,
  category?: string,
  branch?: string,
  priceRange?: string
): Promise<{ products: Product[]; totalProducts: number }> => {
  const totalProducts = 10; // Example total number of products
  const products = Array.from({ length: totalProducts }, (_, index) => ({
    id: index + 1,
    name: `Product ${index + 1}`,
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam viverra...',
    category: `category${(index % 3) + 1}`, // Example category
    branch: `branch${(index % 3) + 1}`, // Example branch
    price: (index + 1) * 20 // Example price
  }));

  // Apply filters
  let filteredProducts = products;

  if (category) {
    filteredProducts = filteredProducts.filter(p => p.category === category);
  }

  if (branch) {
    filteredProducts = filteredProducts.filter(p => p.branch === branch);
  }

  if (priceRange) {
    const [minPrice, maxPrice] = priceRange.split('-').map(Number);
    filteredProducts = filteredProducts.filter(p => p.price >= minPrice && (maxPrice ? p.price <= maxPrice : true));
  }

  const startIndex = (page - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;

  return {
    products: filteredProducts.slice(startIndex, endIndex),
    totalProducts: filteredProducts.length
  };
};


const Page: FC<{ searchParams: { page?: string; category?: string; branch?: string; price?: string } }> = async ({ searchParams }) => {
  const page = parseInt(searchParams.page as string, 10) || 1;
  const productsPerPage = 2;
  const activeCategory = searchParams.category || '';
  const activeBranch = searchParams.branch || '';
  const activePriceRange = searchParams.price || '';

  const { products, totalProducts } = await fetchProducts(page, productsPerPage, activePriceRange);
  const totalPages = Math.ceil(totalProducts / productsPerPage);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-gray-800 text-white p-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">Review Layout</h1>
        <AccountDropdown />
      </header>

      <Breadcrumbs />
      <Navigation />

      <div className="flex flex-grow">
        <Sidebar 
          activeCategory={activeCategory} 
          activeBranch={activeBranch} 
          activePriceRange={activePriceRange} 
        />
        <main className="flex-1 bg-white p-4">
          <ProductReview products={products} />
          <PopularProducts />
          <Pagination currentPage={page} totalPages={totalPages} />
        </main>
      </div>

      <footer className="bg-gray-800 text-white p-4 mt-auto">
        <p className="text-center">&copy; 2024 Review Layout. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Page;