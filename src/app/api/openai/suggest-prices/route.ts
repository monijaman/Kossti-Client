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

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 500 },
      );
    }

    const categoryLine = categoryName
      ? `\nProduct Category: ${categoryName}`
      : "";
    const prompt = `You are a pricing researcher for a Bangladeshi e-commerce store.
Search the current Bangladesh retail market (e.g. Star Tech, Ryans Computers, Pickaboo, Daraz.com.bd, official brand stores) for this exact product and find its actual current selling price range in BDT (Bangladeshi Taka) — do not guess from memory or use global/US pricing.
Return the lowest and highest price you find among current BD listings as a start price and end price.
Return only a JSON object with numeric values (no currency symbol, no commas, no other text, no citations/sources).

Product Name: ${productName}${categoryLine}

Respond with JSON only: {"start_price": 5000000, "end_price": 8000000}`;

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-5.6-terra",
        tools: [
          {
            type: "web_search",
            user_location: {
              type: "approximate",
              country: "BD",
            },
          },
        ],
        input: prompt,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error?.message || "Failed to get prices from OpenAI" },
        { status: response.status },
      );
    }

    const content: string = (data.output ?? [])
      .flatMap((item: any) => item.content ?? [])
      .filter((c: any) => c.type === "output_text")
      .map((c: any) => c.text)
      .join("");

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
