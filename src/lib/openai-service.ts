import OpenAI from "openai";

// Initialize OpenAI client - API key comes from environment
const getOpenAIClient = () => {
  const apiKey =
    typeof window !== "undefined"
      ? process.env.NEXT_PUBLIC_OPENAI_API_KEY || ""
      : process.env.NEXT_PUBLIC_OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error(
      "OpenAI API key not found. Please add NEXT_PUBLIC_OPENAI_API_KEY to your .env.local file"
    );
  }

  return new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true, // Allow browser usage (for development/demo)
  });
};

export interface AIReviewRequest {
  productName: string;
  productCategory?: string;
  locale: "en" | "bn";
}

/**
 * Generate an AI review using OpenAI GPT API
 * Returns HTML formatted review following the template structure
 */
export async function generateAIReview(
  request: AIReviewRequest
): Promise<string> {
  const { productName, productCategory } = request;

  const systemPrompt = `You are an expert product reviewer with experience writing real-world,
consumer-focused reviews based on performance, value, and usability.
Write honest, balanced, and practical evaluations.
Create a detailed and professional review of ${productName}.

Please follow this HTML structure and write ONLY in English:

- Wrap everything inside <article class="review-section">
- Add a <header> containing:
  - <h1> product name
  - Overall rating (1–5 stars) clearly shown as "Rating: X.X"

- <section class="executive-summary">
  - Brief overview
  - Intended users
  - Value proposition

- <section class="pros">
  - Exactly 4 major advantages
  - Focus on real-world benefits

- <section class="cons">
  - 8–10 realistic disadvantages
  - Include missing features, limitations, and deal-breakers

- <section class="verdict">
  - Final recommendation
  - Who should buy it
  - Who should avoid it

  - <section class="verdict">

Rules:
- Include "Rating: X.X" clearly
- Do NOT include markdown or explanations
- Return ONLY valid HTML
- Keep the tone professional, unbiased, and engaging
- Make it like human-written reviews
- Need to be at least 800 words long`;

  const userPrompt = productName
    ? `Create a comprehensive review for: ${productName} ${
        productCategory ? ` (Category: ${productCategory})` : ""
      }`
    : "";

  try {
    const client = getOpenAIClient();

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 4000,
      temperature: 0.7,
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: userPrompt,
        },
      ],
    });

    // Extract text from response
    if (response.choices[0].message.content) {
      let content = response.choices[0].message.content;

      // Remove markdown code blocks if present
      content = content.replace(/```html\n?/g, "").replace(/```\n?/g, "");

      return content;
    }

    throw new Error("Unexpected response format from OpenAI");
  } catch (error) {
    console.error("Error generating AI review:", error);
    throw error;
  }
}

/**
 * Format AI review as HTML article following the template structure
 */
export function formatReviewAsHTML(
  reviewContent: string,
  productName: string,
  locale: string
): string {
  const lang = locale === "bn" ? "bn" : "en";

  // Wrap the content in article tags with proper structure
  const htmlTemplate = `<!DOCTYPE html>
<html lang="${lang}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${productName} Review</title>
</head>
<body>
    <article class="ai-review review-section">
        ${reviewContent}
    </article>
</body>
</html>`;

  return htmlTemplate;
}

/**
 * Extract rating from AI-generated review content
 */
export function extractRatingFromReview(reviewContent: string): number {
  // Match patterns like "Rating: 4.5" or "रेटिंग: 4.5" or similar
  const ratingMatch = reviewContent.match(
    /(?:Rating|রেটিং|रेटिंग):\s*(\d+(?:\.\d+)?)/i
  );
  if (ratingMatch && ratingMatch[1]) {
    const rating = parseFloat(ratingMatch[1]);
    // Ensure rating is between 1 and 5
    return Math.min(Math.max(rating, 1), 5);
  }
  return 4.0; // Default rating if none found
}

/**
 * Translate English text to Bengali using OpenAI
 */
