import { FC } from 'react';
import { SearchParams, brandInt, Product, ProductApiResponse } from '@/lib/types';
import ProducDetails from '@/components/Products/ProducDetails';

interface PopularProductsProps {
  products: Product[];

}

const PopularProducts = ({ products }: PopularProductsProps) => {

  return (
    <div className="grid grid-cols-1 gap-4">

      {products.map((product, i) => {
        return (
          <ProducDetails key={i} product={product} />
        );
      })}

    </div>
  );
};

export default PopularProducts;
