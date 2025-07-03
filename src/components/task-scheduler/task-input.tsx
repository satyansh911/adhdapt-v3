"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, X, Sparkles, RotateCcw, Clock } from "lucide-react";
import type { Task } from "@/types/task";

interface TaskInputProps {
  onSubmit: (tasks: Task[], startTime: string) => void;
  isLoading: boolean;
  onReset: () => void;
  hasSchedule: boolean;
}

export function TaskInput({
  onSubmit,
  isLoading,
  onReset,
  hasSchedule,
}: TaskInputProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentTask, setCurrentTask] = useState("");
  const [currentDuration, setCurrentDuration] = useState("");
  const [currentTimeSlot, setCurrentTimeSlot] = useState<
    "morning" | "afternoon" | "evening"
  >("morning");
  const [startTime, setStartTime] = useState(() => {
    const now = new Date();
    return now.toTimeString().slice(0, 5); // HH:MM
  });

  const addTask = () => {
    if (currentTask.trim() && currentDuration && currentTimeSlot) {
      const newTask: Task = {
        id: Date.now().toString(),
        name: currentTask.trim(),
        estimatedDuration: Number.parseInt(currentDuration),
        priority: "medium",
        preferredTimeSlot: currentTimeSlot,
      };
      setTasks([...tasks, newTask]);
      setCurrentTask("");
      setCurrentDuration("");
      setCurrentTimeSlot("morning");
    }
  };

  const removeTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const handleSubmit = () => {
    if (tasks.length > 0 && startTime) {
      onSubmit(tasks, startTime);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addTask();
    }
  };

  const getTimeSlotColor = (timeSlot: string) => {
    switch (timeSlot) {
      case "morning":
        return "bg-[#8acfd1] text-[#2d5a5c]";
      case "afternoon":
        return "bg-[#f4a261] text-[#8b4513]";
      case "evening":
        return "bg-[#d04f99]/20 text-[#d04f99]";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getTimeSlotIcon = (timeSlot: string) => {
    switch (timeSlot) {
      case "morning":
        return "🌅";
      case "afternoon":
        return "☀️";
      case "evening":
        return "🌙";
      default:
        return "⏰";
    }
  };

  return (
    <Card className="border shadow-[5px_5px_0px_0px_#d04f99] border-[#d04f99] rounded-3xl bg-[#fdedc9]">
      <CardHeader className="bg-[#d04f99] text-[#FFFFFF] rounded-t-3xl">
        <CardTitle className="text-2xl text-[#FFFFFF] flex items-center gap-2">
          <Plus className="h-6 w-6" />
          Plan Your Day
        </CardTitle>
      </CardHeader>

      <CardContent className="p-8 space-y-6">
        {/* Start Time Selection */}
        <div className="p-4 bg-[#d04f99]/5 rounded-2xl border border-[#d04f99]/20">
          <Label
            htmlFor="startTime"
            className="text-base font-medium text-[#d04f99] mb-2 block flex items-center gap-2"
          >
            <Clock className="h-4 w-4" />
            When do you want to start your tasks?
          </Label>
          <Input
            id="startTime"
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="text-base h-12 border-2 border-[#d04f99]/20 focus:border-[#d04f99] bg-background rounded-2xl"
          />
          <p className="text-sm text-[#d04f99]/70 mt-2">
            AI will schedule your tasks starting from this time
          </p>
        </div>

        {/* Task Input Form */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <Label
              htmlFor="task"
              className="text-base font-medium text-foreground mb-2 block"
            >
              Task Name
            </Label>
            <Input
              id="task"
              placeholder="e.g., Write report, Clean room, Study math..."
              value={currentTask}
              onChange={(e) => setCurrentTask(e.target.value)}
              onKeyPress={handleKeyPress}
              className="text-base h-12 border-2 border-[#d04f99]/20 focus:border-[#d04f99] rounded-2xl"
            />
          </div>

          <div>
            <Label
              htmlFor="duration"
              className="text-base font-medium text-foreground mb-2 block"
            >
              Duration (min)
            </Label>
            <Input
              id="duration"
              type="number"
              placeholder="30"
              value={currentDuration}
              onChange={(e) => setCurrentDuration(e.target.value)}
              onKeyPress={handleKeyPress}
              className="text-base h-12 border-2 border-[#d04f99]/20 focus:border-[#d04f99] rounded-2xl"
              min="5"
              max="240"
            />
          </div>

          <div>
            <Label
              htmlFor="timeSlot"
              className="text-base font-medium text-foreground mb-2 block"
            >
              Preferred Time
            </Label>
            <Select
              value={currentTimeSlot}
              onValueChange={(value: "morning" | "afternoon" | "evening") =>
                setCurrentTimeSlot(value)
              }
            >
              <SelectTrigger className="h-12 border-2 border-[#d04f99]/20 focus:border-[#d04f99] rounded-2xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="morning">🌅 Morning</SelectItem>
                <SelectItem value="afternoon">☀️ Afternoon</SelectItem>
                <SelectItem value="evening">🌙 Evening</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button
          onClick={addTask}
          disabled={!currentTask.trim() || !currentDuration || !currentTimeSlot}
          className="w-full md:w-auto bg-[#d04f99] hover:bg-[#d04f99]/90 text-[#FFFFFF] h-12 px-8 text-base font-medium rounded-2xl"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>

        {/* Task List */}
        {tasks.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-foreground">
              Your Tasks ({tasks.length})
            </h3>
            <div className="space-y-2">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-3 bg-background/50 rounded-2xl border border-[#d04f99]/20"
                >
                  <div className="flex items-center gap-3">
                    <Badge className={getTimeSlotColor(task.preferredTimeSlot)}>
                      {getTimeSlotIcon(task.preferredTimeSlot)}{" "}
                      {task.preferredTimeSlot}
                    </Badge>
                    <span className="font-medium text-foreground">
                      {task.name}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      ({task.estimatedDuration} min)
                    </span>
                  </div>
                  <Button
                    onClick={() => removeTask(task.id)}
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10 rounded-2xl"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button
            onClick={handleSubmit}
            disabled={tasks.length === 0 || isLoading}
            className="flex-1 bg-[#d04f99] hover:bg-[#d04f99]/90 text-[#FFFFFF] h-12 text-base font-medium rounded-2xl"
          >
            {isLoading ? (
              <>
                <RotateCcw className="h-4 w-4 mr-2 animate-spin" />
                Creating Schedule...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Create AI Schedule
              </>
            )}
          </Button>

          {hasSchedule && (
            <Button
              onClick={onReset}
              variant="outline"
              className="border-2 border-[#d04f99]/20 hover:bg-[#d04f99]/5 bg-transparent h-12 rounded-2xl"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
