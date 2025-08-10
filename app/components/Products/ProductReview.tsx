

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

  return (
    <>
      <h2 className="page-title text-2xl font-bold text-gray-800 mb-6">
        {translation.latest_review}</h2>

      <div className="product-grid">
        {products.map((product, i) => (
          <ProducShortDetails key={product.id + i} product={product} countryCode={countryCode} />
        ))}
      </div>
    </>
  );
};

export default ProductReview;
