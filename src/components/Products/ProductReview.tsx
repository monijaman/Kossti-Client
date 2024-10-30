import { FC } from 'react';
import { SearchParams, brandInt, Product, ProductApiResponse } from '@/lib/types';
import ProducShortDetails from '@/components/Products/ProducShortDetails';

interface PopularProductsProps {
  products: Product[];

}

const PopularProducts = ({ products }: PopularProductsProps) => {

  return (
    <div className="grid grid-cols-1 gap-4">
      {products.map((product, i) => {
        return (
          <ProducShortDetails key={i} product={product} />
        );
      })} 

    </div>
  );
};

export default PopularProducts;
