/**
 * Real Comments Service
 * Fetches actual comments from Reddit, Facebook, and Amazon
 */

import { AIComment } from "./openai-service";

// Environment variables needed:
// NEXT_PUBLIC_REDDIT_CLIENT_ID
// NEXT_PUBLIC_REDDIT_CLIENT_SECRET
// NEXT_PUBLIC_FACEBOOK_ACCESS_TOKEN
// NEXT_PUBLIC_AMAZON_API_KEY

interface RedditComment {
  author: string;
  body: string;
  subreddit: string;
}

interface RedditChild {
  data: RedditComment;
}

interface FacebookPost {
  message: string;
  from: { name: string };
}

interface AmazonReview {
  verified_purchase: boolean;
  reviewer: string;
  body: string;
}

/**
 * Fetch real comments from Reddit
 */
export async function fetchRedditComments(productName: string): Promise<AIComment[]> {
  try {
    const clientId = process.env.NEXT_PUBLIC_REDDIT_CLIENT_ID;
    const clientSecret = process.env.NEXT_PUBLIC_REDDIT_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      console.warn("Reddit API credentials not configured");
      return [];
    }

    // Get Reddit OAuth token
    const authResponse = await fetch("https://www.reddit.com/api/v1/access_token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    });

    if (!authResponse.ok) {
      console.error("Failed to authenticate with Reddit API");
      return [];
    }

    const authData = await authResponse.json();
    const accessToken = authData.access_token;

    // Search for product comments on Reddit
    const searchResponse = await fetch(
      `https://oauth.reddit.com/search?q=${encodeURIComponent(productName)}&type=comment&limit=25&sort=new`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "User-Agent": "product-review-collector/1.0",
        },
      }
    );

    if (!searchResponse.ok) {
      console.error("Failed to fetch Reddit comments");
      return [];
    }

    const data = await searchResponse.json();
    const comments: AIComment[] = [];

    if (data.data && data.data.children) {
      data.data.children.forEach((item: RedditChild) => {
        const comment = item.data;
        if (comment.body && comment.body.length > 10) {
          comments.push({
            username: comment.author || "Anonymous",
            location: "", // Reddit doesn't provide location
            comment: comment.body.substring(0, 150),
            sourceUrl: `https://www.reddit.com/r/${comment.subreddit}`,
          });
        }
      });
    }

    return comments;
  } catch (error) {
    console.error("Error fetching Reddit comments:", error);
    return [];
  }
}

/**
 * Fetch real comments from Facebook
 */
export async function fetchFacebookComments(productName: string): Promise<AIComment[]> {
  try {
    const accessToken = process.env.NEXT_PUBLIC_FACEBOOK_ACCESS_TOKEN;

    if (!accessToken) {
      console.warn("Facebook API credentials not configured");
      return [];
    }

    // Search for posts related to the product
    const searchResponse = await fetch(
      `https://graph.facebook.com/v18.0/search?q=${encodeURIComponent(
        productName
      )}&type=post&limit=25&fields=id,message,from,created_time&access_token=${accessToken}`
    );

    if (!searchResponse.ok) {
      console.error("Failed to fetch Facebook posts");
      return [];
    }

    const data = await searchResponse.json();
    const comments: AIComment[] = [];

    if (data.data) {
      data.data.forEach((post: FacebookPost) => {
        if (post.message && post.message.length > 10) {
          comments.push({
            username: post.from?.name || "Anonymous",
            location: "", // Facebook doesn't provide location in basic API
            comment: post.message.substring(0, 150),
            sourceUrl: "https://www.facebook.com",
          });
        }
      });
    }

    return comments;
  } catch (error) {
    console.error("Error fetching Facebook comments:", error);
    return [];
  }
}

/**
 * Fetch real comments from Amazon
 * Note: Amazon doesn't have a public API for reviews
 * This uses web scraping as an alternative
 */
export async function fetchAmazonComments(productName: string): Promise<AIComment[]> {
  try {
    // Amazon requires special handling - we'll use a free API service
    const response = await fetch(
      `https://api.rainforest.ai/request?api_key=${process.env.NEXT_PUBLIC_AMAZON_API_KEY}&type=search&amazon_domain=amazon.com&search_term=${encodeURIComponent(
        productName
      )}&sort=REVIEWS_COUNT_NEWEST`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      console.error("Failed to fetch Amazon products");
      return [];
    }

    const data = await response.json();
    const comments: AIComment[] = [];

    // For each product found, try to get reviews
    if (data.search_results) {
      for (const product of data.search_results.slice(0, 1)) {
        // Get reviews for the top product
        const reviewResponse = await fetch(
          `https://api.rainforest.ai/request?api_key=${process.env.NEXT_PUBLIC_AMAZON_API_KEY}&type=product&amazon_domain=amazon.com&asin=${product.asin}&reviews=1`
        );

        if (reviewResponse.ok) {
          const reviewData = await reviewResponse.json();
          if (reviewData.reviews) {
            reviewData.reviews.forEach((review: AmazonReview) => {
              comments.push({
                username: review.verified_purchase ? `${review.reviewer}*` : review.reviewer,
                location: "", // Amazon reviews don't always have location
                comment: review.body.substring(0, 150),
                sourceUrl: "https://www.amazon.com",
              });
            });
          }
        }
      }
    }

    return comments;
  } catch (error) {
    console.error("Error fetching Amazon comments:", error);
    return [];
  }
}

/**
 * Fetch real comments from all platforms
 */
export async function fetchRealComments(productName: string): Promise<AIComment[]> {
  console.log(`[DEBUG] Fetching real comments for: ${productName}`);

  // Fetch from all platforms in parallel
  const [redditComments, facebookComments, amazonComments] = await Promise.all([
    fetchRedditComments(productName),
    fetchFacebookComments(productName),
    fetchAmazonComments(productName),
  ]);

  const allComments = [...redditComments, ...facebookComments, ...amazonComments];

  console.log(`[DEBUG] Fetched ${allComments.length} real comments from platforms`);

  // Return at least 25 comments, or all available
  return allComments.slice(0, 40);
}
