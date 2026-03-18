import { Product } from '@/lib/types';
import Image from 'next/image';
import Link from 'next/link';
interface PopularProductsProps {
  product: Product;
  countryCode: string;
  priority?: boolean; // For LCP optimization
}

const ProducShortDetails = ({ product, countryCode, priority = false }: PopularProductsProps) => {
  // Fallback to product ID if slug is missing
  const productSlug = product.slug || `product-${product.id}`;
  const categorySlug = product.category_slug || 'products';

  // Prefer translated_name (from API) - no need for translations array
  const displayName =
    product.translated_name ||
    product.name;

  // Get translated brand name
  const displayBrandName =
    product.brand?.translated_name ||
    product.brand?.name ||
    '';

  return (
    <Link
      key={product.id}
      href={`/${countryCode}/${categorySlug}/${productSlug}`}
      className="group block bg-gradient-to-br from-white to-blue-50 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-blue-100 hover:border-blue-300"
    >
      {/* Product Image Container */}
      <div className="relative w-full aspect-[4/3] bg-gradient-to-br from-amber-100 via-purple-100 to-pink-100 overflow-hidden">
        {product.review && (
          <div className="absolute top-4 left-4 z-10">
            <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg">✓ Review</span>
          </div>
        )}
        <Image
          src={product.photo || '/noimage.webp'}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          loading={priority ? "eager" : "lazy"}
          priority={priority}
          className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Product Details */}
      <div className="p-5 space-y-3 bg-gradient-to-b from-white to-blue-50">
        <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent leading-tight line-clamp-2 group-hover:from-purple-600 group-hover:to-pink-600 transition-all">
          {displayName}
        </h3>



        {/* Rating and Price Row */}
        <div className="flex items-center justify-between pt-2 pb-2 border-t border-gray-100">
          {/* Rating - Show filled stars */}
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className={`text-lg transition-transform group-hover:scale-110 ${product.average_rating && i < Math.round(product.average_rating)
                  ? 'text-amber-400 drop-shadow-sm'
                  : 'text-gray-200'
                  }`}
              >
                ★
              </span>
            ))}
          </div>

          {/* Price */}
          {product.start_price !== undefined &&
            product.start_price !== null &&
            product.start_price > 0 && (
              <div className="text-right">
                <span className="text-sm font-bold bg-gradient-to-r from-green-500 to-emerald-500 text-white px-2 py-1 rounded-lg">
                  ${Number(product.start_price).toFixed(2)}
                </span>
              </div>
            )}
        </div>

        {/* Brand and Category Info */}
        <div className="flex items-center gap-3">
          {product.brand?.name && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-md flex items-center justify-center shadow-md">
                <span className="text-xs font-bold text-white">
                  {displayBrandName.substring(0, 2).toUpperCase()}
                </span>
              </div>
              <span className="text-sm font-semibold text-gray-700 group-hover:text-blue-600 transition-colors">
                {displayBrandName}
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProducShortDetails;