export async function translateToBengali(englishText: string): Promise<string> {
  if (!englishText.trim()) {
    throw new Error("No text to translate");
  }

  const systemPrompt = `
You are an expert translator specializing in translating product reviews
from English to Bengali.

Rules:
- Translate headings like "Rating", "Pros", "Cons" into Bengali.
- Convert English numerals into Bengali numerals where appropriate.
- Maintain meaning, tone, and clarity.
- Preserve line breaks and structure.
- If HTML is present, keep all tags unchanged and translate only text nodes.
- Output ONLY the translated content, no explanations.
`;

  const userPrompt = `Translate the following English review to Bengali. Keep all HTML tags intact and only translate the text content:

${englishText}`;

  try {
    const client = getOpenAIClient();

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 4000,
      temperature: 0.7,
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: userPrompt,
        },
      ],
    });

    if (response.choices[0].message.content) {
      let content = response.choices[0].message.content;
      // Remove markdown code blocks if present
      content = content.replace(/```html\n?/g, "").replace(/```\n?/g, "");
      return content;
    }

    throw new Error("Unexpected response format from OpenAI");
  } catch (error) {
    console.error("Error translating to Bengali:", error);
    throw error;
  }
}

/**
 * Convert English numerals to Bengali numerals
 */
export function convertTobengaliNumerals(
  englishNumber: number | string
): string {
const bengaliNumerals = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

  const numberStr = String(englishNumber);
  return numberStr
    .split("")
    .map((digit) => {
      const num = parseInt(digit);
      return isNaN(num) ? digit : bengaliNumerals[num];
    })
    .join("");
}

export interface AIComment {
  username: string;
  location: string;
  comment: string;
  sourceUrl: string;
  commentBn?: string; // Bengali translation
}


//#region Product Comments Generation and Translation
/**
 * Generate realistic product comments using OpenAI
 * Returns 10-20 comments with usernames, locations, and source URLs
 */
export async function generateProductComments(
  productName: string
): Promise<AIComment[]> {
  const client = getOpenAIClient();

  const prompt = `Generate 25 to 40 realistic product comments/reviews for: "${productName}"

Each comment should include:
1. A realistic username (first name or nickname)
2. A location (city, country)
3. A genuine-sounding comment (1-3 sentences, max 150 chars)
4. A source URL (can be from Amazon, YouTube, Reddit, product forum, or review site)

The comments should be:
- Varied in sentiment (positive, neutral, some critical)
- Realistic and authentic sounding
- About different aspects of the product
- Include specific details (not generic praise)

Return ONLY a valid JSON array with this structure:
[
  {
    "username": "John",
    "location": "New York, USA",
    "comment": "Great quality, arrived fast. Exactly what I needed.",
    "sourceUrl": "https://www.amazon.com/..."
  }
]

IMPORTANT: Return ONLY valid JSON array, nothing else.`;

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 3000,
      temperature: 0.8,
      messages: [
        {
          role: "system",
          content:
            "You are a data generator that creates realistic product comments. Return ONLY valid JSON, no markdown, no explanations.",
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
    const comments: AIComment[] = JSON.parse(content);

    if (!Array.isArray(comments) || comments.length === 0) {
      throw new Error("Invalid comments format");
    }

    return comments;
  } catch (error) {
    console.error("Error generating comments:", error);
    throw error;
  }
}

/**
 * Translate product comments to Bengali
 * Takes an array of English comments and returns them with Bengali translations
 */
export async function translateCommentsTobengali(
  comments: AIComment[]
): Promise<AIComment[]> {
  const client = getOpenAIClient();

  const commentTexts = comments.map((c) => c.comment).join("\n---\n");

  const prompt = `Translate these English product comments to Bengali. Keep the translation natural and authentic.

English comments:
${commentTexts}

Return ONLY a valid JSON array where each object has the translated Bengali comment text.
Format: ["Bengali comment 1", "Bengali comment 2", ...]

IMPORTANT: Return ONLY valid JSON array of strings, nothing else.`;

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 3000,
      temperature: 0.7,
      messages: [
        {
          role: "system",
          content:
            "You are a translator. Translate product comments to Bengali. Return ONLY valid JSON array of strings.",
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
    const bengaliTranslations: string[] = JSON.parse(content);

    if (!Array.isArray(bengaliTranslations) || bengaliTranslations.length === 0) {
      throw new Error("Invalid translations format");
    }

    // Attach Bengali translations to comments
    const translatedComments = comments.map((comment, index) => ({
      ...comment,
      commentBn: bengaliTranslations[index] || comment.comment,
    }));

    return translatedComments;
  } catch (error) {
    console.error("Error translating comments to Bengali:", error);
    // Return comments without Bengali translation if translation fails
    return comments;
  }
}
