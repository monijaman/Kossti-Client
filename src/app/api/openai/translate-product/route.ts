import { NextRequest, NextResponse } from "next/server";

// Convert English numerals to Bengali numerals
const englishToBengaliNumeral = (num: string): string => {
  const bengaliDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return String(num).replace(/\d/g, (digit) => bengaliDigits[parseInt(digit)]);
};

// Format number with commas and optionally convert to Bengali numerals
const formatPrice = (
  price: string | number,
  convertToBengali = false,
): string => {
  if (!price) return "";
  const num = String(price).trim();
  // Add commas to number
  const formatted = num.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return convertToBengali ? englishToBengaliNumeral(formatted) : formatted;
};

export async function POST(request: NextRequest) {
  try {
    const { productName, startPrice, endPrice } = await request.json();

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

    // Build translation prompt
    let prompt = `You are a professional Bengali translator. Translate the following product name to Bengali.\n\nProduct Name (English): ${productName}`;

    if (startPrice) {
      const formattedStart = formatPrice(startPrice);
      prompt += `\n\nStart Price (English): ${formattedStart}`;
    }
    if (endPrice) {
      const formattedEnd = formatPrice(endPrice);
      prompt += `\n\nEnd Price (English): ${formattedEnd}`;
    }

    prompt += `\n\nRespond ONLY with valid JSON (no markdown, no code blocks) in this exact format:`;
    prompt += `\n{"translated_name": "Bengali translation of product name", "start_price": "price in Bengali numerals with commas", "end_price": "price in Bengali numerals with commas"}`;
    prompt += `\n\nFor prices: Convert the numbers to Bengali numerals (০, १, २, ३, ४, ५, ६, ७, ८, ९) and add commas for thousands.`;
    prompt += `\n\nExample: 100000 → १००,०००`;

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
            role: "system",
            content:
              "You are a professional Bengali translator. Translate product names to Bengali. For prices, convert numbers to Bengali numerals (০, १, २, ३, ४, ५, ६, ७, ८, ९) with commas. Respond ONLY with JSON, no markdown or extra text.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.3,
        max_tokens: 200,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenAI API error:", errorData);
      return NextResponse.json(
        { error: "Failed to translate via OpenAI" },
        { status: 500 },
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return NextResponse.json(
        { error: "No translation received from OpenAI" },
        { status: 500 },
      );
    }

    // Parse JSON response from OpenAI
    let translation;
    try {
      // Extract JSON from the response (remove markdown if present)
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No JSON found in response");
      }
      translation = JSON.parse(jsonMatch[0]);
    } catch (e) {
      console.error("Failed to parse OpenAI response:", content);
      return NextResponse.json(
        { error: "Failed to parse translation response" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      translated_name: translation.translated_name || productName,
      // If OpenAI returns English numerals, convert to Bengali; if already Bengali, keep as-is
      start_price: translation.start_price
        ? /[0-9]/.test(translation.start_price)
          ? englishToBengaliNumeral(translation.start_price)
          : translation.start_price
        : formatPrice(startPrice || "", true),
      end_price: translation.end_price
        ? /[0-9]/.test(translation.end_price)
          ? englishToBengaliNumeral(translation.end_price)
          : translation.end_price
        : formatPrice(endPrice || "", true),
    });
  } catch (error) {
    console.error("Translation error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to translate";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
