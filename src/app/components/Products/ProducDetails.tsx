import SpecDetails from '@/app/components/Products/SpecDetails';
import ProductReviewsSection from '@/app/components/reviews/ProductReviewsSection';
import { useTranslation } from '@/hooks/useLocale';
import { apiEndpoints } from '@/lib/constants';
import fetchApi from '@/lib/fetchApi';
import { Product, ProductPhotos } from '@/lib/types';
import Image from 'next/image';

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
  let selectedImage = product.photo || '/noimage.webp';
  try {
    const response = await fetchApi<PhotosResponse>(`/productimages/${product.id}`, {
      next: { revalidate: 60 },
    });
    if (response.success && response.data?.images?.length) {
      photos = response.data.images;
      const def = response.data.images.find((p) => p.defaultphoto === 1) || response.data.images[0];
      selectedImage = def.url || def.asset_url || product.photo || '/noimage.webp';
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
    <div className="mx-auto px-2 md:px-4 py-3 md:py-6">
      {/* Breadcrumb */}
      <nav className="text-xs md:text-sm mb-3 md:mb-6 text-gray-600 overflow-x-auto">
        <span>{t.nav_home || 'Home'}</span>
        <span className="mx-1 md:mx-2">›</span>
        <span>{countryCode === 'bn' && product.brand?.translated_name ? product.brand.translated_name : product.brand?.name}</span>
        <span className="mx-1 md:mx-2">›</span>
        <span className="text-gray-900 font-medium">{displayName}</span>
      </nav>

      {/* Product Header */}
      <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-6 md:mb-8 leading-tight">{countryCode === 'bn' && product.translated_name ? product.translated_name : displayName}</h1>

      {/* Product Info Section - Now at Top */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 lg:gap-8 mb-8 md:mb-12">
        {/* Left: Product Images */}
        <div className="space-y-2 md:space-y-4">
          {/* Main Image */}
          <div className="bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 rounded-2xl p-8 aspect-[4/3] relative overflow-hidden">
            <Image
              src={selectedImage}
              alt={product.name}
              fill
              className="object-contain"
            />
          </div>

          {/* Thumbnail Images (not interactive in server component) */}
          <div className="grid grid-cols-4 gap-3">
            {productImages.map((img, index) => (
              <div
                key={index}
                className={`aspect-square rounded-lg border-2 overflow-hidden transition-all ${selectedImage === img ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'}`}
              >
                <div className="relative w-full h-full bg-gray-50">
                  <Image
                    src={img}
                    alt={`${product.name} ${index + 1}`}
                    fill
                    className="object-contain p-2"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3 md:gap-5 border border-gray-200 rounded-xl md:rounded-2xl p-4 md:p-6 bg-white">

          {/* Meta grid */}
          <div className="grid grid-cols-2 gap-x-3 md:gap-x-6 gap-y-3 text-xs md:text-sm">
            <div>
              <p className="text-xs text-gray-400 mb-0.5">{t.label_brand || 'Brand'}</p>
              <p className="font-semibold text-gray-900">{product.brand?.name || '—'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-0.5">{t.label_category || 'Category'}</p>
              <p className="font-semibold text-gray-900">{product.category?.name || '—'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-0.5">{t.label_added_on || 'Added on'}</p>
              <p className="font-medium text-gray-700" suppressHydrationWarning>
                {product.created_at ? new Date(product.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-0.5">{t.label_last_updated || 'Last updated'}</p>
              <p className="font-medium text-gray-700" suppressHydrationWarning>
                {product.updated_at ? new Date(product.updated_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
              </p>
            </div>
          </div>

          {/* Description */}
          {product.description && (
            <>
              <hr className="border-gray-100" />
              <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
            </>
          )}

          {/* Price */}
          {(product.price || product.start_price || product.end_price) && (
            <>
              <hr className="border-gray-100" />
              <div className="bg-blue-50 rounded-xl px-4 py-3 flex items-center justify-between">
                <span className="text-xs text-gray-500">{t.label_price || 'Price'}</span>
                <span className="text-base font-bold text-blue-700">
                  {product.start_price && product.end_price
                    ? `${product.start_price} – ${product.end_price}`
                    : product.price || '—'}
                </span>
              </div>
            </>
          )}

          <hr className="border-gray-100" />

          {/* Key Specs */}
          {specsLoading ? (
            <div className="flex flex-col gap-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : quickSpecs.length > 0 ? (
            <div className="flex flex-col gap-2">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{t.label_specifications || 'Key Specs'}</p>
              {quickSpecs.map((spec, i) => {
                const accent = ['border-green-400', 'border-orange-400', 'border-purple-400', 'border-pink-400', 'border-teal-400', 'border-blue-400'];
                const bg = ['bg-green-50', 'bg-orange-50', 'bg-purple-50', 'bg-pink-50', 'bg-teal-50', 'bg-blue-50'];
                return (
                  <div key={spec.specification_key_id} className={`flex items-center justify-between px-4 py-3 rounded-xl ${bg[i % bg.length]} border-l-4 ${accent[i % accent.length]}`}>
                    <span className="text-xs text-gray-500">{spec.translated_key}</span>
                    <span className="text-sm font-bold text-gray-900 text-right max-w-[60%]">{spec.translated_value}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-4">
              <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="text-sm text-gray-500">Full specifications available below ↓</p>
            </div>
          )}
        </div>
      </div>

      {/* Reviews Section - Shows all reviews with ratings and details */}

      {/* Two Column Layout for Specifications and Reviews */}
      <div className="mt-8 md:mt-12 grid grid-cols-1 lg:grid-cols-5 gap-6 md:gap-8">
        {/* Reviews Section */}
        <div className="lg:col-span-2">
          <Suspense fallback={<div>Loading reviews...</div>}>
            <ProductReviewsSection productId={product.id} countryCode={countryCode} />
          </Suspense>
        </div>

        {/* Specifications Table */}
        <div className="lg:col-span-3">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 md:p-4 mb-4 md:mb-6">
            <p className="text-xs md:text-sm text-yellow-800">{t.unofficial_specs || 'Unofficial specifications'}</p>
          </div>

          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">{t.label_specifications || 'Specifications'}</h2>
          <Suspense fallback={<div>Loading specifications...</div>}>
            <SpecDetails productId={product.id} countryCode={countryCode} />
          </Suspense>
        </div>
      </div>

    </div>
  );
}

 
export default ProducDetails;
