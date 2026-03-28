"use client";

import { useState } from "react";
import { TaskInput } from "@/components/task-scheduler/task-input";
import { ScheduleDisplay } from "@/components/task-scheduler/schedule-display";
import { Header } from "@/components/task-scheduler/header";
import { ProgressBar } from "@/components/task-scheduler/progress-bar";
import type { Task, ScheduledTask } from "@/types/task";

export default function TaskSchedulerPage() {
  const [, setTasks] = useState<Task[]>([]);
  const [schedule, setSchedule] = useState<ScheduledTask[]>([]);
  const [isScheduling, setIsScheduling] = useState(false);
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());

  const hasSchedulePresence = Array.isArray(schedule) && schedule.length > 0;

  const orchestrateScheduling = async (workItems: Task[], startingTime: string) => {
    setTasks(workItems);
    setIsScheduling(true);

    try {
      const apiResponse = await fetch("/api/mySpace/task-scheduler/schedule", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tasks: workItems,
          startTime: startingTime,
        }),
      });

      const schedulingResult = await apiResponse.json();

      // Convert ISO strings to Date objects with explicit type safety
      const hydratedSchedule: ScheduledTask[] = (schedulingResult?.schedule || []).map((taskRecord: { startTime: string; endTime: string }) => ({
        ...taskRecord,
        startTime: new Date(taskRecord.startTime),
        endTime: new Date(taskRecord.endTime),
      } as ScheduledTask));

      setSchedule(hydratedSchedule);
    } catch (exception: unknown) {
      console.error("Task synchronization failure:", exception);
    } finally {
      setIsScheduling(false);
    }
  };

  const purgeChronology = () => {
    setTasks([]);
    setSchedule([]);
    setCompletedTasks(new Set());
  };

  const toggleTaskCompletionStatus = (targetTaskId: string) => {
    const updatedStatusSet = new Set(completedTasks);
    if (updatedStatusSet.has(targetTaskId)) {
      updatedStatusSet.delete(targetTaskId);
    } else {
      updatedStatusSet.add(targetTaskId);
    }
    setCompletedTasks(updatedStatusSet);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Header />

        {hasSchedulePresence && (
          <ProgressBar schedule={schedule} completedTasks={completedTasks} />
        )}

        <div className="space-y-8">
          {/* Show schedule first when it exists */}
          {hasSchedulePresence && (
            <ScheduleDisplay
              schedule={schedule}
              onReset={purgeChronology}
              completedTasks={completedTasks}
              onTaskComplete={toggleTaskCompletionStatus}
            />
          )}

          {/* Task input section - shown below schedule or at top if no schedule */}
          <TaskInput
            onSubmit={orchestrateScheduling}
            isLoading={isScheduling}
            onReset={purgeChronology}
            hasSchedule={hasSchedulePresence}
          />
        </div>
      </div>
    </div>
  );
}
