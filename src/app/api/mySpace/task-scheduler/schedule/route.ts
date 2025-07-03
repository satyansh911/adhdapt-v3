import { type NextRequest, NextResponse } from "next/server";
import { generateText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import type { Task, ScheduledTask } from "@/types/task";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      console.error("GOOGLE_GENERATIVE_AI_API_KEY is not set");
      return NextResponse.json(
        { error: "AI service not configured" },
        { status: 500 }
      );
    }

    const { tasks, startTime }: { tasks: Task[]; startTime: string } =
      await request.json();

    if (!tasks || tasks.length === 0) {
      return NextResponse.json({ error: "No tasks provided" }, { status: 400 });
    }

    if (!startTime) {
      return NextResponse.json(
        { error: "Start time is required" },
        { status: 400 }
      );
    }

    // Get current date and combine with start time
    const today = new Date();
    const [hours, minutes] = startTime.split(":").map(Number);
    const startDateTime = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      hours,
      minutes
    );

    // Create detailed task descriptions for AI
    const tasksDescription = tasks
      .map(
        (task) =>
          `- ${task.name} (${task.estimatedDuration} minutes, ${task.priority} priority, prefers ${task.preferredTimeSlot})`
      )
      .join("\n");

    const prompt = `
You are an AI assistant specialized in creating ADHD-friendly schedules. Create an optimal schedule for the following tasks with these guidelines:

TASKS:
${tasksDescription}

SCHEDULING REQUIREMENTS:
1. Schedule tasks in their PREFERRED TIME SLOTS, not continuously:
   - Morning tasks: 6:00 AM - 12:00 PM
   - Afternoon tasks: 12:00 PM - 6:00 PM  
   - Evening tasks: 6:00 PM - 10:00 PM

2. RESPECT TIME SLOT PREFERENCES - don't schedule morning tasks in the evening!

3. Within each time slot, add 10-15 minute breaks between tasks

4. If multiple tasks have the same time slot preference, space them out within that time period

5. Leave natural gaps between different time slots (e.g., lunch break between morning and afternoon)

6. Start the earliest tasks no earlier than the user's specified start time: ${startDateTime.toLocaleString()}

7. For ADHD users: 
   - Don't pack tasks too tightly
   - Allow buffer time between different types of activities
   - Shorter tasks can be grouped closer together
   - Longer tasks need more recovery time

IMPORTANT: Return ONLY a valid JSON array with this exact structure, including REALISTIC times for each time slot:
[
  {
    "id": "task_1",
    "name": "Task Name",
    "duration": 30,
    "type": "task",
    "originalTaskId": "original_id",
    "scheduledTime": "09:30"
  },
  {
    "id": "break_1", 
    "name": "Break",
    "duration": 10,
    "type": "break",
    "scheduledTime": "10:00"
  }
]

The scheduledTime should be in HH:MM format and respect the preferred time slots. Do not include any explanation, markdown formatting, or additional text. Just the JSON array.
`;

    const { text } = await generateText({
      model: google("gemini-1.5-flash"),
      prompt,
      temperature: 0.2,
    });

    // Parse AI response
    let scheduledItems;
    try {
      const cleanedText = text.trim();
      let jsonText = cleanedText;

      // Remove markdown code blocks if present
      if (cleanedText.startsWith("```json")) {
        jsonText = cleanedText.replace(/```json\n?/, "").replace(/\n?```$/, "");
      } else if (cleanedText.startsWith("```")) {
        jsonText = cleanedText.replace(/```\n?/, "").replace(/\n?```$/, "");
      }

      // Extract JSON array
      const jsonMatch = jsonText.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        jsonText = jsonMatch[0];
      }

      scheduledItems = JSON.parse(jsonText);

      if (!Array.isArray(scheduledItems)) {
        throw new Error("Response is not an array");
      }
    } catch (parseError) {
      console.error("Failed to parse AI response:", text);
      console.error("Parse error:", parseError);
      // Use enhanced fallback scheduling
      scheduledItems = createTimeSlotAwareSchedule(tasks, startDateTime);
    }

    // Convert to ScheduledTask objects with actual times
    const schedule: ScheduledTask[] = [];

    for (const item of scheduledItems) {
      let scheduledTime: Date;

      if (item.scheduledTime) {
        // Parse the scheduled time from AI
        const [hours, minutes] = item.scheduledTime.split(":").map(Number);
        scheduledTime = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate(),
          hours,
          minutes
        );
      } else {
        // Fallback to start time
        scheduledTime = new Date(startDateTime);
      }

      const startTime = new Date(scheduledTime);
      const endTime = new Date(scheduledTime.getTime() + item.duration * 60000);

      schedule.push({
        id: item.id || `${item.type}_${Date.now()}_${Math.random()}`,
        name: item.name,
        duration: item.duration,
        startTime,
        endTime,
        type: item.type,
        originalTaskId: item.originalTaskId,
      });
    }

    // Sort schedule by start time
    schedule.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());

    return NextResponse.json({ schedule });
  } catch (error) {
    console.error("Error creating schedule:", error);

    // Enhanced fallback with proper error handling
    try {
      const { tasks, startTime }: { tasks: Task[]; startTime: string } =
        await request.json();
      const today = new Date();
      const [hours, minutes] = startTime.split(":").map(Number);
      const startDateTime = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        hours,
        minutes
      );

      const fallbackSchedule = createTimeSlotAwareSchedule(
        tasks,
        startDateTime
      );

      const schedule: ScheduledTask[] = [];

      for (const item of fallbackSchedule) {
        const [hours, minutes] = item.scheduledTime.split(":").map(Number);
        const scheduledTime = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate(),
          hours,
          minutes
        );

        const startTime = new Date(scheduledTime);
        const endTime = new Date(
          scheduledTime.getTime() + item.duration * 60000
        );

        schedule.push({
          id: item.id,
          name: item.name,
          duration: item.duration,
          startTime,
          endTime,
          type: item.type,
          originalTaskId: item.originalTaskId,
        });
      }

      // Sort schedule by start time
      schedule.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());

      return NextResponse.json({ schedule });
    } catch (fallbackError) {
      return NextResponse.json(
        { error: "Failed to create schedule" },
        { status: 500 }
      );
    }
  }
}

