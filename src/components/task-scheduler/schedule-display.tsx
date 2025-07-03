"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Clock,
  Coffee,
  CheckCircle,
  RotateCcw,
  Play,
  Sun,
  Sunset,
  Moon,
  Sparkles,
} from "lucide-react";
import type { ScheduledTask } from "@/types/task";
import { useState, useEffect } from "react";

interface ScheduleDisplayProps {
  schedule: ScheduledTask[];
  onReset: () => void;
  completedTasks: Set<string>;
  onTaskComplete: (taskId: string) => void;
}

export function ScheduleDisplay({
  schedule,
  onReset,
  completedTasks,
  onTaskComplete,
}: ScheduleDisplayProps) {
  const [breakAdvice, setBreakAdvice] = useState<Record<string, string>>({});
  const [loadingAdvice, setLoadingAdvice] = useState<Set<string>>(new Set());

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getTimeSlotInfo = (time: Date) => {
    const hour = time.getHours();
    if (hour >= 6 && hour < 12) {
      return {
        slot: "Morning",
        icon: <Sun className="h-4 w-4" />,
        color: "bg-[#8acfd1]/50 border-[#8acfd1]/30",
      };
    } else if (hour >= 12 && hour < 18) {
      return {
        slot: "Afternoon",
        icon: <Sunset className="h-4 w-4" />,
        color: "bg-[#f4a261]/50 border-[#f4a261]/30",
      };
    } else {
      return {
        slot: "Evening",
        icon: <Moon className="h-4 w-4" />,
        color: "bg-[#d04f99]/10 border-[#d04f99]/20",
      };
    }
  };

  const getTaskIcon = (type: "task" | "break") => {
    return type === "break" ? (
      <Coffee className="h-5 w-5" />
    ) : (
      <Clock className="h-5 w-5" />
    );
  };

  const getTaskColor = (type: "task" | "break", isCompleted: boolean) => {
    if (isCompleted) return "bg-green-50 border-green-200";
    return type === "break"
      ? "bg-[#f4a261]/50 border-[#f4a261]/30"
      : "bg-[#d04f99]/10 border-[#d04f99]/20";
  };

  const getBadgeColor = (type: "task" | "break") => {
    return type === "break"
      ? "bg-[#f4a261] text-[#8b4513]"
      : "bg-[#d04f99]/20 text-[#d04f99]";
  };

  const isCurrentTask = (task: ScheduledTask) => {
    const now = new Date();
    return now >= task.startTime && now <= task.endTime;
  };

  const getBreakAdvice = async (
    breakId: string,
    previousTask: ScheduledTask
  ) => {
    if (breakAdvice[breakId] || loadingAdvice.has(breakId)) return;

    setLoadingAdvice((prev) => new Set(prev).add(breakId));

    try {
      const timeSlot = getTimeSlotInfo(
        previousTask.startTime
      ).slot.toLowerCase();

      const response = await fetch("/api/mySpace/task-scheduler/break-advice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          taskName: previousTask.name,
          taskDuration: previousTask.duration,
          timeOfDay: timeSlot,
        }),
      });

      const data = await response.json();

      setBreakAdvice((prev) => ({
        ...prev,
        [breakId]:
          data.advice ||
          "Take a moment to rest and recharge before your next task.",
      }));
    } catch (error) {
      console.error("Error getting break advice:", error);
      setBreakAdvice((prev) => ({
        ...prev,
        [breakId]:
          "Take a moment to rest, stretch, and hydrate before your next task.",
      }));
    } finally {
      setLoadingAdvice((prev) => {
        const newSet = new Set(prev);
        newSet.delete(breakId);
        return newSet;
      });
    }
  };

  // Group schedule by time slots
  const groupedSchedule = schedule.reduce((groups, item) => {
    const timeSlot = getTimeSlotInfo(item.startTime);
    if (!groups[timeSlot.slot]) {
      groups[timeSlot.slot] = [];
    }
    groups[timeSlot.slot].push(item);
    return groups;
  }, {} as Record<string, ScheduledTask[]>);

  useEffect(() => {
    schedule.forEach((item, index) => {
      const previousTask = index > 0 ? schedule[index - 1] : null;
      if (
        item.type === "break" &&
        previousTask &&
        previousTask.type === "task"
      ) {
        getBreakAdvice(item.id, previousTask);
      }
    });
  }, [schedule]);

  return (
    <Card className="border shadow-[5px_5px_0px_0px_#d04f99] border-[#d04f99] rounded-3xl bg-[#fdedc9]">
      <CardHeader className="bg-[#d04f99] text-[#FFFFFF] rounded-t-3xl">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl text-[#FFFFFF] flex items-center gap-2">
            <Clock className="h-6 w-6" />
            Your Daily Schedule
          </CardTitle>

          <Button
            onClick={onReset}
            variant="outline"
            className="border-2 border-[#FFFFFF]/20 hover:bg-[#FFFFFF]/10 bg-transparent text-[#FFFFFF] rounded-2xl"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            New Schedule
          </Button>
        </div>

        <p className="text-[#FFFFFF]/80 mt-2">
          Tasks are scheduled in your preferred time slots with AI-powered break
          recommendations.
        </p>
      </CardHeader>

      <CardContent className="p-8">
        <div className="space-y-6">
          {Object.entries(groupedSchedule).map(([timeSlot, items]) => {
            const timeSlotInfo = getTimeSlotInfo(items[0].startTime);

            return (
              <div
                key={timeSlot}
                className={`p-4 rounded-2xl border-2 ${timeSlotInfo.color}`}
              >
                <div className="flex items-center gap-2 mb-4">
                  {timeSlotInfo.icon}
                  <h3 className="text-lg font-semibold text-foreground">
                    {timeSlot}
                  </h3>
                </div>

                <div className="space-y-3">
                  {items.map((item) => {
                    const isCompleted = completedTasks.has(item.id);
                    const isCurrent = isCurrentTask(item);

                    return (
                      <div
                        key={item.id}
                        className={`p-4 rounded-2xl border-2 ${getTaskColor(
                          item.type,
                          isCompleted
                        )} ${
                          isCurrent ? "ring-2 ring-[#d04f99] ring-offset-2" : ""
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            <div className="flex-shrink-0 mt-1">
                              {getTaskIcon(item.type)}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className="font-medium text-foreground">
                                  {item.name}
                                </h4>
                                <Badge className={getBadgeColor(item.type)}>
                                  {item.type === "break" ? "Break" : "Task"}
                                </Badge>
                                {isCompleted && (
                                  <Badge className="bg-green-100 text-green-700">
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Done
                                  </Badge>
                                )}
                              </div>

                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span>
                                  {formatTime(item.startTime)} -{" "}
                                  {formatTime(item.endTime)}
                                </span>
                                <span>
                                  {item.duration} min
                                  {item.type === "break" ? " break" : ""}
                                </span>
                              </div>

                              {item.type === "break" &&
                                breakAdvice[item.id] && (
                                  <div className="mt-3 p-3 bg-background/50 rounded-2xl border border-[#d04f99]/20">
                                    <div className="flex items-start gap-2">
                                      <Sparkles className="h-4 w-4 text-[#d04f99] mt-0.5 flex-shrink-0" />
                                      <p className="text-sm text-muted-foreground">
                                        {breakAdvice[item.id]}
                                      </p>
                                    </div>
                                  </div>
                                )}
                            </div>
                          </div>

                          {item.type === "task" && !isCompleted && (
                            <Button
                              onClick={() => onTaskComplete(item.id)}
                              size="sm"
                              className="bg-[#d04f99] hover:bg-[#d04f99]/90 text-[#FFFFFF] rounded-2xl"
                            >
                              <Play className="h-3 w-3 mr-1" />
                              Start
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
