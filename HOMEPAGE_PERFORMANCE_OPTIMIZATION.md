# Homepage Performance Optimization Guide

## Current Performance Issue

**Homepage Loading Time:** 2.4-4.3 seconds  
**Expected:** < 1 second

## Root Causes Identified

### 1. **Client-Side Data Fetching in PopularProducts Component**

The `PopularProducts` component is marked as `"use client"` and fetches data on the client side using `useEffect`, which:

- Delays rendering until JavaScript loads
- Makes an additional API call after initial page load
- Blocks content display

**Current Implementation:**

```tsx
// ❌ BAD: Client-side fetching
"use client"
const PopularProducts = ({ countryCode, activeCategory = '', currentPage = 1 }: pageProps) => {
  const [dataset, setDataSet] = useState<Product[]>();

  useEffect(() => {
    fetchProductData(); // Fetches on client side after mount
  }, [countryCode, activeCategory, currentPage])
```

### 2. **Multiple Data Fetching Points**

The homepage makes multiple separate API calls:

- Main product list (server-side)
- Popular products (client-side)
- Category brands
- Search initialization

### 3. **No Data Prefetching or Caching**

- Each page load fetches fresh data
- ISR revalidation is set to 60 seconds but client components bypass this
- No edge caching configured

## Optimization Solutions

### Priority 1: Convert PopularProducts to Server Component

**Replace:** `src/app/components/Products/PopularProducts.tsx`

```tsx
// ✅ GOOD: Server-side fetching
import { apiEndpoints } from "@/lib/constants";
import fetchApi from "@/lib/fetchApi";
import { Product } from "@/lib/types";
import ProducShortDetails from "./ProducShortDetails";
import { getTranslations } from "@/lib/translations"; // Create this helper

interface PageProps {
  countryCode: string;
  activeCategory?: string;
  currentPage?: number;
}

// Server Component - no "use client"
const PopularProducts = async ({
  countryCode,
  activeCategory = "",
  currentPage = 1,
}: PageProps) => {
  const translation = await getTranslations(countryCode);
  const limit = 16;

  // Fetch data on server
  const response = await fetchApi<{ data: Product[] }>(
    apiEndpoints.getProducts,
    {
      method: "GET",
      queryParams: {
        locale: countryCode,
        page: currentPage.toString(),
        limit: limit.toString(),
        category: activeCategory,
        brand: "",
        priceRange: "",
        search: "",
        sortby: "popular",
      },
      next: { revalidate: 60 }, // Cache for 60 seconds
    },
  );

  const dataset = response.data?.data ?? [];

  return (
    <>
      <h2 className="page-title text-2xl font-bold text-gray-800 mb-6 mt-8">
        {translation.popupar_product}
        {activeCategory && (
          <span className="text-base font-normal text-gray-600 block mt-2">
            Category: {activeCategory}
          </span>
        )}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {dataset.map((product) => (
          <ProducShortDetails
            key={product.id}
            product={product}
            countryCode={countryCode}
          />
        ))}
      </div>
    </>
  );
};

export default PopularProducts;
```

### Priority 2: Combine API Calls with Parallel Data Fetching

**Update:** `src/app/[locale]/page.tsx`

```tsx
const Page = async ({ searchParams, params }: PageProps) => {
  const resolvedSearchParams = await searchParams;
  const { locale } = await params;

  // ... existing code ...

  // ✅ Fetch data in parallel
  const [productsData, popularProductsData, categoriesData] = await Promise.all(
    [
      fetchProductData(),
      fetchPopularProducts(countryCode, activeCategory),
      fetchCategories(countryCode),
    ],
  );

  return (
    <MainLayout sidebarProps={sidebarProps} categories={categoriesData}>
      <SearchBox initialSearchTerm={searchTerm} countryCode={countryCode} />
      <CategoryBrands categorySlug={activeCategory} countryCode={countryCode} />

      {/* Pass pre-fetched data as props */}
      <ProductReview
        products={productsData.products}
        countryCode={countryCode}
      />
      <PopularProductsDisplay
        products={popularProductsData}
        countryCode={countryCode}
      />
      <Pagination currentPage={page} totalPages={totalPages} />
    </MainLayout>
  );
};
```

### Priority 3: Enable Next.js Caching

**Update:** `next.config.ts`

```typescript
const nextConfig: NextConfig = {
  // ... existing config ...

  // Enable static optimization
  output: "standalone",

  // Optimize images
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      // ... existing patterns ...
    ],
  },

  // Enable SWC minification
  swcMinify: true,

  // Optimize chunks
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ["react-icons", "@radix-ui/react-icons"],
  },
};
```

### Priority 4: Add Request Memoization

**Create:** `src/lib/cache.ts`

