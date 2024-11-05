import SpecDetails from '@/components/Products/SpecDetails';
import { Product } from '@/lib/types';
interface PopularProductsProps {
  product: Product;
}

const ProducDetails = ({ product }: PopularProductsProps) => {

  return (
    <div>
      <h2 className='py-5'>{product.name} </h2>


      <SpecDetails productId={product.id} />

    </div>
  );
};

export default ProducDetails;
