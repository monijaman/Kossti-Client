

import { useTranslation } from "@/hooks/useLocale";
import { Product } from '@/lib/types';
import ProducShortDetails from './ProducShortDetails';

interface pageProps {
  products: Product[];
  countryCode: string
}

const ProductReview = ({ products, countryCode }: pageProps) => {
  // Retrieve the 'country-code' cookie directly in a server component

  const translation = useTranslation(countryCode);

  // Show only first 8 products for Latest Reviews section
  const latestProducts = products.slice(0, 8);

  return (
    <>
      <h2 className="page-title font-display text-lg md:text-xl lg:text-2xl font-bold text-gray-800 mb-4 md:mb-6 tracking-tight">
        {translation.latest_review}</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6 mb-6 md:mb-8">
        {latestProducts.map((product, i) => (
          <ProducShortDetails
            key={product.id + i}
            product={product}
            countryCode={countryCode}
            priority={i < 4} // Prioritize first 4 images (above the fold)
          />
        ))}
      </div>
    </>
  );
};

export default ProductReview;
