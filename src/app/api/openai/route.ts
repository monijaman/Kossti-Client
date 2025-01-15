import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

export async function POST(req: NextRequest) {
  try {
    console.log("Request received");

    // Parse the request body
    const body = await req.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        {
          success: false,
          error: "Messages array is required",
        },
        { status: 400 }
      );
    }

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      messages,
      model: "gpt-4", // or 'gpt-3.5-turbo'
      max_tokens: 2000,
    });

    const content = response.choices[0]?.message?.content || "";

    // Send the response back
    return NextResponse.json({
      success: true,
      result: content,
    });
  } catch (error: any) {
    console.error(
      "Error during POST request:",
      error.response?.data || error.message
    );

    return NextResponse.json(
      {
        success: false,
        error: error.response?.data?.error?.message || "Unknown server error",
      },
      { status: 500 }
    );
  }
}
