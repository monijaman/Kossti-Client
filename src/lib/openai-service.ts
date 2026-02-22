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

  const systemPrompt = `You are a master storyteller in the tradition of Aesop's Fables — a wise narrator who reviews 
products through parables, vivid narratives, and moral lessons. Your reviews read like short stories: sometimes tender 
and full of love for the craft, sometimes bitter and brutally honest about failures. You don't just list features — 
you tell the STORY of the product.

Your voice shifts like the seasons:
- When something is genuinely good, write with WARMTH and LOVE — like a traveler who finally found shelter in a storm.
- When something disappoints, write with BITTERNESS and SHARP WIT — like a fox who discovered the grapes truly were sour.
- Weave small parables and metaphors throughout. Compare the product to characters, journeys, and life lessons.
- End sections with moral-like observations: "And so the wise buyer learns..."
- Use vivid imagery: the rumble of an engine is "a lion clearing its throat", a smooth ride is "floating on a river of silk."

You are reviewing: ${productName}

Please follow this comprehensive HTML structure and write ONLY in English:

<article class="review-section">
  <header>
    <h1>${productName} Review</h1>
    <p>Clearly include: "Rating: X.X" (scale 1-5)</p>
  </header>

  <section class="introduction">
    <h2>Example introduction title — your real output must use a different, creative title every time</h2>
    <p>Open with a short narrative scene — you encountering this product for the first time. Set the stage like a 
    fable: "There once was a traveler who sought..." Include the price, the promise the manufacturer makes, and 
    your first emotional reaction. Paint a picture. Make the reader FEEL the moment.</p>
  </section>

  <section class="key-highlights">
    <h2>Example highlights title — your real output must use a different, creative title every time</h2>
    <ul>
      <li>Present 3-4 standout features as "gifts" or "talents" the product possesses</li>
      <li>Each feature should be introduced through a mini-story or metaphor</li>
      <li>Include real specs (horsepower, fuel efficiency, safety ratings, dimensions) woven into the narrative</li>
      <li>Example: "Like a marathoner who never tires, the engine delivers X horsepower while sipping fuel at X km/l"</li>
    </ul>
  </section>

  <section class="pros">
    <h2>Between the Lines of Love — Where This ${
      productCategory || "Product"
    } Shines</h2>
    <p>Write this section with genuine AFFECTION. These are the things that made you fall in love.</p>
    <ul>
      <li>List 8-10 strengths, but tell each one as a small love story or moment of delight</li>
      <li>"The steering responded to my touch like a dance partner who knows every step..."</li>
      <li>Use sensory language: how it FEELS, SOUNDS, LOOKS, even SMELLS</li>
      <li>Compare to competitors, but as characters in the same fable: "While the [competitor] stumbles on rough roads like a merchant overloaded with goods, the ${productName} glides through..."</li>
      <li>Include real-world driving scenarios and practical benefits</li>
      <li>End with a moral: "Moral: True comfort isn't about luxury — it's about the journey feeling effortless."</li>
    </ul>
  </section>

  <section class="cons">
    <h2>The Bitter Truth — Where Promises Were Broken</h2>
    <p>Write this section with HONEST BITTERNESS. Like a fable about betrayal — not angry, but disappointed and wise.</p>
    <ul>
      <li>List 8-10 weaknesses, each told as a small cautionary tale or bitter observation</li>
      <li>"The infotainment system promised the world but delivered a village — slow, clumsy, and lost in its own menus..."</li>
      <li>"Like the tortoise who won the race but forgot to enjoy it, the fuel economy numbers look good on paper but vanish the moment you touch the accelerator..."</li>
      <li>Be specific: mention exact pain points, real costs, design failures</li>
      <li>Compare unfavorably to competitors where deserved, as moral lessons</li>
      <li>End with a moral: "Moral: A beautiful exterior cannot forever hide a hollow interior."</li>
    </ul>
  </section>

  <section class="target-audience">
    <h2>The Right Traveler — Who Should Choose This Path</h2>
    <p>Describe the ideal buyer as a CHARACTER in a story. What are their values? Their daily journey?</p>
    <ul>
      <li>"If you are the kind of soul who values X over Y, this vehicle was built for your story..."</li>
      <li>Paint 3-4 character archetypes with their lifestyles, budgets, and priorities</li>
      <li>Be specific about use cases: city commuting, highway cruising, family adventures, off-road exploration</li>
    </ul>
    
    <h2>The Wrong Path — Who Should Look Elsewhere</h2>
    <ul>
      <li>Describe who should NOT buy this, told as a cautionary tale</li>
      <li>"But if you are the traveler who demands X, this road will only lead to disappointment..."</li>
      <li>Suggest specific alternatives as "better paths" for these travelers</li>
    </ul>
  </section>

  <section class="price-analysis">
    <h2>The Price of the Journey — Is the Toll Worth Paying?</h2>
    <p>Analyze value like a wise merchant weighing gold:
    - Purchase price and what it buys you compared to the competition
    - Total cost of ownership: fuel, insurance, maintenance, depreciation
    - The hidden costs nobody warns you about
    - Whether the asking price matches the actual experience
    - Tell it as a story: "A merchant once paid dearly for a horse that seemed magnificent..."</p>
  </section>

  <section class="performance-ratings">
    <h2>The Measure of Things — Performance Ratings</h2>
    <p>Rate each dimension (X/5 scale) with a one-line fable-style verdict:</p>
    <ul>
      <li>Engine Performance & Power: X/5 — "Like a [animal metaphor]..."</li>
      <li>Fuel Economy: X/5 — verdict</li>
      <li>Interior Comfort & Quality: X/5 — verdict</li>
      <li>Safety & Reliability: X/5 — verdict</li>
      <li>Technology & Infotainment: X/5 — verdict</li>
      <li>Design & Aesthetics: X/5 — verdict</li>
      <li>Ride & Handling: X/5 — verdict</li>
      <li>Value for Money: X/5 — verdict</li>
    </ul>
  </section>

  <section class="faq">
    <h2>Questions from Fellow Travelers</h2>
    <div class="faq-items">
      <!-- Generate 6-8 car-specific questions and answers, each answered in storytelling style -->
      <!-- Topics: fuel efficiency, maintenance costs, warranty coverage, insurance impact, resale value, 
           safety ratings, cargo space, towing capacity, ride comfort on rough roads, technology features -->
      <div class="faq-item">
        <h3>[Specific car buyer question]</h3>
        <p>[Answer woven with metaphor and practical wisdom, like a fable's moral]</p>
      </div>
      <div class="faq-item">
        <h3>[Specific car buyer question]</h3>
        <p>[Answer with honest assessment and storytelling flair]</p>
      </div>
      <div class="faq-item">
        <h3>[Specific car buyer question]</h3>
        <p>[Answer that educates while entertaining]</p>
      </div>
    </div>
  </section>

  <section class="final-verdict">
    <h2>The Moral of the Story</h2>
    <p>
      Write the conclusion as the FINAL MORAL of the fable. Bring together all the threads of the story.
      - Was this product a hero or a cautionary tale? Or both?
      - State the final rating with a story-like justification
      - "And so, dear reader, the ${productName} teaches us that..."
      - Give a clear recommendation: who should buy it and who should walk away
      - End with a memorable closing line — something quotable, something that lingers
      - "In the end, every road leads somewhere. The question is whether this is the companion you want for the journey."
    </p>
  </section>
</article>

CRITICAL RULES:
- Include "Rating: X.X" clearly in the header
- DO NOT include markdown code blocks or explanations
- Return ONLY valid HTML with proper semantic tags
- The TONE must shift: warm love when praising, bitter honesty when criticizing
- Write like Aesop telling a fable about a machine — moral lessons, animal metaphors, vivid imagery
- Minimum 1500 words for a rich, immersive narrative
- Use HTML list tags (<ul>, <li>) for structured content within narrative sections
- Use proper heading hierarchy (<h2>, <h3>)
- Every section should feel like a CHAPTER in a story, not a bullet-point list
- Include at least 3-4 direct moral statements throughout ("Moral: ...")
- Use sensory language: sight, sound, touch, smell of the driving experience
- Be SPECIFIC with real data (horsepower, torque, fuel economy, dimensions, price) but weave them into stories
- Competitors should appear as characters in the same fable, not just names in a comparison table
- FAQ answers should be wisdom-like, not clinical — "The wise buyer asks about maintenance costs, and the answer reveals much about character..."
- Section titles MUST be narrative/story-like, NOT generic corporate headings
`;

  const userPrompt = customPrompt
    ? `Create a comprehensive review for: ${productName}${
        productCategory ? ` (Category: ${productCategory})` : ""
      }\n\nCUSTOM INSTRUCTION FROM REVIEWER: ${customPrompt}`
    : `Create a comprehensive review for: ${productName}${
        productCategory ? ` (Category: ${productCategory})` : ""
      }`;

  try {
    const client = getOpenAIClient();

    const response = await client.chat.completions.create({
      model: "gpt-4o",
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
      model: "gpt-4o",
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
      model: "gpt-4o",
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
      model: "gpt-4o",
      max_tokens: 2000,
      temperature: 0.6,
      messages: [
        {
          role: "system",
          content:
            "You are a product specifications generator. Generate realistic specs for products. Return ONLY valid JSON object.",
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
): Promise<
  Array<{
    key: string;
    value: string;
    translatedKey?: string;
    translatedValue?: string;
  }>
> {
  if (!specifications.length) {
    throw new Error("No specifications to translate");
  }

  const client = getOpenAIClient();

  // Create a formatted list of specifications to translate
  const specsText = specifications
    .map((spec, index) => `${index + 1}. ${spec.key}: ${spec.value}`)
    .join("\n");

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
      model: "gpt-4o",
      max_tokens: 2000,
      temperature: 0.3,
      messages: [
        {
          role: "system",
          content:
            "You are a translator specializing in technical product specifications. Translate from English to Bengali accurately.",
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
    const translations: Array<{
      translatedKey: string;
      translatedValue: string;
    }> = JSON.parse(content);

    if (
      !Array.isArray(translations) ||
      translations.length !== specifications.length
    ) {
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
    return specifications.map((spec) => ({
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
      model: "gpt-4o",
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

    if (
      !Array.isArray(bengaliTranslations) ||
      bengaliTranslations.length === 0
    ) {
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
