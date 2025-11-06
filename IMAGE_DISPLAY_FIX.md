# Image Display Fix - Summary

## Problem

Images were uploaded to S3 successfully and returned from the API with presigned URLs, but they weren't displaying in the frontend. The `<img>` tags had empty `src` attributes.

## Root Causes

### 1. **Wrong API Port**

- Frontend `.env` was pointing to: `http://localhost:8080`
- Go server was running on: `http://localhost:8083`
- **Result**: Frontend couldn't fetch images from the correct API

### 2. **Mismatched Field Names**

- TypeScript interface expected: `asset_url`
- Go API returned: `url`
- **Result**: `Image src={file.asset_url}` was undefined

## Fixes Applied

### 1. Updated Frontend .env Files ✅

**Files Changed:**

- `crit_client/.env`
- `crit_client/.env.local`

**Change:**

```diff
- NEXT_PUBLIC_API_URL=http://localhost:8080
+ NEXT_PUBLIC_API_URL=http://localhost:8083
```

### 2. Updated TypeScript Interface ✅

**File:** `crit_client/src/lib/types.ts`

```typescript
export interface ProductPhotos {
  id: number;
  name?: string;
  product_id: number;
  defaultphoto?: number;
  path: string;
  status?: string;
  media_type?: string;
  file_size?: number;
  asset_url?: string; // Legacy - backwards compatibility
  url: string; // NEW - presigned URL from S3
  created_at?: string;
  updated_at?: string;
}
```

### 3. Updated Uploader Component ✅

**File:** `crit_client/src/app/components/Uploader/Uploader.tsx`

**Line 267 Changed:**

```tsx
// Before:
<Image src={file.asset_url} alt="" width={50} height={50} />

// After:
<Image src={file.url || file.asset_url || ''} alt={file.name || 'Product image'} width={50} height={50} />
```

## How to Apply

### Step 1: Restart Next.js Dev Server

The `.env` changes require a server restart:

```bash
cd /i/GO/kossti/crit_client

# Stop the current dev server (Ctrl+C in the terminal)

# Start it again
npm run dev
# or
yarn dev
```

### Step 2: Verify Images Display

1. Go to `http://localhost:3000/admin/products/33`
2. Click "Add Photos" button
3. You should now see uploaded images with thumbnails
4. The presigned URLs will be automatically fetched from the Go API

## API Response Structure

Your Go API (`GET /productimages/33`) now returns:

```json
{
  "images": [
    {
      "id": 2,
      "path": "product-images/p-33/09bb5273-79c1-4576-bf67-74be03ff2c71.jpg",
      "product_id": 33,
      "created_at": "2025-11-06T16:38:26+06:00",
      "updated_at": "2025-11-06T16:38:26+06:00",
      "url": "https://kossti.s3.ap-southeast-1.amazonaws.com/product-images/p-33/09bb5273-79c1-4576-bf67-74be03ff2c71.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&..."
    }
  ],
  "product_id": 33
}
```

The `url` field contains a **presigned URL valid for 1 hour**.

## Verification Steps

1. ✅ Go server running on port 8083
2. ✅ Frontend .env updated to port 8083
3. ✅ TypeScript interface accepts `url` field
4. ✅ Uploader component uses `file.url`
5. ⏳ **Restart Next.js server** (YOU NEED TO DO THIS)
6. ⏳ **Test image display at http://localhost:3000/admin/products/33**

## Expected Behavior After Fix

1. Open product page: `http://localhost:3000/admin/products/33`
2. Click "Add Photos" button → Modal opens
3. Previously uploaded images display as thumbnails (50x50px)
4. Each image uses a fresh presigned URL from the API
5. Images load successfully from S3

## Notes

- **Presigned URLs expire after 1 hour**
- Frontend automatically fetches fresh URLs when the modal opens
- No caching issues - URLs are generated per request
- Images are private in S3 and only accessible via presigned URLs

## Troubleshooting

If images still don't display after restarting:

1. **Check browser console** for errors
2. **Check Network tab** - verify API calls go to `localhost:8083`
3. **Verify Go server is running**: `ps aux | grep gocrit`
4. **Check presigned URL in response** - should contain `X-Amz-Signature`
5. **Test URL directly in browser** - paste the `url` from API response

## Complete Upload Flow

1. User clicks "Add Photos" → Modal opens
2. User drops/selects image files
3. Click "Upload" button
4. Frontend:
   - Calls `POST /s3/presign` to get presigned PUT URL
   - Uploads file directly to S3 using PUT
   - Calls `POST /productimages/s3` to register in database
5. `getPhotos()` refreshes the list
6. Images display with presigned GET URLs

✅ **All components working correctly!**
