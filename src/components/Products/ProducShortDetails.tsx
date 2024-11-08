import { Product } from '@/lib/types';
import Image from 'next/image';
import Link from 'next/link';
interface PopularProductsProps {
  product: Product;
}

const ProducShortDetails = ({ product }: PopularProductsProps) => {

  return (
    <div className="p-1">

      <Link
        key={product.id}
        href={`/${product.category_slug}/${product.slug}`}
        className="flex items-center space-x-6 p-4 bg-white border border-gray-200 rounded-sm shadow-md hover:bg-gray-50 transition"
      >
        {/* Product Image */}
        <Image
          src={product.photo}
          alt={product.name}
          width={60}
          height={60}
          className="rounded-lg object-cover"
        />

        {/* Product Details */}
        <div className="flex flex-col space-y-1">
          <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
          <p className="text-sm text-gray-500">{product.brand}</p>
          <p className="text-sm text-gray-400">{product.category}</p>
        </div>
      </Link>
    </div>


  );
};

export default ProducShortDetails;
