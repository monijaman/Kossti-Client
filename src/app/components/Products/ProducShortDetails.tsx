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

  // Prefer translated_name (from API) then translations array, then English name
  const displayName =
    product.translated_name ||
    (countryCode !== 'en'
      ? product.translations?.find((t) => t.locale === countryCode)?.translated_name
      : undefined) ||
    product.name;

  return (
    <Link
      key={product.id}
      href={`/${countryCode}/${categorySlug}/${productSlug}`}
      className="group block bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
    >
      {/* Product Image Container */}
      <div className="relative w-full aspect-[4/3] bg-gradient-to-br from-yellow-100 via-blue-50 to-purple-100 overflow-hidden">
        {product.review && (
          <div className="absolute top-4 left-4 z-10">
            <span className="bg-black text-white text-xs font-semibold px-3 py-1 rounded-full">
              Review
            </span>
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
      <div className="p-5 space-y-3">
        <h3 className="text-lg font-bold text-gray-900 leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors">
          {displayName}
        </h3>

        <p className="text-sm text-gray-600 line-clamp-2">
          {product.description || `${product.brand?.name} ${product.category?.name}`}
        </p>

        {/* Brand and Category Info */}
        <div className="flex items-center gap-3 pt-2">
          {product.brand?.name && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-100 rounded-md flex items-center justify-center">
                <span className="text-xs font-bold text-gray-700">
                  {product.brand.name.substring(0, 2).toUpperCase()}
                </span>
              </div>
              <span className="text-sm font-semibold text-gray-700">
                {product.brand.name}
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProducShortDetails;
