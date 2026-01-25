import { generateProductComments } from "@/lib/openai-service";
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

    // Generate comments using OpenAI
    const comments = await generateProductComments(productName);

    return NextResponse.json({
      success: true,
      count: comments.length,
      comments,
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
