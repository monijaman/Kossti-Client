'use client';
import Script from 'next/script';
import { usePathname } from 'next/navigation';

export function InArticleAd({ className = 'my-6' }: { className?: string }) {
  const pathname = usePathname();
  if (pathname.startsWith('/admin')) return null;

  return (
    <div className={className}>
      <Script async data-cfasync="false" src="https://pl31067812.profitableratecpmnetwork.com/4a0242cb9442389ee9397d2284e8077c/invoke.js" />
      <div id="container-4a0242cb9442389ee9397d2284e8077c" />
    </div>
  );
}
