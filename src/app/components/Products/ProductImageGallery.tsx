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
    <div className="w-full flex flex-row gap-4 md:gap-6 mb-8 md:mb-12">
      {/* Left: Main Image — 70% */}
      <div className="w-[70%] bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 rounded-2xl p-8 aspect-[4/3] relative overflow-hidden flex-shrink-0">
        <Image
          src={selectedImage}
          alt={productName}
          fill
          className="object-contain"
        />
      </div>

      {/* Right: Thumbnails — 30%, horizontal row, vertically centered */}
      <div className="w-[30%] flex flex-row flex-wrap justify-center items-center gap-2 md:gap-3">
        {productImages.map((img, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(img)}
            className={`w-[44%] aspect-square rounded-lg border-2 overflow-hidden transition-all cursor-pointer hover:border-blue-400 ${
              selectedImage === img ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'
            }`}
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
