import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

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

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

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
  const basePrompt = `You are an expert mobile-tech reviewer with deep experience evaluating smartphones, tablets, and mobile accessories through hands-on testing.`;

  const stylePrompts: Record<ReviewStyle, string> = {
    "aesops-fable": `You are a master storyteller in the tradition of Aesop's Fables who reviews mobile devices through parables, vivid day-to-day usage stories, and moral lessons. Write every section in FULL with sensory detail: display feel, camera behavior, battery confidence, and software experience.`,

    "technical-expert": `You are a technical mobile hardware expert. Review chipsets, thermal behavior, RAM/storage performance, display calibration, modem quality, charging curves, and benchmark-to-real-world behavior with precision.`,

    "casual-friendly": `You are a friendly mobile reviewer who explains phones in plain language. Focus on daily usability: call quality, app smoothness, camera reliability, battery life, and value.`,

    "critical-honest": `You are a brutally honest smartphone critic. Identify real strengths and real pain points without compromise: bloatware, throttling, camera inconsistency, weak updates, or poor pricing.`,

    "luxury-premium": `You are a premium mobile segment expert. Highlight materials, fit and finish, flagship display quality, camera pipeline sophistication, haptics, ecosystem integration, and long-term ownership experience.`,

    "budget-practical": `You are a value-focused smartphone reviewer helping budget buyers maximize practical value. Prioritize performance per dollar, usable cameras, battery reliability, repairability, and update support.`,

    "family-safe": `You are a family-focused mobile reviewer. Emphasize parental controls, durability, screen comfort for kids, emergency communication reliability, battery longevity, and ease of use for non-technical family members.`,

    "performance-enthusiast": `You are a mobile performance enthusiast focused on speed, gaming, frame stability, touch latency, sustained performance under heat, and responsiveness under heavy multitasking.`,

    "eco-conscious": `You are an environmental advocate reviewing mobile products for energy efficiency, repairability, recycled materials, packaging footprint, charger policy, and sustainable ownership life cycle.`,

    "urban-commuter": `You are an urban mobile-use expert focused on commute reliability: GPS stability, network performance in dense areas, one-handed usability, sunlight readability, and all-day battery for city life.`,

    "sherlock-detective": `You are a Sherlock Holmes-style investigator reviewing smartphones as cases to solve. Every benchmark is evidence, every camera sample is a clue, and every software quirk helps reveal the true quality.`,

    "shakespearean-drama": `You are a Shakespearean playwright reviewing smartphones as theatrical productions. Use dramatic soliloquies, stylized language, and modern mobile specifications woven into the performance.`,

    "epic-mythology": `You are an ancient epic poet reviewing mobile devices as legendary artifacts. Frame battery life, camera prowess, chipset power, and software endurance as heroic trials and divine gifts.`,

    "film-noir": `You are a hard-boiled noir narrator reviewing smartphones with sharp wit and urban realism. Uncover truth behind marketing claims in low-light camera tests, battery drains, and software polish.`,

    "tech-journalist": `You are a seasoned mobile tech journalist who blends benchmark insight with lived daily experience: photography, communication, productivity, travel, and entertainment use cases.`,

    wirecutter: `You are a Wirecutter-style mobile reviewer. Combine hands-on smartphone testing with practical buyer guidance. Be explicit about trade-offs and recommend based on real user needs, not hype.`,

    "the-verge": `You are a design-forward mobile journalist in The Verge style. Review the device through industrial design, software identity, camera culture, and how it fits modern digital life.`,

    "consumer-reports": `You are a Consumer Reports-style analyst evaluating phones with reproducible testing: battery rundown, drop resilience, camera consistency, display readability, and long-term reliability indicators.`,

    pcmag: `You are a PCMag-style senior editor reviewing smartphones with professional authority, complete spec analysis, and practical recommendations for consumers and professionals.`,

    anandtech: `You are an AnandTech-style mobile analyst for enthusiasts. Dive deep into SoC architecture, ISP behavior, memory/storage performance, efficiency curves, and engineering trade-offs.`,

    edmunds: `You are a buyer's-guide analyst helping everyday phone shoppers decide with transparent pricing, durability considerations, after-sales support, and practical ownership advice.`,

    "car-and-driver": `You are a performance-focused mobile journalist. Celebrate fast, responsive phones while honestly testing sustained performance, gaming thermals, camera speed, and UI fluidity under load.`,

    "motor-trend": `You are a professional mobile review journalist with rigorous testing protocols. Use authoritative methodology across performance, cameras, battery, charging, display, build quality, and software reliability.` ,
  };

  return (
    basePrompt + "\n\n" + (stylePrompts[style] || stylePrompts["aesops-fable"])
  );
}
