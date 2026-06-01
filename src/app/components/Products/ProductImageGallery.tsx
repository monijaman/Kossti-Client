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
    <div className="w-full flex flex-col md:flex-row gap-4 md:gap-6 mb-8 md:mb-12">
      {/* Left: Main Image */}
      <div className="w-full md:w-[50%] bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 rounded-2xl p-4 md:p-8 relative overflow-hidden flex-shrink-0" style={{ minHeight: '300px', height: '70vw', maxHeight: '800px', minWidth: 0 }}>
        <Image
          src={selectedImage}
          alt={productName}
          fill
          className="object-contain"
        />
      </div>

      {/* Right: Thumbnails — centered as a block, rows packed tight.. */}
      <div className="w-full md:w-[50%] flex items-center justify-center overflow-x-auto md:overflow-x-hidden md:overflow-y-auto" style={{ maxHeight: '800px' }}>
        <div className="flex flex-row flex-wrap justify-center content-start gap-0">
          {productImages.map((img, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(img)}
              className={`w-[250vw] h-[30vw] md:w-[44%] md:h-auto aspect-square flex-shrink-0 rounded-lg border-2 overflow-hidden transition-all cursor-pointer hover:border-blue-400 ${
                selectedImage === img ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'
              }`}
              style={{ minWidth: '180px', maxHeight: '120px' }}
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
    </div>
  );
}
