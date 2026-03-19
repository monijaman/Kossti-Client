import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(request: NextRequest) {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const { text } = await request.json();

    if (!text) {
      return NextResponse.json(
        { error: "Text is required", details: "Missing text parameter" },
        { status: 400 },
      );
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 2000,
      temperature: 0.3,
      messages: [
        {
          role: "system",
          content:
            "You are a translator. Translate the given text to Bengali. Return ONLY the translated Bengali text without any explanation or backticks.",
        },
        {
          role: "user",
          content: `Translate this to Bengali:\n\n${text}`,
        },
      ],
    });

    const translatedText = response.choices[0].message.content?.trim() || "";

    if (!translatedText) {
      throw new Error("No translation received from OpenAI");
    }

    return NextResponse.json({
      success: true,
      data: translatedText,
    });
  } catch (error) {
    console.error("Translation API error:", error);
    return NextResponse.json(
      {
        error: "Failed to translate text",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
