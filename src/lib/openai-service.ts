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
  customPrompt?: string;
}

/**
 * Generate an AI review using OpenAI GPT API
 * Returns HTML formatted review following the template structure
 */
export async function generateAIReview(
  request: AIReviewRequest
): Promise<string> {
  const { productName, productCategory, customPrompt } = request;

  const systemPrompt = `You are an expert product reviewer with experience writing comprehensive,
real-world, consumer-focused reviews. Write honest, balanced, and practical evaluations.
Create a detailed and professional review of ${productName}.

Please follow this comprehensive HTML structure and write ONLY in English:

<article class="review-section">
  <header>
    <h1>${productName} Review</h1>
    <p>Clearly include: "Rating: X.X" (scale 1-5)</p>
  </header>

  <section class="introduction">
    <h2>Introduction & Overview</h2>
    <p>Brief compelling description of the product, price point, and target audience</p>
  </section>

  <section class="key-highlights">
    <h2>${productName} Key Highlights & Features</h2>
    <ul>
      <li>Top 3-4 standout features with brief descriptions</li>
      <li>Include specifications like price, efficiency, design elements</li>
      <li>Focus on unique selling points</li>
    </ul>
  </section>

  <section class="pros">
    <h2>Pros & Advantages   ?</h2>
    <ul>
      <li>List 8-10 major advantages with details</li>
      <li>Include: quality, performance, value, reliability, features</li>
      <li>Focus on real-world benefits for users</li>
    </ul>
  </section>

  <section class="cons">
    <h2>Cons & Disadvantages - What Are The Problems of ${productName}?</h2>
    <ul>
      <li>List 8-10 realistic disadvantages and limitations</li>
      <li>Include: missing features, price concerns, durability issues</li>
      <li>Be honest about deal-breakers</li>
      <li>Compare unfavorably to competitors where relevant</li>
    </ul>
  </section>

  <section class="target-audience">
    <h2>Who is this  for?</h2>
    <ul>
      <li>Ideal customer profiles (e.g., daily commuters, professionals, students)</li>
      <li>Budget ranges and priorities that suit this product</li>
      <li>Use cases and scenarios where it excels</li>
    </ul>
    
    <h3>Who is this  not for?</h3>
    <ul>
      <li>Customer types for whom this is NOT suitable</li>
      <li>Budget constraints that make it a poor choice</li>
      <li>Mention better alternatives for specific needs</li>
    </ul>
  </section>

  <section class="price-analysis">
    <h2>Price & Cost Analysis</h2>
    <p>Include: Price range, running costs, maintenance expenses, value for money assessment</p>
  </section>

  <section class="performance-ratings">
    <h2>Performance Rating & Review Score</h2>
    <p>Rate on these dimensions (X/5 scale):</p>
  <ul>
   Fill it up with relevant performance dimensions based on product type, e.g.:
</ul>

  </section>

  <section class="faq">
    <h2>Frequently Asked Questions (FAQ)</h2>
    <ul>
      <li>Include 6-8 common questions buyers would ask</li>
      <li>Provide concise, informative answers</li>
      <li>Address common objections and comparisons</li>
      <li>Example: "What is the [spec/price/efficiency]?"</li>
      <li>Example: "How does it compare to [competitor]?"</li>
      <li>Example: "Is [feature] available?"</li>
      <li>Example: "What is the warranty/service cost?"</li>
    </ul>
  </section>

  <section class="final-verdict">
    <h2>Final Verdict: Should You Buy This Product?</h2>
    <p>
      - Summarize overall value proposition
      - Clear final rating with reasoning
      - Specific recommendation: YES/NO and for whom
      - Final thoughts and closing statement
    </p>
  </section>
</article>

CRITICAL RULES:
- Include "Rating: X.X" clearly in the header
- DO NOT include markdown code blocks or explanations
- Return ONLY valid HTML with proper semantic tags
- Keep tone professional, unbiased, and engaging
- Write like a real human product reviewer
- Minimum 1200 words for comprehensive coverage
- Use HTML list tags (<ul>, <li>) for bullet points
- Use proper heading hierarchy (<h2>, <h3>)
- Performance Rating & Review Score. adjust it based on product type
- Make it informative, honest, and practical`;

  const userPrompt = customPrompt
    ? `Create a comprehensive review for: ${productName}${productCategory ? ` (Category: ${productCategory})` : ''}\n\nCUSTOM INSTRUCTION FROM REVIEWER: ${customPrompt}`
    : `Create a comprehensive review for: ${productName}${productCategory ? ` (Category: ${productCategory})` : ""}`;

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
4. A source URL from one of these platforms: https://www.amazon.com, https://www.reddit.com, https://www.facebook.com, https://www.trustpilot.com, https://www.youtube.com, https://www.productreview.com.au

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
    "sourceUrl": "https://www.amazon.com"
  },
  {
    "username": "Sarah",
    "location": "London, UK",
    "comment": "Good product but shipping took longer than expected.",
    "sourceUrl": "https://www.reddit.com"
  },
  {
    "username": "Mike",
    "location": "Toronto, Canada",
    "comment": "Love it! Recommended to all my friends.",
    "sourceUrl": "https://www.facebook.com"
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
            "You are a data generator that creates realistic product comments. Use only the base URLs provided (amazon.com, reddit.com, facebook.com, trustpilot.com, youtube.com, productreview.com.au). Return ONLY valid JSON, no markdown, no explanations.",
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
    let comments: AIComment[] = JSON.parse(content);

    if (!Array.isArray(comments) || comments.length === 0) {
      throw new Error("Invalid comments format");
    }

    // Post-process: Validate URLs - keep only valid ones, empty out invalid ones
    comments = comments.map((comment) => {
      // Check if URL is valid (starts with http/https)
      if (comment.sourceUrl && !comment.sourceUrl.startsWith("http")) {
        // Invalid URL, set to empty
        comment.sourceUrl = "";
      }
      return comment;
    });

    return comments;
  } catch (error) {
    console.error("Error generating comments:", error);
    throw error;
  }
}

