import { FC } from 'react';
import { SearchParams, brandInt, Product, ProductApiResponse } from '@/lib/types';
import SpecDetails from '@/components/Products/SpecDetails';
interface PopularProductsProps {
  product: Product;
}

const ProducDetails = ({ product }: PopularProductsProps) => {

  return (
    <div>
      <h2 className='py-5'>{product.name} </h2>


      <h3 className="font-semibold">brand: {product.brand}</h3>
      <h3 className="font-semibold">category: ${product.category}</h3>
      <h3 className="font-semibold">Price: ${product.price}</h3>

      <SpecDetails />

    </div>
  );
};

export default ProducDetails;
