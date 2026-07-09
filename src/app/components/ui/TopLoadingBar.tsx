// Shown automatically by Next.js (via loading.tsx files) while a page's
// server-side data fetch is in flight — mounts on navigation start,
// unmounts as soon as the new page is ready. No JS timers needed; the
// sweeping animation is purely CSS and just signals "still working".
export default function TopLoadingBar() {
  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] h-1 overflow-hidden bg-transparent">
      <div className="h-full w-1/3 animate-top-loading-bar bg-gradient-to-r from-transparent via-red-600 to-transparent" />
    </div>
  );
}
