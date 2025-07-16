"use client";

import { useState, type KeyboardEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Trash2, PlayCircle } from "lucide-react";
import type { Task } from "./adhd-dashboard";

interface TaskListSectionProps {
  tasks: Task[];
  activeTaskId: string | null;
  onAddTask: (name: string) => void;
  onToggleTaskComplete: (id: string) => void;
  onSetActiveTask: (id: string | null) => void;
  onDeleteTask: (id: string) => void;
}

export default function TaskListSection({
  tasks,
  activeTaskId,
  onAddTask,
  onToggleTaskComplete,
  onSetActiveTask,
  onDeleteTask,
}: TaskListSectionProps) {
  const [newTaskName, setNewTaskName] = useState("");

  const handleAddNewTask = () => {
    if (newTaskName.trim()) {
      onAddTask(newTaskName.trim());
      setNewTaskName("");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleAddNewTask();
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <Input
          placeholder="Add a new task..."
          value={newTaskName}
          onChange={(e) => setNewTaskName(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 text-base py-5 rounded-2xl bg-[#fdedc9] border-[#d04f99]/30 focus:border-[#d04f99] focus:ring-[#d04f99]"
        />
        <Button
          onClick={handleAddNewTask}
          className="py-5 px-4 bg-[#d04f99] text-white hover:bg-[#d04f99]/90 rounded-2xl"
        >
          <Plus className="h-5 w-5" />
          <span className="sr-only">Add Task</span>
        </Button>
      </div>

      {tasks.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">
          No tasks yet. Add one to get started!
        </p>
      ) : (
        <ScrollArea className="h-[300px] pr-4">
          <ul className="space-y-3">
            {tasks.map((task) => (
              <li
                key={task.id}
                className={`flex items-center gap-3 p-3 rounded-2xl transition-colors duration-200 ${
                  task.completed
                    ? "bg-[#fdedc9]/60 text-muted-foreground line-through"
                    : "bg-[#fdedc9] hover:bg-[#d04f99]/10"
                } ${
                  activeTaskId === task.id
                    ? "border-2 border-[#d04f99] shadow-[2px_2px_0px_0px_#d04f99]"
                    : "border border-[#d04f99]/30"
                }`}
              >
                <Checkbox
                  id={`task-${task.id}`}
                  checked={task.completed}
                  onCheckedChange={() => onToggleTaskComplete(task.id)}
                  className="h-5 w-5 border-[#d04f99]"
                />
                <label
                  htmlFor={`task-${task.id}`}
                  className="flex-1 text-base cursor-pointer"
                  onClick={() => onToggleTaskComplete(task.id)}
                >
                  {task.name}
                </label>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onSetActiveTask(task.id)}
                  className={`h-8 w-8 ${
                    activeTaskId === task.id
                      ? "text-[#d04f99]"
                      : "text-gray-500 hover:text-[#d04f99]"
                  }`}
                  aria-label={`Set "${task.name}" as active task`}
                >
                  <PlayCircle className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDeleteTask(task.id)}
                  className="h-8 w-8 text-gray-500 hover:text-red-500"
                  aria-label={`Delete "${task.name}"`}
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </li>
            ))}
          </ul>
        </ScrollArea>
      )}
    </div>
  );
}
