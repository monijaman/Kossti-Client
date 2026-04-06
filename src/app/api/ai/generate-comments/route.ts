import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

interface CommentData {
  author: string;
  rating: number;
  comment: string;
  date: string;
}

export async function POST(request: NextRequest) {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const { productName, productCategory } = await request.json();

    if (!productName || !productCategory) {
      return NextResponse.json(
        {
          error: "Missing required fields",
          details: "productName and productCategory are required",
        },
        { status: 400 },
      );
    }

    const prompt = `Generate REAL, EMOTIONAL customer reviews for a ${productCategory} product called "${productName}".

Create 5 authentic-sounding customer comments from different perspectives. These should sound like REAL PEOPLE with REAL EMOTIONS:

- Include frustration and disappointment: "I'm so annoyed that...", "This really let me down when...", "Honestly disappointed with..."
- Show excitement and satisfaction: "I'm genuinely happy with...", "This exceeded my expectations when...", "I love how..."
- Express specific complaints: battery dying at bad times, features not working as advertised, quality issues, price concerns
- Share personal stories: real usage scenarios, moments of failure or success
- Use conversational language like real reviews: "tbh", "honestly", "I regret...", "totally worth it", "waste of money"
- Vary the tone: some angry (1-2 stars), some mixed (3 stars), some satisfied (4-5 stars)
- Be specific about what frustrated or delighted them

Return ONLY a valid JSON array with this structure:
[
  {
    "author": "Real-sounding Name",
    "rating": 1-5,
    "comment": "Emotional, specific comment with personal experience...",
    "date": "2024-01-15"
  }
]

Make them sound like HUMANS who actually used this product and have FEELINGS about it - both positive AND negative.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 2000,
      temperature: 0.85, // Higher temperature for more human-like variation
      messages: [
        {
          role: "system",
          content:
            "You are generating realistic customer reviews that sound like REAL PEOPLE - emotional, specific, sometimes frustrated, sometimes delighted. Mix complaints with praise. Be authentic and conversational. Return ONLY valid JSON array.",
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
    const comments: CommentData[] = JSON.parse(content);

    if (!Array.isArray(comments)) {
      throw new Error("Invalid comments format - expected array.");
    }

    return NextResponse.json({
      success: true,
      data: comments,
    });
  } catch (error) {
    console.error("Generate Comments API error:", error);
    return NextResponse.json(
      {
        error: "Failed to generate product comments",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