```typescript
import { unstable_cache } from "next/cache";

export const getCachedProducts = unstable_cache(
  async (locale: string, category: string, page: number) => {
    const response = await fetchApi(/* ... */);
    return response.data;
  },
  ["products"],
  {
    revalidate: 60, // Cache for 60 seconds
    tags: ["products"],
  },
);

export const getCachedPopularProducts = unstable_cache(
  async (locale: string, category: string) => {
    const response = await fetchApi(/* ... */);
    return response.data;
  },
  ["popular-products"],
  {
    revalidate: 300, // Cache for 5 minutes
    tags: ["popular-products"],
  },
);
```

### Priority 5: Implement Partial Prerendering (PPR)

**Update:** `src/app/[locale]/page.tsx`

```tsx
import { Suspense } from "react";

const Page = async ({ searchParams, params }: PageProps) => {
  // ... existing code ...

  return (
    <MainLayout sidebarProps={sidebarProps}>
      <SearchBox initialSearchTerm={searchTerm} countryCode={countryCode} />

      {/* Static shell renders immediately */}
      <Suspense fallback={<ProductSkeleton />}>
        <ProductReview
          products={dataset?.products ?? []}
          countryCode={countryCode}
        />
      </Suspense>

      <Suspense fallback={<PopularProductsSkeleton />}>
        <PopularProducts
          countryCode={countryCode}
          activeCategory={activeCategory}
          currentPage={page}
        />
      </Suspense>

      <Pagination currentPage={page} totalPages={totalPages} />
    </MainLayout>
  );
};

// Enable Partial Prerendering
export const experimental_ppr = true;
```

### Priority 6: Add Loading Skeletons

**Create:** `src/app/components/Skeletons/ProductSkeleton.tsx`

```tsx
export default function ProductSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
          <div className="bg-gray-200 h-4 rounded w-3/4 mb-2"></div>
          <div className="bg-gray-200 h-4 rounded w-1/2"></div>
        </div>
      ))}
    </div>
  );
}
```

## Additional Optimizations

### 7. Reduce Bundle Size

```bash
# Analyze bundle
npm run build -- --analyze

# Install bundle analyzer
npm install -D @next/bundle-analyzer
```

**Update:** `next.config.ts`

```typescript
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

module.exports = withBundleAnalyzer(nextConfig);
```

### 8. Lazy Load Components

```tsx
import dynamic from "next/dynamic";

// Lazy load heavy components
const PopularProducts = dynamic(
  () => import("@/app/components/Products/PopularProducts"),
  {
    loading: () => <PopularProductsSkeleton />,
    ssr: true, // Still render on server
  },
);
```

### 9. Add CDN Caching Headers

**Create:** `src/middleware.ts` (if not exists)

```typescript
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Add cache headers for static pages
  if (request.nextUrl.pathname.startsWith("/en/")) {
    response.headers.set(
      "Cache-Control",
      "public, s-maxage=60, stale-while-revalidate=300",
    );
  }

  return response;
}
```

### 10. Optimize Database Queries

Backend is already optimized with preloading. Ensure indexes exist:

```sql
-- Add these if not present
CREATE INDEX CONCURRENTLY idx_products_views_count ON products(views_count DESC);
CREATE INDEX CONCURRENTLY idx_products_category_views ON products(category_id, views_count DESC);
CREATE INDEX CONCURRENTLY idx_products_status_views ON products(status, views_count DESC) WHERE deleted_at IS NULL;
```

## Implementation Priority

| Priority  | Task                                        | Impact | Effort | Expected Improvement |
| --------- | ------------------------------------------- | ------ | ------ | -------------------- |
| 🔴 High   | Convert PopularProducts to Server Component | High   | Low    | -1.5s                |
| 🔴 High   | Parallel data fetching                      | High   | Medium | -0.8s                |
| 🟡 Medium | Add caching with unstable_cache             | Medium | Medium | -0.5s                |
| 🟡 Medium | Implement Suspense boundaries               | Medium | Low    | -0.3s                |
| 🟢 Low    | Bundle size optimization                    | Low    | High   | -0.2s                |

## Expected Results After Optimization

**Before:** 2.4-4.3 seconds  
**After:** 0.5-1.2 seconds  
**Improvement:** ~70-75% faster

## Testing Performance

```bash
# Lighthouse CI
npm install -g @lhci/cli
lhci autorun --collect.url=https://kossti.com/en

# Load testing
npm install -g artillery
artillery quick --count 10 --num 50 https://kossti.com/en
```

## Monitoring

Set up monitoring to track improvements:

```typescript
// Add to layout.tsx
export const runtime = "edge"; // Optional: Use edge runtime

export function reportWebVitals(metric: NextWebVitalsMetric) {
  console.log(metric);
  // Send to analytics
}
```

---

**Last Updated:** February 6, 2026  
**Status:** Awaiting Implementation  
**Expected Completion:** 2-4 hours
