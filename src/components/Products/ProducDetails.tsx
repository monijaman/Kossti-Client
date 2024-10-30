import { FC } from 'react';
import { SearchParams, brandInt, Product, ProductApiResponse } from '@/lib/types';

interface PopularProductsProps {
  product: Product;
}

const ProducDetails = ({ product }: PopularProductsProps) => {


  console.log(product)
  return (
    <a key={product.id} href={`${product.category_slug}/${product.slug}`} className="p-4 bg-gray-50 border rounded">
      <h3 className="font-semibold">{product.name}</h3>
      <h3 className="font-semibold">brand: {product.brand}</h3>
      <h3 className="font-semibold">category: ${product.category}</h3>
      <h3 className="font-semibold">Price: ${product.price}</h3>
    </a>

  );
};

export default ProducDetails;
