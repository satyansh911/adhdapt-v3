"use client";

import { useState } from "react";
import { TaskInput } from "@/components/task-scheduler/task-input";
import { ScheduleDisplay } from "@/components/task-scheduler/schedule-display";
import { Header } from "@/components/task-scheduler/header";
import { ProgressBar } from "@/components/task-scheduler/progress-bar";
import type { Task, ScheduledTask } from "@/types/task";

export default function TaskSchedulerPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [schedule, setSchedule] = useState<ScheduledTask[]>([]);
  const [isScheduling, setIsScheduling] = useState(false);
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());

  const hasSchedule = Array.isArray(schedule) && schedule.length > 0;

  const handleTasksSubmit = async (newTasks: Task[], startTime: string) => {
    setTasks(newTasks);
    setIsScheduling(true);

    try {
      const response = await fetch("/api/mySpace/task-scheduler/schedule", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tasks: newTasks,
          startTime: startTime,
        }),
      });

      const data = await response.json();

      // Convert ISO strings to Date objects
      const processed: ScheduledTask[] = data.schedule.map((item: any) => ({
        ...item,
        startTime: new Date(item.startTime),
        endTime: new Date(item.endTime),
      }));

      setSchedule(processed);
    } catch (error) {
      console.error("Error scheduling tasks:", error);
    } finally {
      setIsScheduling(false);
    }
  };

  const handleReset = () => {
    setTasks([]);
    setSchedule([]);
    setCompletedTasks(new Set());
  };

  const handleTaskComplete = (taskId: string) => {
    const newCompleted = new Set(completedTasks);
    if (newCompleted.has(taskId)) {
      newCompleted.delete(taskId);
    } else {
      newCompleted.add(taskId);
    }
    setCompletedTasks(newCompleted);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Header />

        {hasSchedule && (
          <ProgressBar schedule={schedule} completedTasks={completedTasks} />
        )}

        <div className="space-y-8">
          {/* Show schedule first when it exists */}
          {hasSchedule && (
            <ScheduleDisplay
              schedule={schedule}
              onReset={handleReset}
              completedTasks={completedTasks}
              onTaskComplete={handleTaskComplete}
            />
          )}

          {/* Task input section - shown below schedule or at top if no schedule */}
          <TaskInput
            onSubmit={handleTasksSubmit}
            isLoading={isScheduling}
            onReset={handleReset}
            hasSchedule={hasSchedule}
          />
        </div>
      </div>
    </div>
  );
}
