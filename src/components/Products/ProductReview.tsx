import ProducShortDetails from '@/components/Products/ProducShortDetails';
import { Product } from '@/lib/types';

interface PopularProductsProps {
  products: Product[];
}

const PopularProducts = ({ products }: PopularProductsProps) => {
  // Retrieve the 'country-code' cookie directly in a server component


  return (
    <>
      <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-gray-200 pb-2">
        Latest Reviews</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1">

        {products.map((product, i) => (
          <ProducShortDetails key={product.id} product={product} />
        ))}
      </div>
    </>
  );
};

export default PopularProducts;
