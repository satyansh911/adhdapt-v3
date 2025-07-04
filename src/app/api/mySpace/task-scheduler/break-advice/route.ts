import { type NextRequest, NextResponse } from "next/server";
import { generateText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      return NextResponse.json(
        { error: "AI service not configured" },
        { status: 500 }
      );
    }

    const { taskName, taskDuration, timeOfDay } = await request.json();

    if (!taskName) {
      return NextResponse.json(
        { error: "Task name is required" },
        { status: 400 }
      );
    }

    const prompt = `
You are an ADHD-friendly wellness coach. A person just completed this task: "${taskName}" which took ${taskDuration} minutes during ${timeOfDay}.

Provide a personalized break recommendation that considers:
1. The mental/physical demands of the task they just finished
2. The time of day and energy levels
3. ADHD-specific needs (dopamine, movement, sensory reset)
4. The upcoming transition back to work

Give 2-3 specific, actionable break activities in 1-2 sentences. Be encouraging and understanding of ADHD challenges.

Examples of good advice:
- After computer work: "Step away from screens and do 10 jumping jacks to get your blood flowing, then grab a healthy snack and some water."
- After creative work: "Take 5 deep breaths and organize your workspace - the visual reset will help your brain transition to the next task."
- After physical tasks: "Sit down, hydrate, and listen to a favorite song to recharge your mental energy."

Keep it concise, positive, and ADHD-friendly. Focus on activities that take 5-15 minutes.
`;

    const { text } = await generateText({
      model: google("gemini-1.5-flash"),
      prompt,
      temperature: 0.7,
    });

    return NextResponse.json({ advice: text.trim() });
  } catch (error) {
    console.error("Error generating break advice:", error);

    // Fallback advice based on task type
    const fallbackAdvice = getFallbackAdvice(
      request.body?.taskName || "",
      request.body?.timeOfDay || ""
    );
    return NextResponse.json({ advice: fallbackAdvice });
  }
}

function getFallbackAdvice(taskName: string, timeOfDay: string): string {
  const taskLower = taskName.toLowerCase();

  if (
    taskLower.includes("computer") ||
    taskLower.includes("write") ||
    taskLower.includes("email")
  ) {
    return "Great job! Step away from the screen and do some gentle neck rolls and shoulder stretches. Grab some water and take 5 deep breaths to reset your focus.";
  } else if (taskLower.includes("clean") || taskLower.includes("organize")) {
    return "Nice work! Sit down for a moment and enjoy the organized space you created. Have a healthy snack and appreciate your accomplishment.";
  } else if (taskLower.includes("study") || taskLower.includes("read")) {
    return "Well done! Give your brain a break by doing something physical - try 10 jumping jacks or a quick walk around the room to get your blood flowing.";
  } else {
    return "Excellent work! Take a moment to celebrate completing that task. Stretch, hydrate, and do something that makes you feel good before moving on.";
  }
}
