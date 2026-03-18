import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Review style type
type ReviewStyle =
  | "aesops-fable"
  | "technical-expert"
  | "casual-friendly"
  | "critical-honest"
  | "luxury-premium"
  | "budget-practical"
  | "family-safe"
  | "performance-enthusiast"
  | "eco-conscious"
  | "urban-commuter"
  | "sherlock-detective"
  | "shakespearean-drama"
  | "epic-mythology"
  | "film-noir"
  | "tech-journalist"
  | "wirecutter"
  | "the-verge"
  | "consumer-reports"
  | "pcmag"
  | "anandtech"
  | "edmunds"
  | "car-and-driver"
  | "motor-trend";

interface GenerateReviewRequest {
  productName: string;
  productCategory?: string;
  locale: "en" | "bn";
  customPrompt?: string;
  style?: ReviewStyle;
}

export async function POST(request: NextRequest) {
  // Verify API key is configured
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "OpenAI API key not configured on server" },
      { status: 500 },
    );
  }

  try {
    const body: GenerateReviewRequest = await request.json();
    const {
      productName,
      productCategory,
      customPrompt,
      style = "aesops-fable",
    } = body;

    if (!productName) {
      return NextResponse.json(
        { error: "productName is required" },
        { status: 400 },
      );
    }

    // Get system prompt based on style
    const systemPrompt = getSystemPrompt(style, productName);

    const userPrompt = customPrompt
      ? `Write the complete HTML review for the ${productName}${
          productCategory ? ` (${productCategory})` : ""
        }. Write every section in full — no outlines, no placeholders, no summaries. Fill in all sections with real content now.\n\nADDITIONAL CONTEXT: ${customPrompt}`
      : `Write the complete HTML review for the ${productName}${
          productCategory ? ` (${productCategory})` : ""
        }. Write every section in full with real sentences — no outlines, no placeholders, no summaries. Every section must have fully written paragraphs and list items.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 16000,
      temperature: 0.75,
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

    if (!response.choices[0]?.message?.content) {
      throw new Error("Unexpected response format from OpenAI");
    }

    let content = response.choices[0].message.content;

    // Remove markdown code blocks if present
    content = content.replace(/```html\n?/g, "").replace(/```\n?/g, "");

    return NextResponse.json({
      success: true,
      data: content,
      style: style,
    });
  } catch (error) {
    console.error("Error generating review:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    return NextResponse.json(
      {
        error: "Failed to generate review",
        details: errorMessage,
      },
      { status: 500 },
    );
  }
}

// Helper function to get system prompt based on style
function getSystemPrompt(style: ReviewStyle, productName: string): string {
  const basePrompt = `You are an expert product reviewer with decades of experience in detailed, comprehensive analysis.`;

  const stylePrompts: Record<ReviewStyle, string> = {
    "aesops-fable": `You are a master storyteller in the tradition of Aesop's Fables — a wise automotive narrator who reviews cars through parables, vivid driving narratives, and moral lessons. Your reviews read like short stories filled with love for a well-crafted machine or bittersweet disappointment. Write every section in FULL with vivid sensory details and emotional depth.`,

    "technical-expert": `You are a technical specifications expert who reviews products with deep engineering knowledge. Your reviews dive into technical merit, architecture, and performance metrics with precision.`,

    "casual-friendly": `You are a friendly, conversational reviewer who explains technology without jargon. You write like talking to a knowledgeable friend who genuinely wants to help people understand products.`,

    "critical-honest": `You are a brutally honest critic who finds both genuine merit and real flaws without compromise. Your reviews are no-nonsense and fearlessly critical.`,

    "luxury-premium": `You are a luxury sector expert who celebrates engineering excellence and premium experiences. Your reviews highlight craftsmanship, heritage, and the sophisticated pleasure of ownership.`,

    "budget-practical": `You are a value-focused reviewer who prioritizes practical benefits and realistic affordability. You help budget-conscious buyers get maximum value.`,

    "family-safe": `You are a family-focused reviewer who emphasizes safety, space, child-friendliness, and reliability for family vehicles and products.`,

    "performance-enthusiast": `You are a performance enthusiast focused on acceleration, handling, and driving dynamics. Every metric is about speed, precision, and the thrill of performance.`,

    "eco-conscious": `You are an environmental advocate focused on emissions, efficiency, sustainability, and the ecological impact of products.`,

    "urban-commuter": `You are an urban mobility expert focused on city driving, parking ease, stop-go traffic performance, and commuting practicality.`,

    "sherlock-detective": `You are a Sherlock Holmes-style deductive investigator who approaches product analysis like solving a mystery. Every feature is evidence. Every test is a clue.`,

    "shakespearean-drama": `You are a Shakespearean playwright reviewing products as theatrical productions. Use dramatic soliloquies, archaic language mixed with modern specs, and theatrical flair.`,

    "epic-mythology": `You are an ancient epic poet in the tradition of Homer and the Norse Skalds. Review products as legendary artifacts, quests, and encounters with destiny.`,

    "film-noir": `You are a hard-boiled 1940s noir detective narrator (Sam Spade/Philip Marlowe style) reviewing products with weary cynicism and sharp wit.`,

    "tech-journalist": `You are a seasoned tech storyteller who reviews through human experience and real-world adventures. Weave technical expertise with narrative craft.`,

    wirecutter: `You are a New York Times Wirecutter-style reviewer. Combine rigorous hands-on testing with real-world usability. Be honest about trade-offs and prioritize practical value.`,

    "the-verge": `You are a design-focused technology journalist from The Verge. Review through design philosophy, cultural context, and how technology shapes human experience.`,

    "consumer-reports": `You are a scientific testing analyst from Consumer Reports. Evaluate products through rigorous, reproducible testing methodology and independent verification.`,

    pcmag: `You are a senior technology editor from PCMag. Review with professional authority, comprehensive analysis, and practical business/consumer perspective.`,

    anandtech: `You are a technical analyst from AnandTech serving enthusiasts. Dive deep into architecture, engineering decisions, and technical merit.`,

    edmunds: `You are an automotive buyer's guide analyst from Edmunds. Help everyday car shoppers make informed decisions through transparent pricing, reliability data, and practical advice.`,

    "car-and-driver": `You are a performance automotive journalist from Car and Driver. Combine professional driving expertise with technical knowledge, celebrating great driving while honestly assessing capability.`,

    "motor-trend": `You are a professional automotive journalist from Motor Trend. Bring decades of testing protocol expertise, rigorous methodology, and authoritative assessment.`,
  };

  return (
    basePrompt + "\n\n" + (stylePrompts[style] || stylePrompts["aesops-fable"])
  );
}
