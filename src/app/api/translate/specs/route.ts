import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const CHUNK_SIZE = 15; // Translate 15 specs at a time to avoid token limit issues

interface SpecInput {
  key: string;
  value: string;
}

interface TranslationResult {
  translatedKey: string;
  translatedValue: string;
}

async function translateChunk(
  client: OpenAI,
  specs: SpecInput[],
): Promise<TranslationResult[]> {
  const specsText = specs
    .map((spec, index) => `${index + 1}. ${spec.key}: ${spec.value}`)
    .join("\n");

  const prompt = `Translate these product specifications from English to Bengali.

English specifications:
${specsText}

Return ONLY a valid JSON array. Each object must have "translatedKey" and "translatedValue".
Example: [{"translatedKey": "ব্যাটারি", "translatedValue": "৫০০০ এমএএইচ"}]

Rules:
- Translate both keys and values to Bengali
- Keep technical terms/brand names in English where appropriate
- Convert numerals to Bengali numerals
- Return exactly ${specs.length} items
- Return ONLY valid JSON, no markdown, no explanation`;

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    max_tokens: 4096,
    temperature: 0.3,
    messages: [
      {
        role: "system",
        content:
          "You are a translator for product specifications. Translate English to Bengali. Return ONLY a valid JSON array. Never truncate the response.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  if (!response.choices[0].message.content) {
    throw new Error("No response content from OpenAI");
  }

  // Check if response was truncated
  if (response.choices[0].finish_reason === "length") {
    console.warn(
      "[translate/specs] Response was truncated by token limit, will retry with smaller batch",
    );
    throw new Error("TRUNCATED");
  }

  let content = response.choices[0].message.content.trim();

  // Remove markdown code blocks if present
  content = content
    .replace(/```json\n?/g, "")
    .replace(/```\n?/g, "")
    .trim();

  const translations: TranslationResult[] = JSON.parse(content);

  if (!Array.isArray(translations)) {
    throw new Error("Response is not a JSON array");
  }

  return translations;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { specifications } = body as {
      specifications: SpecInput[];
    };

    if (!specifications || !specifications.length) {
      return NextResponse.json(
        { error: "No specifications provided" },
        { status: 400 },
      );
    }

    const apiKey = process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY;

    if (!apiKey) {
      console.error("[translate/specs] No OpenAI API key found");
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 500 },
      );
    }

    const client = new OpenAI({ apiKey });

    console.log(
      `[translate/specs] Translating ${specifications.length} specifications to Bengali`,
    );

    // Process in chunks to avoid token limit truncation
    const allTranslations: TranslationResult[] = [];
    const chunkSize =
      specifications.length <= CHUNK_SIZE ? specifications.length : CHUNK_SIZE;

    for (let i = 0; i < specifications.length; i += chunkSize) {
      const chunk = specifications.slice(i, i + chunkSize);
      const chunkNum = Math.floor(i / chunkSize) + 1;
      const totalChunks = Math.ceil(specifications.length / chunkSize);

      console.log(
        `[translate/specs] Processing chunk ${chunkNum}/${totalChunks} (${chunk.length} specs)`,
      );

      try {
        const translations = await translateChunk(client, chunk);
        allTranslations.push(...translations);
      } catch (chunkError) {
        // If truncated, retry with smaller sub-chunks
        if (chunkError instanceof Error && chunkError.message === "TRUNCATED") {
          console.log(
            `[translate/specs] Retrying chunk ${chunkNum} with smaller sub-chunks`,
          );
          const halfSize = Math.ceil(chunk.length / 2);
          for (let j = 0; j < chunk.length; j += halfSize) {
            const subChunk = chunk.slice(j, j + halfSize);
            const subTranslations = await translateChunk(client, subChunk);
            allTranslations.push(...subTranslations);
          }
        } else {
          throw chunkError;
        }
      }
    }

    // Attach translations to original specifications
    const translatedSpecs = specifications.map((spec, index) => ({
      ...spec,
      translatedKey: allTranslations[index]?.translatedKey || spec.key,
      translatedValue: allTranslations[index]?.translatedValue || spec.value,
    }));

    console.log(
      `[translate/specs] Successfully translated ${translatedSpecs.length} specifications`,
    );

    return NextResponse.json({
      success: true,
      translations: translatedSpecs,
    });
  } catch (error) {
    console.error("[translate/specs] Error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    if (
      errorMessage.includes("401") ||
      errorMessage.includes("Incorrect API key")
    ) {
      return NextResponse.json(
        {
          error:
            "OpenAI API key is invalid or expired. Please update your API key.",
        },
        { status: 401 },
      );
    }

    if (errorMessage.includes("429")) {
      return NextResponse.json(
        {
          error: "OpenAI rate limit exceeded. Please try again in a moment.",
        },
        { status: 429 },
      );
    }

    if (errorMessage.includes("insufficient_quota")) {
      return NextResponse.json(
        {
          error: "OpenAI API quota exceeded. Please check your billing.",
        },
        { status: 402 },
      );
    }

    return NextResponse.json(
      { error: `Translation failed: ${errorMessage}` },
      { status: 500 },
    );
  }
}
