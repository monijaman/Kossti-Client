import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { productName, categoryName } = await request.json();

    if (!productName || !productName.trim()) {
      return NextResponse.json(
        { error: "Product name is required" },
        { status: 400 },
      );
    }

    const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 500 },
      );
    }

    const categoryLine = categoryName
      ? `\nProduct Category: ${categoryName}`
      : "";
    const prompt = `You are a product pricing expert for a Bangladeshi e-commerce store.
Based on the product name and category below, suggest a realistic market start price and end price in BDT (Bangladeshi Taka).
Consider the actual real-world value of this product carefully — for example, a car costs millions of BDT, a smartphone costs tens of thousands, a book costs a few hundred.
Return only a JSON object with numeric values (no currency symbol, no commas).

Product Name: ${productName}${categoryLine}

Respond with JSON only: {"start_price": 5000000, "end_price": 8000000}`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error?.message || "Failed to get prices from OpenAI" },
        { status: response.status },
      );
    }

    const content = data.choices[0]?.message?.content || "";

    let parsed;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("No JSON in response");
      parsed = JSON.parse(jsonMatch[0]);
    } catch {
      return NextResponse.json(
        { error: "Failed to parse OpenAI response" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      start_price: parsed.start_price ?? null,
      end_price: parsed.end_price ?? null,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 },
    );
  }
}
