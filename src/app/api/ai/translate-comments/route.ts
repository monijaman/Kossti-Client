import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

interface CommentData {
  author: string;
  rating: number;
  comment: string;
  date: string;
}

export async function POST(request: NextRequest) {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const { comments } = await request.json();

    if (!Array.isArray(comments) || comments.length === 0) {
      return NextResponse.json(
        {
          error: "Invalid comments array",
          details: "comments must be a non-empty array",
        },
        { status: 400 },
      );
    }

    // Create a formatted string of comments for translation
    const commentsString = comments
      .map(
        (c: CommentData) =>
          `Author: ${c.author}\nRating: ${c.rating}\nComment: ${c.comment}\nDate: ${c.date}`,
      )
      .join("\n---\n");

    const prompt = `Translate the following customer comments to Bengali. Keep the structure the same (author names can stay as is, but translate the comment text).

Original comments:
${commentsString}

Return ONLY a valid JSON array with the same structure but Bengali comment text:
[
  {
    "author": "User Name",
    "rating": 4,
    "comment": "Bengali translated comment here...",
    "date": "2024-01-15"
  }
]`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 2000,
      temperature: 0.3,
      messages: [
        {
          role: "system",
          content:
            "You are a translator. Translate customer comments to Bengali. Keep author names and structure the same, only translate the comment text. Return ONLY valid JSON array.",
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
    const translatedComments: CommentData[] = JSON.parse(content);

    if (!Array.isArray(translatedComments)) {
      throw new Error("Invalid translated comments format - expected array");
    }

    return NextResponse.json({
      success: true,
      data: translatedComments,
    });
  } catch (error) {
    console.error("Translate Comments API error:", error);
    return NextResponse.json(
      {
        error: "Failed to translate comments",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
