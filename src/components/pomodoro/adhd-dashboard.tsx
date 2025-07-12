"use client";

import { useState, useCallback } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import PomodoroSection from "./pomodoro-section";
import TaskListSection from "./task-list-section";
import SummarySection from "./summary-section";

export interface Task {
  id: string;
  name: string;
  completed: boolean;
}

export default function ADHDDashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [totalProductiveTime, setTotalProductiveTime] = useState(0); // seconds
  const [totalBreakTime, setTotalBreakTime] = useState(0); // seconds
  const [completedTasksCount, setCompletedTasksCount] = useState(0);

  const activeTaskName =
    activeTaskId && tasks.find((t) => t.id === activeTaskId)
      ? tasks.find((t) => t.id === activeTaskId)!.name
      : "No task selected";

  const handleAddTask = useCallback((name: string) => {
    setTasks((prev) => [
      ...prev,
      { id: crypto.randomUUID(), name, completed: false },
    ]);
  }, []);

  const handleToggleTaskComplete = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === id) {
          if (!task.completed) {
            setCompletedTasksCount((prevCount) => prevCount + 1);
          } else {
            setCompletedTasksCount((prevCount) => Math.max(0, prevCount - 1)); // Decrement if un-completing
          }
          return { ...task, completed: !task.completed };
        }
        return task;
      })
    );
  }, []);

  const handleDeleteTask = useCallback(
    (id: string) => {
      setTasks((prev) => {
        const taskToDelete = prev.find((task) => task.id === id);
        if (taskToDelete && taskToDelete.completed) {
          setCompletedTasksCount((prevCount) => Math.max(0, prevCount - 1));
        }
        if (activeTaskId === id) {
          setActiveTaskId(null); // Clear active task if deleted
        }
        return prev.filter((task) => task.id !== id);
      });
    },
    [activeTaskId]
  );

  const handleTimeUpdate = useCallback(
    (mode: "productive" | "break", elapsedSeconds: number) => {
      if (mode === "productive") {
        setTotalProductiveTime((prev) => prev + elapsedSeconds);
      } else {
        setTotalBreakTime((prev) => prev + elapsedSeconds);
      }
    },
    []
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full max-w-6xl mx-auto p-4">
      {/* Main Pomodoro Timer Section */}
      <Card className="lg:col-span-2 shadow-[5px_5px_0px_0px_#d04f99] border-[#d04f99] border rounded-3xl bg-[#fdedc9]">
        <CardHeader className="text-center pb-4 bg-[#d04f99] text-[#fff] rounded-t-3xl">
          <CardTitle className="text-4xl font-extrabold text-[#fff] tracking-tight">
            Focus Hub
          </CardTitle>
          <CardDescription className="text-md text-[#fff]/80 mt-1">
            Your personalized space for deep work and mindful breaks.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <PomodoroSection
            activeTaskName={activeTaskName}
            onTimeUpdate={handleTimeUpdate}
          />
        </CardContent>
      </Card>

      {/* Task List Section */}
      <Card className="shadow-[5px_5px_0px_0px_#d04f99] border-[#d04f99] border rounded-3xl bg-[#fdedc9]">
        <CardHeader className="pb-4 bg-[#d04f99] text-[#fff] rounded-t-3xl">
          <CardTitle className="text-2xl font-bold text-[#fff]">
            Your Tasks
          </CardTitle>
          <CardDescription className="text-sm text-[#fff]/80">
            Organize your focus.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <TaskListSection
            tasks={tasks}
            activeTaskId={activeTaskId}
            onAddTask={handleAddTask}
            onToggleTaskComplete={handleToggleTaskComplete}
            onSetActiveTask={setActiveTaskId}
            onDeleteTask={handleDeleteTask}
          />
        </CardContent>
      </Card>

      {/* Activity Summary Section */}
      <Card className="lg:col-span-3 shadow-[5px_5px_0px_0px_#d04f99] border-[#d04f99] border rounded-3xl bg-[#fdedc9]">
        <CardHeader className="pb-4 bg-[#d04f99] text-[#fff] rounded-t-3xl">
          <CardTitle className="text-2xl font-bold text-[#fff]">
            Activity Summary
          </CardTitle>
          <CardDescription className="text-sm text-[#fff]/80">
            Your progress at a glance.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <SummarySection
            totalProductiveTime={totalProductiveTime}
            totalBreakTime={totalBreakTime}
            completedTasksCount={completedTasksCount}
          />
        </CardContent>
      </Card>
    </div>
  );
}
