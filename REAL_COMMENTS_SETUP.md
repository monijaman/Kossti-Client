# Real Comments Integration Setup Guide

This guide explains how to set up real comment fetching from Reddit, Facebook, and Amazon APIs.

## Overview

The system now attempts to fetch REAL comments from actual platforms:
1. **Reddit** - Uses Reddit API (PRAW)
2. **Facebook** - Uses Facebook Graph API
3. **Amazon** - Uses Rainforest API (for product reviews)

If APIs are not configured or insufficient comments are found, it falls back to AI-generated comments.

## Setup Instructions

### 1. Reddit API Setup

#### Get Reddit API Credentials:
1. Go to https://www.reddit.com/prefs/apps
2. Click "Create Application"
3. Fill in the form:
   - **name**: "Product Review Collector"
   - **type**: "script"
   - Accept terms and create
4. You'll see:
   - **Client ID** (under your app name)
   - **Client Secret** (next to Client ID)

#### Add to `.env.local`:
```
NEXT_PUBLIC_REDDIT_CLIENT_ID=your_client_id_here
NEXT_PUBLIC_REDDIT_CLIENT_SECRET=your_client_secret_here
```

---

### 2. Facebook API Setup

#### Get Facebook Access Token:
1. Go to https://developers.facebook.com/
2. Create an app or use existing one
3. Go to Settings > Basic to get:
   - **App ID**
   - **App Secret**
4. Go to Tools > Graph API Explorer
5. Select your app from the dropdown
6. Click "Generate Access Token"
7. Copy the access token

#### Add to `.env.local`:
```
NEXT_PUBLIC_FACEBOOK_ACCESS_TOKEN=your_access_token_here
```

---

### 3. Amazon Reviews API Setup

#### Using Rainforest API (Recommended):
1. Go to https://www.rainforest.ai/
2. Sign up for a free account
3. Get your API key from the dashboard
4. This API allows scraping Amazon product reviews legally

#### Add to `.env.local`:
```
NEXT_PUBLIC_AMAZON_API_KEY=your_rainforest_api_key_here
```

---

## Environment Variables Summary

Add all of these to your `.env.local` file:

```env
# Reddit API
NEXT_PUBLIC_REDDIT_CLIENT_ID=your_reddit_client_id
NEXT_PUBLIC_REDDIT_CLIENT_SECRET=your_reddit_client_secret

# Facebook API
NEXT_PUBLIC_FACEBOOK_ACCESS_TOKEN=your_facebook_access_token

# Amazon API (Rainforest)
NEXT_PUBLIC_AMAZON_API_KEY=your_rainforest_api_key
```

---

## How It Works

1. **When "Pull Comments" is clicked:**
   - System attempts to fetch from Reddit, Facebook, and Amazon in parallel
   - Collects all real comments from available APIs
   
2. **If 10+ comments are fetched:**
   - Uses real comments (returns up to 40)
   - Displays comments with real usernames, locations, and platform URLs

3. **If fewer than 10 real comments found:**
   - Falls back to AI-generated comments as backup
   - AI comments fill in the gaps to reach 25+ total

4. **All comments:**
   - Translated to Bengali using OpenAI
   - Saved to database with source URLs
   - Can be created/updated on subsequent pulls

---

## API Rate Limits

- **Reddit**: 60 requests per minute (per IP)
- **Facebook**: Depends on app type (usually 200 calls/day for testing)
- **Rainforest API**: Free tier has request limits (check their docs)

---

## Testing

To test if APIs are working:

1. Go to admin panel
2. Click "Pull Comments" for a product
3. Check browser console (F12) for logs showing:
   - `[DEBUG] Attempting to fetch real comments from platforms...`
   - `[DEBUG] Fetched X real comments from platforms`

If you see 0 comments and it falls back to AI, the APIs need configuration.

---

## Troubleshooting

### No comments are being fetched:
- Check `.env.local` has all API keys
- Restart the development server after adding env vars
- Check browser console for error messages

### "Failed to authenticate":
- Verify API keys are correct and not expired
- For Reddit: Make sure it's a "script" application type
- For Facebook: Token might be expired, regenerate it

### Limited results:
- API rate limits might be exceeded
- Reddit and Facebook have usage limits
- Consider using Rainforest for more reliable Amazon reviews

---

## Notes

- All API credentials are environment variables (NOT hardcoded)
- Comments are stored in the database once pulled
- Each platform provides different data availability
- Location info is often not available from APIs (left empty when not available)
