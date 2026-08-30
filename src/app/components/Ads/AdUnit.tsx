'use client';
import Script from 'next/script';
import { usePathname } from 'next/navigation';

export function InArticleAd({ className = 'my-6' }: { className?: string }) {
  const pathname = usePathname();
  if (pathname.startsWith('/admin')) return null;

  return (
    <div className={className}>
      <Script
        src="https://pl31067810.profitableratecpmnetwork.com/8d/00/60/8d0060f66fb0c9bab4c92f3aa12ea71a.js"
        strategy="lazyOnload"
      />
      <Script async data-cfasync="false" src="https://pl31067812.profitableratecpmnetwork.com/4a0242cb9442389ee9397d2284e8077c/invoke.js" />
      <div id="container-4a0242cb9442389ee9397d2284e8077c" />
      <Script
        src="https://pl31067813.profitableratecpmnetwork.com/41/80/a0/4180a011ef3c5c2a5fb6c32e3026e05f.js"
        strategy="lazyOnload"
      />
    </div>
  );
}
