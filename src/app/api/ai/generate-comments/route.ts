import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

interface CommentData {
  author: string;
  rating: number;
  comment: string;
  date: string;
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { productName, productCategory } = await request.json();

    if (!productName || !productCategory) {
      return NextResponse.json(
        {
          error: "Missing required fields",
          details: "productName and productCategory are required",
        },
        { status: 400 },
      );
    }

    const prompt = `Generate realistic customer reviews for a ${productCategory} product called "${productName}".

Create 5 representative customer comments that:
- Are realistic and detailed
- Include various perspectives (positive, negative, neutral)
- Include ratings (1-5 stars)
- Include realistic dates

Return ONLY a valid JSON array with this structure:
[
  {
    "author": "User Name",
    "rating": 4,
    "comment": "Detailed comment text...",
    "date": "2024-01-15"
  }
]

Make the comments helpful, relevant to ${productName}, and authentic-sounding.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 2000,
      temperature: 0.7,
      messages: [
        {
          role: "system",
          content:
            "You are a product review generator. Generate realistic customer reviews. Return ONLY valid JSON array.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    if (!response.choices[0].message.content) {
      throw new Error("No response from OpenAI");
    }

    let content = response.choices[0].message.content.trim();

    // Remove markdown code blocks if present
    content = content
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    // Parse JSON response
    const comments: CommentData[] = JSON.parse(content);

    if (!Array.isArray(comments)) {
      throw new Error("Invalid comments format - expected array");
    }

    return NextResponse.json({
      success: true,
      data: comments,
    });
  } catch (error) {
    console.error("Generate Comments API error:", error);
    return NextResponse.json(
      {
        error: "Failed to generate product comments",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
