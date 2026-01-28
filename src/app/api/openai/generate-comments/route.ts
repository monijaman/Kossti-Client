import { generateProductComments } from "@/lib/openai-service";
import { fetchRealComments } from "@/lib/real-comments-service";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productName } = body;

    if (!productName || !productName.trim()) {
      return NextResponse.json(
        { error: "Product name is required" },
        { status: 400 }
      );
    }

    // Try to fetch real comments first
    console.log("[DEBUG] Attempting to fetch real comments from platforms...");
    let comments = await fetchRealComments(productName);

    // If real comments are insufficient, fall back to AI-generated
    if (comments.length < 10) {
      console.log("[DEBUG] Insufficient real comments, generating AI comments as fallback...");
      const aiComments = await generateProductComments(productName);
      comments = [...comments, ...aiComments].slice(0, 40);
    }

    return NextResponse.json({
      success: true,
      count: comments.length,
      comments,
      source: comments.length > 0 ? (comments[0].sourceUrl?.includes("reddit") || comments[0].sourceUrl?.includes("facebook") || comments[0].sourceUrl?.includes("amazon") ? "real" : "ai-generated") : "unknown",
    });
  } catch (error) {
    console.error("Error generating comments:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to generate comments";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
