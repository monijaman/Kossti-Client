

import { useTranslation } from "@/hooks/useLocale";
import { Product } from '@/lib/types';
import ProducShortDetails from './ProducShortDetails';
import SectionHeader from '../Home/SectionHeader';
import { Clock } from 'lucide-react';

interface pageProps {
  products: Product[];
  countryCode: string
}

const ProductReview = ({ products, countryCode }: pageProps) => {
  const translation = useTranslation(countryCode);

  // Show only first 8 products for Latest Reviews section
  const latestProducts = products.slice(0, 8);

  return (
    <section className="mb-12">
      <SectionHeader
        title={translation.latest_review}
        subtitle={countryCode === 'en' ? 'Fresh reviews from our expert team' : 'আমাদের বিশেষজ্ঞ টিম থেকে নতুন রিভিউ'}
        icon={Clock}
        gradientColor="from-blue-600 to-cyan-600"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
        {latestProducts.map((product, i) => (
          <ProducShortDetails
            key={product.id + i}
            product={product}
            countryCode={countryCode}
            priority={i < 4} // Prioritize first 4 images (above the fold)
          />
        ))}
      </div>
    </section>
  );
};

export default ProductReview;
