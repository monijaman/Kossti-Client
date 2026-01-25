import { NextRequest, NextResponse } from "next/server";
import fetchApi from "@/lib/fetchApi";
import { apiEndpoints } from "@/lib/constants";
import { cookies } from "next/headers";
import { translateCommentsTobengali } from "@/lib/openai-service";

interface CommentData {
  productId: number;
  comments: Array<{
    username: string;
    location: string;
    comment: string;
    sourceUrl: string;
    commentBn?: string;
  }>;
}

export async function POST(request: NextRequest) {
  try {
    console.log("[DEBUG] bulk-create endpoint called");
    const body: CommentData = await request.json();
    const { productId, comments: initialComments } = body;

    console.log(`[DEBUG] Received ${initialComments.length} comments for product ${productId}`);

    if (!productId || !initialComments || initialComments.length === 0) {
      console.error("[ERROR] Missing productId or comments");
      return NextResponse.json(
        { error: "Product ID and comments are required" },
        { status: 400 }
      );
    }

    // Translate comments to Bengali if not already translated
    let comments = initialComments;
    const commentsNeedingTranslation = comments.filter((c) => !c.commentBn);
    if (commentsNeedingTranslation.length > 0) {
      try {
        const translatedComments =
          await translateCommentsTobengali(commentsNeedingTranslation);
        // Update comments with Bengali translations
        comments = comments.map((comment) => {
          const translated = translatedComments.find(
            (t) => t.comment === comment.comment
          );
          return {
            ...comment,
            commentBn: translated?.commentBn || comment.comment,
          };
        });
      } catch (error) {
        console.error("Failed to translate comments, continuing without Bengali translations:", error);
      }
    }

    // Get access token from cookies
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value || "";

    // Save each comment to the backend
    const savedComments = [];

    for (const comment of comments) {
      try {
        // Save the main comment
        console.log(`[DEBUG] Saving comment: ${comment.username} - ${comment.comment.substring(0, 30)}...`);
        const response = await fetchApi(apiEndpoints.createComment(), {
          method: "POST",
          accessToken,
          body: {
            product_id: productId,
            username: comment.username,
            location: comment.location,
            comment: comment.comment,
            src: comment.sourceUrl,
          },
        });

        console.log(`[DEBUG] Comment save response:`, response);

        if (response.success && response.data) {
          const commentData = response.data as { id?: number };
          const commentId = commentData.id;

          console.log(`[DEBUG] Comment saved with ID: ${commentId}`);

          // Save Bengali translation
          if (commentId && comment.commentBn && comment.commentBn !== comment.comment) {
            try {
              console.log(`[DEBUG] Saving Bengali translation for comment ${commentId}`);
              const translationResponse = await fetchApi("/comment-translations", {
                method: "POST",
                accessToken,
                body: {
                  comment_id: commentId,
                  locale: "bn",
                  comment: comment.commentBn,
                },
              });
              console.log(`[DEBUG] Translation response:`, translationResponse);
            } catch (translationError) {
              console.error(
                `[ERROR] Error saving Bengali translation for comment ${commentId}:`,
                translationError
              );
              // Continue even if translation save fails
            }
          }

          savedComments.push({
            ...response.data,
            commentBn: comment.commentBn,
          });
        }
      } catch (error) {
        console.error(`[ERROR] Error saving comment for product ${productId}:`, error);
        // Continue saving other comments even if one fails
      }
    }

    console.log(`[DEBUG] Successfully saved ${savedComments.length} out of ${comments.length} comments`);

    return NextResponse.json({
      success: true,
      count: savedComments.length,
      message: `Successfully saved ${savedComments.length} comments with Bengali translations`,
      comments: savedComments,
    });
  } catch (error) {
    console.error("[ERROR] Error in bulk-create comments:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to create comments";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
