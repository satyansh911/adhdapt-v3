import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Clock, Target } from "lucide-react";
import type { ScheduledTask } from "@/types/task";

interface ProgressBarProps {
  schedule: ScheduledTask[];
  completedTasks: Set<string>;
}

export function ProgressBar({ schedule, completedTasks }: ProgressBarProps) {
  const totalTasks = schedule.filter((item) => item.type === "task").length;
  const completedCount = schedule.filter(
    (item) => item.type === "task" && completedTasks.has(item.id)
  ).length;

  const progressPercentage =
    totalTasks > 0 ? (completedCount / totalTasks) * 100 : 0;

  const totalDuration = schedule
    .filter((item) => item.type === "task")
    .reduce((sum, task) => sum + task.duration, 0);

  const completedDuration = schedule
    .filter((item) => item.type === "task" && completedTasks.has(item.id))
    .reduce((sum, task) => sum + task.duration, 0);

  return (
    <Card className="border shadow-[5px_5px_0px_0px_#d04f99] border-[#d04f99] rounded-3xl bg-[#fdedc9] mb-8">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <Target className="h-5 w-5 text-[#d04f99]" />
            Daily Progress
          </h2>
          <div className="text-sm text-muted-foreground">
            {completedCount} of {totalTasks} tasks completed
          </div>
        </div>

        <Progress value={progressPercentage} className="h-3 mb-4" />

        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="flex flex-col items-center gap-1">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="text-sm font-medium text-foreground">
              Completed
            </span>
            <span className="text-lg font-bold text-green-600">
              {completedCount}
            </span>
          </div>

          <div className="flex flex-col items-center gap-1">
            <Clock className="h-5 w-5 text-[#d04f99]" />
            <span className="text-sm font-medium text-foreground">
              Time Done
            </span>
            <span className="text-lg font-bold text-[#d04f99]">
              {completedDuration}m
            </span>
          </div>

          <div className="flex flex-col items-center gap-1">
            <Target className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">
              Total Time
            </span>
            <span className="text-lg font-bold text-muted-foreground">
              {totalDuration}m
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
