'use client';

import { useEffect } from 'react';

interface ViewContentEventProps {
  productId: number;
  productName: string;
  category: string;
  price: number;
}

export default function ViewContentEvent({
  productId,
  productName,
  category,
  price,
}: ViewContentEventProps) {
  useEffect(() => {
    const fbq = (window as Window & {
      fbq?: (...args: unknown[]) => void;
    }).fbq;

    fbq?.('track', 'ViewContent', {
      content_ids: [String(productId)],
      content_name: productName,
      content_type: 'product',
      content_category: category,
      value: price,
      currency: 'BDT',
    });
  }, [category, price, productId, productName]);

  return null;
}
