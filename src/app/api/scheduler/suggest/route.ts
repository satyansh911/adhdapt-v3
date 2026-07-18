import { type NextRequest, NextResponse } from "next/server";
import { generateObject } from "ai";
import { createGroq } from "@ai-sdk/groq";
import { z } from "zod";

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});

const schema = z.object({
  message: z
    .string()
    .describe(
      "One warm, encouraging sentence (max ~30 words) explaining the suggested reorder in ADHD-friendly language."
    ),
  blocks: z
    .array(
      z.object({
        title: z.string().describe("The task title, unchanged from the input."),
        time: z.string().describe("Suggested start time in 24h HH:MM format."),
      })
    )
    .describe("The same tasks, reordered with gentler suggested times."),
});

export async function POST(request: NextRequest) {
  if (!process.env.GROQ_API_KEY) {
    return NextResponse.json({ error: "AI service not configured." }, { status: 500 });
  }

  let blocks: { time: string; title: string }[];
  try {
    ({ blocks } = await request.json());
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!blocks || blocks.length === 0) {
    return NextResponse.json(
      { error: "Add a few blocks first, then I can suggest a gentler order." },
      { status: 400 }
    );
  }

  const list = blocks.map((b) => `${b.time} — ${b.title}`).join("\n");

  try {
    const { object } = await generateObject({
      model: groq("llama-3.3-70b-versatile"),
      schema,
      prompt: `You are a kind, practical ADHD coach helping someone shape their day.
Given today's schedule below, suggest a gentler, more focus-friendly ordering:
- Put demanding / deep-focus tasks earlier (mornings), when energy is highest.
- Put short breaks or movement between heavy blocks.
- Keep the afternoon lighter and protect some open/rest time.
- Keep EVERY task title exactly as given — only change the suggested times/order.
- Use realistic times, no overlaps, 24h HH:MM.

Today's schedule:
${list}

Respond with a one-sentence encouraging message and the reordered blocks.`,
    });

    return NextResponse.json(object);
  } catch (err) {
    console.error("AI schedule suggestion failed:", err);
    const detail = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: `Couldn't reach the AI right now. (${detail})` },
      { status: 502 }
    );
  }
}
