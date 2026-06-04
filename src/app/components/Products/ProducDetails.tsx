import SpecDetails from '@/app/components/Products/SpecDetails';
import ProductReviewsSection from '@/app/components/reviews/ProductReviewsSection';
import ProductImageGallery from '@/app/components/Products/ProductImageGallery';
import { useTranslation } from '@/hooks/useLocale';
import { apiEndpoints } from '@/lib/constants';
import fetchApi from '@/lib/fetchApi';
import { Product, ProductPhotos } from '@/lib/types';

type SpecsResponse = { dataset: { specification_key_id: number; translated_key: string; translated_value: string; }[] };
type PhotosResponse = { images: ProductPhotos[] };

interface PopularProductsProps {
  product: Product;
  countryCode?: string;
}

import { Suspense } from 'react';

async function ProducDetails({ product, countryCode = 'en' }: PopularProductsProps) {
  // Fetch quick specs
  let quickSpecs: { specification_key_id: number; translated_key: string; translated_value: string; }[] = [];
  let specsLoading = false;
  try {
    const response = await fetchApi<SpecsResponse>(apiEndpoints.getPublicSpecs(product.id), {
      queryParams: { locale: countryCode },
      next: { revalidate: 60 },
    });
    if (response.success && response.data?.dataset) {
      quickSpecs = response.data.dataset.slice(0, 6);
    }
  } catch {
    // ignore
  }

  // Fetch product images
  let photos: ProductPhotos[] = [];
  try {
    const response = await fetchApi<PhotosResponse>(`/productimages/${product.id}`, {
      next: { revalidate: 60 },
    });
    if (response.success && response.data?.images?.length) {
      photos = response.data.images;
    }
  } catch {
    // ignore
  }

  // Prefer translated_name (from API) then translations array, then English name
  const displayName =
    product.translated_name ||
    (countryCode !== 'en'
      ? product.translations?.find((tr) => tr.locale === countryCode)?.translated_name
      : undefined) ||
    product.name;

  const productImages = photos.length > 0
    ? photos.map((p) => p.url || p.asset_url || product.photo || '/noimage.webp')
    : [product.photo || '/noimage.webp'];

  // Translation
  const t = useTranslation(countryCode);

  return (
    <div className="w-full mx-auto px-2 md:px-4 py-3 md:py-6">
      {/* Breadcrumb */}
      <nav className="text-xs md:text-sm mb-3 md:mb-6 text-gray-600 overflow-x-auto">
        <span>{t.nav_home || 'Home'}</span>
        <span className="mx-1 md:mx-2">›</span>
        <span>{countryCode === 'bn' && product.brand?.translated_name ? product.brand.translated_name : product.brand?.name}</span>
        <span className="mx-1 md:mx-2">›</span>
        <span className="text-gray-900 font-medium">{displayName}</span>
      </nav>

      {/* Product Header */}
      <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 leading-tight">{countryCode === 'bn' && product.translated_name ? product.translated_name : displayName}</h1>

      {/* Product Description — shown when available; omitted for thin pages */}
      {product.description && product.description.trim().length > 0 && (
        <p className="text-gray-700 text-base leading-relaxed mb-6 md:mb-8 max-w-3xl">
          {(countryCode !== 'en' && product.translated_description) ? product.translated_description : product.description}
        </p>
      )}

      {/* Product Info Section - Now at Top */}

      <ProductImageGallery
        productImages={productImages}
        productName={displayName}
      />

      {/* Product Details Section */}

      {/* Two Column Layout for Specifications and Reviews */}
      <div className="mt-8 md:mt-12 ">
        {/* Reviews Section */}
        <div className="lg:col-span-2">
          <Suspense fallback={
            <div className="my-8 space-y-3" aria-hidden="true">
              {[1,2,3].map(i => <div key={i} className="h-24 bg-gray-100 rounded-lg animate-pulse" />)}
            </div>
          }>
            <ProductReviewsSection productId={product.id} countryCode={countryCode} />
          </Suspense>
        </div>

        {/* Specifications Table */}
        <div className="lg:col-span-3">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 md:p-4 mb-4 md:mb-6">
            <p className="text-xs md:text-sm text-yellow-800">{t.unofficial_specs || 'Unofficial specifications'}</p>
          </div>

          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">{t.label_specifications || 'Specifications'}</h2>
          <Suspense fallback={
            <div className="space-y-2" aria-hidden="true">
              {[1,2,3,4,5,6].map(i => <div key={i} className="h-10 bg-gray-100 rounded animate-pulse" />)}
            </div>
          }>
            <SpecDetails productId={product.id} countryCode={countryCode} />
          </Suspense>
        </div>
      </div>

    </div>
  );
}

 
export default ProducDetails;
