'use client';

import Image from 'next/image';
import { useState } from 'react';

interface ProductImageGalleryProps {
  productImages: string[];
  productName: string;
}

export default function ProductImageGallery({
  productImages,
  productName,
}: ProductImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(productImages[0] || '/noimage.webp');

  return (
    <div className="w-full flex flex-row gap-4 md:gap-6 mb-8 md:mb-12" style={{ maxHeight: '800px' }}>
      {/* Left: Main Image — 50% */}
      <div className="w-[50%] bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 rounded-2xl p-8 relative overflow-hidden flex-shrink-0" style={{ maxHeight: '800px', aspectRatio: 'auto' }}>
        <Image
          src={selectedImage}
          alt={productName}
          fill
          className="object-contain"
        />
      </div>

      {/* Right: Thumbnails — 50%, scrollable wrapping grid */}
      <div className="w-[50%] flex flex-row flex-wrap justify-center items-start content-start gap-2 overflow-y-auto" style={{ maxHeight: '800px' }}>
        {productImages.map((img, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(img)}
            className={`w-[44%] aspect-square rounded-lg border-2 overflow-hidden transition-all cursor-pointer hover:border-blue-400 ${
              selectedImage === img ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'
            }`}
            style={{ maxWidth: '180px', maxHeight: '180px' }}
          >
            <div className="relative w-full h-full bg-gray-50">
              <Image
                src={img}
                alt={`${productName} ${index + 1}`}
                fill
                className="object-contain p-1"
              />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
