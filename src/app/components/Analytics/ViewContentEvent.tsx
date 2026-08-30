'use client';

import { getApiUrl } from '@/lib/apiUrl';
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

    // This is the only place a real product-detail page view runs on the
    // client, so it also owns bumping the backend views_count - the prior
    // increment-views call site (SourceMedia.tsx, nested under a review's
    // additional_details) was dead code, never reachable from this route,
    // which is why views_count stayed 0 for every product.
    fetch(`${getApiUrl()}/products/${productId}/increment-views`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }).catch(() => {
      // View counting is best-effort; a failed beacon shouldn't affect the page.
    });
  }, [category, price, productId, productName]);

  return null;
}
