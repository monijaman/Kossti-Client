import { FC } from 'react';
import { SearchParams, brandInt, Product, ProductApiResponse } from '@/lib/types';

interface PopularProductsProps {
  product: Product;

}

const ProducDetails = ({ product }: PopularProductsProps) => {

  return (

    <div key={product.id} className="p-4 bg-gray-50 border rounded">
      <h3 className="font-semibold">{product.name}</h3>
      <h3 className="font-semibold">brand: {product.brand}</h3>
      <h3 className="font-semibold">category: ${product.category}</h3>
      <h3 className="font-semibold">Price: ${product.price}</h3>
    </div>

  );
};

export default ProducDetails;
