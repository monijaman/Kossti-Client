import ProducShortDetails from '@/components/Products/ProducShortDetails';
import { Product } from '@/lib/types';
import { cookies } from 'next/headers';

interface PopularProductsProps {
  products: Product[];
}

const PopularProducts = ({ products }: PopularProductsProps) => {
  // Retrieve the 'country-code' cookie directly in a server component
  const countryCode = cookies().get('country-code')?.value || 'en'; // Default to 'en' if not found

  console.log('Country Code:', countryCode);

  return (
    <div className="grid grid-cols-1 gap-4">
      {products.map((product, i) => (
        <ProducShortDetails key={i} product={product} />
      ))}
    </div>
  );
};

export default PopularProducts;
