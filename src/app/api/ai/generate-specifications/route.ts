import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(request: NextRequest) {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const { productName, specKeys } = await request.json();

    if (!productName || !Array.isArray(specKeys) || specKeys.length === 0) {
      return NextResponse.json(
        {
          error: "Missing required fields",
          details: "productName and specKeys array are required",
        },
        { status: 400 },
      );
    }

    const prompt = `Search the web for the actual official specifications of this exact product: "${productName}"

Based on these specification categories: ${specKeys.join(", ")}

For each category, find the real, verified value from the manufacturer's spec sheet or reputable review/retailer sources — do not guess or use a similar/generic product's specs from memory.

Return ONLY a valid JSON object with specification keys as properties and their values as strings, no other text, no citations/sources:
{
  "Display Size": "6.5 inches",
  "Battery Capacity": "5000 mAh",
  "Processor": "Qualcomm Snapdragon 8 Gen 2",
  "RAM": "8GB",
  "Storage": "128GB",
  "Camera": "64MP main + 12MP ultra-wide",
  "Operating System": "Android 13",
  "Weight": "180 grams"
}

IMPORTANT:
- Return ONLY valid, verified data found on the web for this exact product. Use real values.
- Use the exact specification key names provided
- Values should be specific to this exact product, not generic
- Values should be strings`;

    const response = await openai.responses.create({
      model: "gpt-5.6-terra",
      tools: [{ type: "web_search_preview" }],
      max_output_tokens: 2000,
      instructions:
        "You are a product specifications researcher. Search the web and report the real, verified specs for the exact product given. Return ONLY a valid JSON object, no citations or extra text.",
      input: prompt,
    });

    if (!response.output_text) {
      throw new Error("No response from OpenAI");
    }

    let content = response.output_text.trim();

    // Remove markdown code blocks if present
    content = content
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    // Parse JSON response
    const specs: Record<string, string> = JSON.parse(content);

    if (typeof specs !== "object" || specs === null) {
      throw new Error("Invalid specifications format");
    }

    return NextResponse.json({
      success: true,
      data: specs,
    });
  } catch (error) {
    console.error("Generate Specifications API error:", error);
    return NextResponse.json(
      {
        error: "Failed to generate product specifications",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
