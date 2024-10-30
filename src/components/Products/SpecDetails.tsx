import { FC } from 'react';
import { SearchParams, brandInt, Product, ProductApiResponse } from '@/lib/types';

interface PopularProductsProps {
  product: Product;
}

const SpecDetails = ({ product }: PopularProductsProps) => {

  return (
    <div>
      {/* <h2 className='py-5'>{product.name} </h2>

      
      <h3 className="font-semibold">brand: {product.brand}</h3>
      <h3 className="font-semibold">category: ${product.category}</h3>
      <h3 className="font-semibold">Price: ${product.price}</h3> */}

    </div>

  );
};

export default SpecDetails;
