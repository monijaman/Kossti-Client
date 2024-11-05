import { Product } from '@/lib/types';

interface PopularProductsProps {
  product: Product;
}

const ProducShortDetails = ({ product }: PopularProductsProps) => {

  return (
    <div>

      <a key={product.id} href={`${product.category_slug}/${product.slug}`} className="p-4 block bg-gray-50 border rounded">
        <h3 className="font-semibold">{product.name}</h3>
        <h3 className="font-semibold"> {product.brand}</h3>
        <h3 className="font-semibold">  {product.category}</h3>
        <h3 className="font-semibold">  {product.price}</h3>
      </a>
    </div>

  );
};

export default ProducShortDetails;
