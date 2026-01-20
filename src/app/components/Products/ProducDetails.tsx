"use client"
import SpecDetails from '@/app/components/Products/SpecDetails';
import ProductReviewsSection from '@/app/components/reviews/ProductReviewsSection';
import { Product } from '@/lib/types';
import Image from 'next/image';
import { useState } from 'react';

interface PopularProductsProps {
  product: Product;
  countryCode?: string;
}

const ProducDetails = ({ product, countryCode = 'en' }: PopularProductsProps) => {
  const [selectedImage, setSelectedImage] = useState(product.photo || '/noimage.webp');

  // Mock data for demonstration - replace with actual data from API
  const productImages = [
    product.photo || '/noimage.webp',
    product.photo || '/noimage.webp',
    product.photo || '/noimage.webp',
    product.photo || '/noimage.webp',
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <nav className="text-sm mb-6 text-gray-600">
        <span>Home</span>
        <span className="mx-2">›</span>
        <span>{product.brand?.name}</span>
        <span className="mx-2">›</span>
        <span className="text-gray-900 font-medium">{product.name}</span>
      </nav>

      {/* Product Header */}
      <h1 className="text-3xl font-bold text-gray-900 mb-8">{product.name}</h1>

      {/* Product Info Section - Now at Top */}
      <div className="mb-8 p-6 bg-white border border-gray-200 rounded-xl">
        <div className="flex flex-wrap gap-4 items-center mb-6">
          {/* Coming Soon Badge */}
          <span className="bg-teal-500 text-white text-sm font-semibold px-4 py-2 rounded-md">
            COMING SOON
          </span>

          {/* Add to Compare */}
          <div className="flex items-center gap-2">
            <input type="checkbox" id="compare" className="w-4 h-4" />
            <label htmlFor="compare" className="text-sm font-medium cursor-pointer">
              Add to Compare
            </label>
          </div>
        </div>

        {/* Product Meta */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 text-sm">
          <div>
            <span className="text-gray-600">Brand:</span>
            <span className="ml-2 font-semibold text-gray-900">{product.brand?.name || 'N/A'}</span>
          </div>
          <div>
            <span className="text-gray-600">Category:</span>
            <span className="ml-2 font-semibold text-gray-900">{product.category?.name || 'N/A'}</span>
          </div>
          <div>
            <span className="text-gray-600">Added on:</span>
            <span className="ml-2 text-gray-700">
              {product.created_at ? new Date(product.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Last updated:</span>
            <span className="ml-2 text-gray-700">
              {product.updated_at ? new Date(product.updated_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}
            </span>
          </div>
        </div>

        {/* Quick Specs with Icons */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {/* Released */}
          <div className="flex items-center gap-3 bg-blue-50 p-3 rounded-lg">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="min-w-0">
              <div className="text-xs text-gray-600">Released</div>
              <div className="text-xs font-semibold text-gray-900 truncate">
                {product.created_at ? `Exp. ${new Date(product.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}` : 'Soon'}
              </div>
            </div>
          </div>

          {/* OS */}
          <div className="flex items-center gap-3 bg-green-50 p-3 rounded-lg">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="min-w-0">
              <div className="text-xs text-gray-600">OS</div>
              <div className="text-xs font-semibold text-gray-900 truncate">Check Specs</div>
            </div>
          </div>

          {/* Display */}
          <div className="flex items-center gap-3 bg-orange-50 p-3 rounded-lg">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="min-w-0">
              <div className="text-xs text-gray-600">Display</div>
              <div className="text-xs font-semibold text-gray-900 truncate">See Specs</div>
            </div>
          </div>

          {/* Camera */}
          <div className="flex items-center gap-3 bg-blue-50 p-3 rounded-lg">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div className="min-w-0">
              <div className="text-xs text-gray-600">Camera</div>
              <div className="text-xs font-semibold text-gray-900 truncate">See Specs</div>
            </div>
          </div>

          {/* RAM */}
          <div className="flex items-center gap-3 bg-blue-50 p-3 rounded-lg">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
              </svg>
            </div>
            <div className="min-w-0">
              <div className="text-xs text-gray-600">RAM</div>
              <div className="text-xs font-semibold text-gray-900 truncate">See Specs</div>
            </div>
          </div>

          {/* Battery */}
          <div className="flex items-center gap-3 bg-blue-50 p-3 rounded-lg">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="min-w-0">
              <div className="text-xs text-gray-600">Battery</div>
              <div className="text-xs font-semibold text-gray-900 truncate">See Specs</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Left: Product Images */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 rounded-2xl p-8 aspect-[4/3] relative overflow-hidden">
            <Image
              src={selectedImage}
              alt={product.name}
              fill
              className="object-contain"
            />
          </div>

          {/* Thumbnail Images */}
          <div className="grid grid-cols-4 gap-3">
            {productImages.map((img, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(img)}
                className={`aspect-square rounded-lg border-2 overflow-hidden transition-all ${selectedImage === img ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200 hover:border-gray-300'
                  }`}
              >
                <div className="relative w-full h-full bg-gray-50">
                  <Image
                    src={img}
                    alt={`${product.name} ${index + 1}`}
                    fill
                    className="object-contain p-2"
                  />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews Section - Shows all reviews with ratings and details */}

      {/* Specifications Table */}
      <div className="mt-12">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <p className="text-sm text-yellow-800">Unofficial specifications</p>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-6">Specifications</h2>
        <SpecDetails productId={product.id} countryCode={countryCode} />
      </div>

      <ProductReviewsSection productId={product.id} countryCode={countryCode} />

    </div>
  );
};

export default ProducDetails;
