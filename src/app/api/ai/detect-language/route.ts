import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();
    if (!text || String(text).trim().length < 2) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const result = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0,
      max_tokens: 5,
      messages: [
        { role: "system", content: "Detect the language. Reply with exactly one code: en or bn." },
        { role: "user", content: String(text).slice(0, 4000) },
      ],
    });
    const language = result.choices[0]?.message.content?.trim().toLowerCase() === "bn" ? "bn" : "en";
    return NextResponse.json({ success: true, language });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Language detection failed" }, { status: 500 });
  }
}
