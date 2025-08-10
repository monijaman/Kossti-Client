import { Product } from '@/lib/types';
import Image from 'next/image';
import Link from 'next/link';
interface PopularProductsProps {
  product: Product;
  countryCode: string;
}

const ProducShortDetails = ({ product, countryCode }: PopularProductsProps) => {
  return (
    <Link
      key={product.id}
      href={`${countryCode}/${product.category_slug}/${product.slug}`}
      className="product-card flex items-center space-x-4 p-4 transition-all"
    >
      {/* Product Image */}
      <Image
        src={product.photo || '/placeholder-image.jpg'}
        alt={product.name}
        width={80}
        height={80}
        className="rounded-lg object-cover shadow-sm"
      />

      {/* Product Details */}
      <div className="flex flex-col space-y-2">
        <h3 className="text-lg font-semibold text-gray-800 leading-tight">{product.name}</h3>
        <p className="text-sm text-blue-600 font-medium">{product.brand?.name}</p>
        <p className="text-xs text-gray-500 uppercase tracking-wide">{product.category?.name}</p>
      </div>
    </Link>
  );
};

export default ProducShortDetails;
