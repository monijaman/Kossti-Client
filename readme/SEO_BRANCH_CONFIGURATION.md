# SEO Branch Configuration Guide

## Overview
This configuration ensures that **only the main branch** (production) is indexed by search engines, while the **develop branch** blocks all crawlers.

## Implementation

### 1. Environment Variable Control
A new environment variable `NEXT_PUBLIC_ALLOW_INDEXING` controls SEO indexing:
- **develop branch**: `NEXT_PUBLIC_ALLOW_INDEXING=false` (blocks indexing)
- **main branch**: `NEXT_PUBLIC_ALLOW_INDEXING=true` (allows indexing)

### 2. Multiple Protection Layers

#### Layer 1: robots.txt
- Develop: Returns `Disallow: /` for all user agents
- Main: Returns normal rules allowing indexing

#### Layer 2: Meta Robots Tags
- Develop: Adds `noindex, nofollow` meta tags to all pages
- Main: No blocking tags, allows normal indexing

## Setup Instructions

### For Railway Deployment

#### Main Branch (Production)
1. Go to Railway dashboard for your **main branch** deployment
2. Navigate to **Variables** section
3. Add the following environment variable:
   ```
   NEXT_PUBLIC_ALLOW_INDEXING=true
   ```
4. Redeploy the service

#### Develop Branch
1. Go to Railway dashboard for your **develop branch** deployment
2. Navigate to **Variables** section
3. Add the following environment variable:
   ```
   NEXT_PUBLIC_ALLOW_INDEXING=false
   ```
   (or simply don't set it - defaults to false)
4. Redeploy the service

### For Local Development
The `.env` file is already configured with `NEXT_PUBLIC_ALLOW_INDEXING=false` to prevent accidental indexing during development.

## Verification

### Check robots.txt
- **Develop**: Visit `https://your-develop-domain.com/robots.txt`
  - Should show: `User-agent: *` and `Disallow: /`
  
- **Main**: Visit `https://kossti.com/robots.txt`
  - Should show: `User-agent: *`, `Allow: /`, and disallow only specific paths

### Check Meta Tags
- **Develop**: View page source on any page
  - Should contain: `<meta name="robots" content="noindex, nofollow">`
  
- **Main**: View page source on any page
  - Should NOT contain blocking meta robots tags

### Using Google Search Console
1. Submit both URLs to Google Search Console
2. Check "URL Inspection" tool:
   - Develop URL should show "Indexing not allowed"
   - Main URL should show "URL is on Google" or "URL can be indexed"

## Technical Details

### Modified Files
1. `src/app/robots.ts` - Dynamic robots.txt based on environment
2. `src/app/layout.tsx` - Conditional meta robots tags
3. `.env` - Added `NEXT_PUBLIC_ALLOW_INDEXING=false`
4. `.env.example` - Added configuration example

### How It Works
```typescript
// robots.ts
const allowIndexing = process.env.NEXT_PUBLIC_ALLOW_INDEXING === 'true';
if (!allowIndexing) {
  return { rules: [{ userAgent: "*", disallow: "/" }] };
}

// layout.tsx
const allowIndexing = process.env.NEXT_PUBLIC_ALLOW_INDEXING === 'true';
export const metadata = {
  ...(!allowIndexing && {
    robots: {
      index: false,
      follow: false,
      nocache: true,
    }
  })
};
```

## Best Practices

1. **Always verify** after deployment that the correct setting is applied
2. **Never set** `NEXT_PUBLIC_ALLOW_INDEXING=true` on develop/staging environments
3. **Monitor** Google Search Console to ensure develop URLs aren't being indexed
4. **Use password protection** or IP whitelisting as additional security for staging environments if needed

## Troubleshooting

### Issue: Develop branch is being indexed
- Check environment variable is set correctly in Railway
- Clear browser cache and check robots.txt
- Use Google Search Console to request removal of indexed pages

### Issue: Main branch is not being indexed
- Verify `NEXT_PUBLIC_ALLOW_INDEXING=true` is set in Railway variables
- Check robots.txt returns correct rules
- Submit sitemap to Google Search Console
- Ensure no other blocking mechanisms (htaccess, cloudflare, etc.)

## Additional Security (Optional)

For extra protection on develop branch, consider:
1. **Password protection** using HTTP Basic Auth
2. **IP whitelisting** in Railway or your DNS provider
3. **Custom domain** that clearly indicates it's staging (e.g., `dev.kossti.com`)
4. **X-Robots-Tag HTTP header** in next.config.ts (for API routes)
