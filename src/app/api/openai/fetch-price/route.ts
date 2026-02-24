import { NextRequest, NextResponse } from "next/server";

// Convert English numerals to Bengali numerals
const englishToBengaliNumeral = (num: string): string => {
  const bengaliDigits = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"];
  return String(num).replace(/\d/g, (digit) => bengaliDigits[parseInt(digit)]);
};

// Format number with commas and convert to Bengali numerals
const formatPrice = (price: string | number): string => {
  if (!price) return "";
  const num = String(price).trim();
  // Add commas to number
  const formatted = num.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  // Convert to Bengali numerals
  return englishToBengaliNumeral(formatted);
};

export async function POST(request: NextRequest) {
  try {
    const { startPrice, endPrice } = await request.json();

    if (!startPrice && !endPrice) {
      return NextResponse.json(
        { error: "At least one price (startPrice or endPrice) is required" },
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

    // Build price conversion prompt
    let prompt =
      "You are a price formatter. Convert the following English prices to Bengali numerals with comma formatting. Respond in JSON format only.\n\n";

    if (startPrice) {
      prompt += `Start Price (English): ${startPrice}\n`;
    }
    if (endPrice) {
      prompt += `End Price (English): ${endPrice}\n`;
    }

    prompt +=
      '\nRespond with JSON only (no other text): {"start_price": "...", "end_price": "..."} where prices are formatted with commas and Bengali numerals.';

    // Call OpenAI API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.3,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error?.message || "Failed to fetch prices from OpenAI" },
        { status: response.status },
      );
    }

    const content = data.choices[0]?.message?.content || "";

    // Parse JSON response from OpenAI
    let parsedData;
    try {
      // Extract JSON from response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No JSON found in response");
      }
      parsedData = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      return NextResponse.json(
        { error: "Failed to parse OpenAI response as JSON" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      start_price: parsedData.start_price || "",
      end_price: parsedData.end_price || "",
    });
  } catch (error) {
    console.error("Error in fetch-price API:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 },
    );
  }
}
