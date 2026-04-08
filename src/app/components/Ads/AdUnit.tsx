'use client';

import { useEffect } from 'react';

interface AdUnitProps {
  slot: string;
  format?: 'auto' | 'fluid' | 'rectangle' | 'horizontal' | 'vertical';
  layout?: 'in-article' | '';
  textAlign?: 'center' | 'left' | 'right';
  responsive?: boolean;
  className?: string;
}

export default function AdUnit({
  slot,
  format = 'auto',
  layout = '',
  textAlign,
  responsive = true,
  className = '',
}: AdUnitProps) {
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {}
  }, []);

  const inlineStyle: React.CSSProperties = {
    display: 'block',
    ...(textAlign ? { textAlign } : {}),
  };

  return (
    <div className={className}>
      <ins
        className="adsbygoogle"
        style={inlineStyle}
        data-ad-client="ca-pub-8172172530139900"
        data-ad-slot={slot}
        data-ad-format={format}
        {...(layout ? { 'data-ad-layout': layout } : {})}
        {...(format !== 'fluid' ? { 'data-full-width-responsive': responsive ? 'true' : 'false' } : {})}
      />
    </div>
  );
}

// Pre-built in-article variant — just drop <InArticleAd /> anywhere in content
export function InArticleAd({ className = 'my-6' }: { className?: string }) {
  return (
    <AdUnit
      slot="8094761443"
      format="fluid"
      layout="in-article"
      textAlign="center"
      className={className}
    />
  );
}
