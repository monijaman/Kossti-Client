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

    const sourceText = String(text);
    const looksLikeHtml = /<[^>]+>/.test(sourceText);
    const estimatedInputTokens = Math.ceil(sourceText.length / 4);
    const initialMaxTokens = Math.min(
      12000,
      Math.max(2500, estimatedInputTokens + 2000),
    );

    const buildSystemPrompt = () => {
      const sharedRules = `
CRITICAL RULES — follow exactly:
- Transliterate EVERY word of brand names, product names, and model names into Bengali script — including alphanumeric model codes. No English word in a product/brand name may remain in the Latin alphabet. Examples:
  "Tecno CAMON 30S" → "টেকনো ক্যামন ৩০এস"
  "Samsung Galaxy S25 Ultra" → "স্যামসাং গ্যালাক্সি এস২৫ আল্ট্রা"
  "iPhone 16 Pro Max" → "আইফোন ১৬ প্রো ম্যাক্স"
  "Xiaomi Redmi Note 13 Pro" → "শাওমি রেডমি নোট ১৩ প্রো"
  "OnePlus Nord CE 4" → "ওয়ানপ্লাস নর্ড সিই ৪"
  "Realme C65" → "রিয়েলমি সি৬৫"
  "Google Pixel 9" → "গুগল পিক্সেল ৯"
- Technical acronyms and spec units stay in English as they are universally recognised in Bengali tech writing: RAM, ROM, CPU, GPU, SoC, OLED, AMOLED, LCD, USB-C, 5G, 4G, LTE, NFC, Wi-Fi, Bluetooth, IP68, mAh, Hz, GHz, MP, fps, HDR, OIS, EIS, UFS, LPDDR, IMX, AI.
- Keep numeric values and measurement units in their original form (e.g. 6.8", 5000mAh, 108MP).
- Translate all descriptive and narrative text fully into Bengali script.`;

      if (looksLikeHtml) {
        return `You are an expert English-to-Bengali translator for long HTML documents. Translate ALL visible text (including product and brand names) into Bengali while preserving every HTML tag, attribute, class name, id, structure, and order exactly. Do not summarize, skip, or shorten any section. Return only the complete translated HTML.
${sharedRules}`;
      }

      return `You are a translator. Translate everything — including product and brand names — fully into Bengali. Do not summarize, skip, or shorten any part. Return only translated Bengali text.
${sharedRules}`;
    };

    const translateOnce = async (maxTokens: number) =>
      openai.chat.completions.create({
        model: "gpt-4o-mini",
        max_tokens: maxTokens,
        temperature: 0.1,
        messages: [
          {
            role: "system",
            content: buildSystemPrompt(),
          },
          {
            role: "user",
            content: `Translate the full content below to Bengali without truncation:\n\n${sourceText}`,
          },
        ],
      });

    let response = await translateOnce(initialMaxTokens);

    if (
      response.choices[0]?.finish_reason === "length" &&
      initialMaxTokens < 12000
    ) {
      response = await translateOnce(12000);
    }

    let translatedText = response.choices[0].message.content?.trim() || "";

    // Models sometimes wrap HTML in markdown fences; return raw translated content only.
    translatedText = translatedText
      .replace(/^```[a-zA-Z0-9_-]*\s*/m, "")
      .replace(/\s*```$/m, "")
      .trim();

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
