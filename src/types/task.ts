export interface Task {
  id: string;
  name: string;
  estimatedDuration: number;
  priority: "low" | "medium" | "high";
  preferredTimeSlot: "morning" | "afternoon" | "evening";
}

export interface ScheduledTask {
  id: string;
  name: string;
  duration: number;
  startTime: Date;
  endTime: Date;
  type: "task" | "break";
  originalTaskId?: string;
}
