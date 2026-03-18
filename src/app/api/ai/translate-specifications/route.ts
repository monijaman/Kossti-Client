import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { specs } = await request.json();

    if (!specs || typeof specs !== "object") {
      return NextResponse.json(
        {
          error: "Invalid specifications object",
          details: "specs must be a valid object",
        },
        { status: 400 },
      );
    }

    // Create a formatted string of specifications for translation
    const specsString = Object.entries(specs)
      .map(([key, value]) => `${key}: ${value}`)
      .join("\n");

    const prompt = `Translate the following product specifications to Bengali. Keep the keys the same, but translate only the values.

Original specifications:
${specsString}

Return ONLY a valid JSON object with the same keys but Bengali values. Example:
{
  "Display Size": "৬.৫ ইঞ্চি",
  "Battery": "৫০০০ এমএএইচ"
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 2000,
      temperature: 0.3,
      messages: [
        {
          role: "system",
          content:
            "You are a translator. Translate product specifications to Bengali. Keep keys in English, translate values to Bengali. Return ONLY valid JSON object.",
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
    const translatedSpecs: Record<string, string> = JSON.parse(content);

    if (typeof translatedSpecs !== "object" || translatedSpecs === null) {
      throw new Error("Invalid translated specifications format");
    }

    return NextResponse.json({
      success: true,
      data: translatedSpecs,
    });
  } catch (error) {
    console.error("Translate Specifications API error:", error);
    return NextResponse.json(
      {
        error: "Failed to translate specifications",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
