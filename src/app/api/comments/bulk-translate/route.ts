import { NextRequest, NextResponse } from "next/server";
import fetchApi from "@/lib/fetchApi";
import { apiEndpoints } from "@/lib/constants";
import { cookies } from "next/headers";
import { translateCommentsTobengali } from "@/lib/openai-service";

interface BulkTranslateRequest {
  productId: number;
}

export async function POST(request: NextRequest) {
  try {
    console.log("[DEBUG] bulk-translate endpoint called");
    const body: BulkTranslateRequest = await request.json();
    const { productId } = body;

    if (!productId) {
      console.error("[ERROR] Missing productId");
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    // Get access token from cookies
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value || "";

    // Fetch all comments for this product
    console.log(`[DEBUG] Fetching comments for product ${productId}`);
    const commentsResponse = await fetchApi(
      apiEndpoints.getCommentsByProductId(productId),
      {
        method: "GET",
        accessToken,
      }
    );

    console.log("[DEBUG] Comments response:", JSON.stringify(commentsResponse, null, 2));

    if (!commentsResponse.success) {
      console.error("[ERROR] Failed to fetch comments:", commentsResponse.error);
      return NextResponse.json(
        { error: commentsResponse.error || "Failed to fetch comments for this product" },
        { status: 400 }
      );
    }

    let comments = commentsResponse.data;
    
    // Handle nested data structure
    if (comments && typeof comments === 'object' && !Array.isArray(comments)) {
      const commentObj = comments as Record<string, unknown>;
      if (Array.isArray(commentObj.data)) {
        comments = commentObj.data;
      }
    }

    if (!Array.isArray(comments)) {
      console.error("[ERROR] Comments is not an array:", typeof comments);
      return NextResponse.json(
        { error: "Failed to fetch comments for this product" },
        { status: 400 }
      );
    }

    const commentsList = comments as Array<{
      id: number;
      comment: string;
      username: string;
      [key: string]: unknown;
    }>;

    console.log(`[DEBUG] Found ${commentsList.length} comments for product ${productId}`);

    if (commentsList.length === 0) {
      return NextResponse.json({
        success: true,
        translatedCount: 0,
        message: "No comments found to translate",
      });
    }

    // Translate comments to Bengali
    let translatedCount = 0;
    const translationMap = new Map<string, string>();

    try {
      console.log(`[DEBUG] Translating ${commentsList.length} comments to Bengali`);
      
      // Map comments to AIComment format with required fields
      const commentsForTranslation = commentsList.map(comment => ({
        username: String(comment.username || 'Anonymous'),
        location: String(comment.location || ''),
        comment: String(comment.comment),
        sourceUrl: String(comment.sourceUrl || ''),
      })) as Array<{
        username: string;
        location: string;
        comment: string;
        sourceUrl: string;
      }>;
      
      const translatedComments = await translateCommentsTobengali(commentsForTranslation);
      console.log(`[DEBUG] Translated comments:`, translatedComments);

      // Create a map of original English text to Bengali translation
      translatedComments.forEach((comment) => {
        if (comment.commentBn) {
          translationMap.set(comment.comment, comment.commentBn);
        }
      });
    } catch (error) {
      console.error("Failed to translate comments via OpenAI:", error);
      return NextResponse.json(
        { error: "Failed to translate comments using OpenAI service" },
        { status: 500 }
      );
    }

    // Save translations to comment_translations table (create or update)
    for (const comment of commentsList) {
      const bengaliText = translationMap.get(comment.comment);
      if (bengaliText) {
        try {
          console.log(
            `[DEBUG] Saving/updating Bengali translation for comment ${comment.id}: ${bengaliText.substring(0, 30)}...`
          );
          
          // Use upsert endpoint to create or update
          const translationResponse = await fetchApi(
            "/comment-translations/upsert",
            {
              method: "POST",
              accessToken,
              body: {
                comment_id: comment.id,
                locale: "bn",
                comment: bengaliText,
              },
            }
          );

          if (translationResponse.success) {
            translatedCount++;
            console.log(
              `[DEBUG] Translation saved/updated for comment ${comment.id}`
            );
          } else {
            console.error(
              `[ERROR] Failed to save translation for comment ${comment.id}:`,
              translationResponse.error
            );
          }
        } catch (error) {
          console.error(
            `[ERROR] Error saving translation for comment ${comment.id}:`,
            error
          );
        }
      }
    }

    console.log(`[SUCCESS] Translated and saved ${translatedCount} comments`);
    return NextResponse.json({
      success: true,
      translatedCount,
      message: `Successfully translated ${translatedCount} comments`,
    });
  } catch (error) {
    console.error("[ERROR] bulk-translate endpoint error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to translate comments",
      },
      { status: 500 }
    );
  }
}