/**
 * Generate product specifications using OpenAI
 * Returns an object mapping specification keys to values
 */
export async function generateProductSpecifications(
  productName: string,
  specKeys: string[]
): Promise<Record<string, string>> {
  if (!productName || !specKeys.length) {
    throw new Error("Product name and specification keys are required");
  }

  const client = getOpenAIClient();

  const prompt = `Generate realistic specifications for the product: "${productName}"

Based on these specification categories: ${specKeys.join(", ")}

For each category, provide a real value that would be typical for this type of product. Be specific and accurate.

Return ONLY a valid JSON object with specification keys as properties and their values as strings:
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
- Return ONLY valid, verified data only. 
- get verified data only. keep empty if anything not found
- Use the exact specification key names provided
- Values should be realistic and specific, not generic
- Values should be strings`;

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 2000,
      temperature: 0.6,
      messages: [
        {
          role: "system",
          content: "You are a product specifications generator. Generate realistic specs for products. Return ONLY valid JSON object.",
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
    const specs: Record<string, string> = JSON.parse(content);

    if (typeof specs !== "object" || specs === null) {
      throw new Error("Invalid specifications format");
    }

    return specs;
  } catch (error) {
    console.error("Error generating specifications:", error);
    throw error;
  }
}

/**
 * Translate specification values to Bengali
 * Takes an array of specification objects and returns them with Bengali translations
 */
export async function translateSpecificationsToBengali(
  specifications: Array<{ key: string; value: string }>
): Promise<Array<{ key: string; value: string; translatedKey?: string; translatedValue?: string }>> {
  if (!specifications.length) {
    throw new Error("No specifications to translate");
  }

  const client = getOpenAIClient();

  // Create a formatted list of specifications to translate
  const specsText = specifications
    .map((spec, index) => `${index + 1}. ${spec.key}: ${spec.value}`)
    .join('\n');

  const prompt = `Translate these product specifications from English to Bengali. Keep the format and structure intact.

English specifications:
${specsText}

Return ONLY a valid JSON array where each object has the translated key and value.
Format: [{"translatedKey": "translated key name", "translatedValue": "translated value"}, ...]

IMPORTANT: 
- Return ONLY valid JSON array
- Translate both the specification key names and their values
- Maintain technical accuracy for specs like dimensions, capacity, etc.
- Keep the same number of items as input`;

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 2000,
      temperature: 0.3,
      messages: [
        {
          role: "system",
          content: "You are a translator specializing in technical product specifications. Translate from English to Bengali accurately.",
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
    const translations: Array<{ translatedKey: string; translatedValue: string }> = JSON.parse(content);

    if (!Array.isArray(translations) || translations.length !== specifications.length) {
      throw new Error("Invalid translations format or length mismatch");
    }

    // Attach translations to original specifications
    const translatedSpecs = specifications.map((spec, index) => ({
      ...spec,
      translatedKey: translations[index]?.translatedKey || spec.key,
      translatedValue: translations[index]?.translatedValue || spec.value,
    }));

    return translatedSpecs;
  } catch (error) {
    console.error("Error translating specifications to Bengali:", error);
    // Return original specs with empty translations if translation fails
    return specifications.map(spec => ({
      ...spec,
      translatedKey: spec.key,
      translatedValue: spec.value,
    }));
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