function createTimeSlotAwareSchedule(tasks: Task[], startDateTime: Date) {
  const schedule = [];

  // Define time slot ranges
  const timeSlots = {
    morning: { start: 6, end: 12 },
    afternoon: { start: 12, end: 18 },
    evening: { start: 18, end: 22 },
  };

  // Group tasks by preferred time slot
  const tasksByTimeSlot = {
    morning: tasks.filter((t) => t.preferredTimeSlot === "morning"),
    afternoon: tasks.filter((t) => t.preferredTimeSlot === "afternoon"),
    evening: tasks.filter((t) => t.preferredTimeSlot === "evening"),
  };

  // Schedule each time slot
  Object.entries(tasksByTimeSlot).forEach(([timeSlot, slotTasks]) => {
    if (slotTasks.length === 0) return;

    const slot = timeSlots[timeSlot as keyof typeof timeSlots];
    let currentHour = Math.max(slot.start, startDateTime.getHours());
    let currentMinute = startDateTime.getMinutes();

    // If we're past this time slot for today, skip it
    if (currentHour >= slot.end) return;

    // Sort tasks within time slot by duration (shorter first for momentum)
    const sortedTasks = slotTasks.sort(
      (a, b) => a.estimatedDuration - b.estimatedDuration
    );

    sortedTasks.forEach((task, index) => {
      // Add the task
      const taskTime = `${currentHour
        .toString()
        .padStart(2, "0")}:${currentMinute.toString().padStart(2, "0")}`;

      schedule.push({
        id: task.id,
        name: task.name,
        duration: task.estimatedDuration,
        type: "task",
        originalTaskId: task.id,
        scheduledTime: taskTime,
      });

      // Update current time
      currentMinute += task.estimatedDuration;
      while (currentMinute >= 60) {
        currentHour += 1;
        currentMinute -= 60;
      }

      // Add break after task (except for the last task in the slot)
      if (index < sortedTasks.length - 1 && currentHour < slot.end) {
        const breakDuration = task.estimatedDuration >= 60 ? 15 : 10;
        const breakTime = `${currentHour
          .toString()
          .padStart(2, "0")}:${currentMinute.toString().padStart(2, "0")}`;

        schedule.push({
          id: `break_${timeSlot}_${index}`,
          name: "Break",
          duration: breakDuration,
          type: "break",
          scheduledTime: breakTime,
        });

        // Update current time after break
        currentMinute += breakDuration;
        while (currentMinute >= 60) {
          currentHour += 1;
          currentMinute -= 60;
        }
      }

      // Add buffer time between tasks (5-10 minutes)
      if (index < sortedTasks.length - 1) {
        currentMinute += 5;
        while (currentMinute >= 60) {
          currentHour += 1;
          currentMinute -= 60;
        }
      }
    });
  });

  return schedule;
}
