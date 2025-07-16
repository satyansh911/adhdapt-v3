"use client";

import { useCallback } from "react";
import { Card } from "@/components/ui/card";

interface SummarySectionProps {
  totalProductiveTime: number;
  totalBreakTime: number;
  completedTasksCount: number;
}

export default function SummarySection({
  totalProductiveTime,
  totalBreakTime,
  completedTasksCount,
}: SummarySectionProps) {
  const formatTime = useCallback((totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    }
    return `${seconds}s`;
  }, []);

  const totalOverallTime = totalProductiveTime + totalBreakTime;
  const productivePercentage =
    totalOverallTime > 0 ? (totalProductiveTime / totalOverallTime) * 100 : 0;
  const breakPercentage =
    totalOverallTime > 0 ? (totalBreakTime / totalOverallTime) * 100 : 0;

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
        <Card className="p-4 bg-[#fdedc9] border-[#d04f99] shadow-[2px_2px_0px_0px_#d04f99] rounded-2xl">
          <p className="text-sm text-[#d04f99] font-medium">Total Productive</p>
          <p className="text-3xl font-bold text-[#d04f99] mt-1">
            {formatTime(totalProductiveTime)}
          </p>
        </Card>
        <Card className="p-4 bg-[#fdedc9] border-[#d04f99] shadow-[2px_2px_0px_0px_#d04f99] rounded-2xl">
          <p className="text-sm text-blue-700 font-medium">Total Break</p>
          <p className="text-3xl font-bold text-blue-800 mt-1">
            {formatTime(totalBreakTime)}
          </p>
        </Card>
        <Card className="p-4 bg-[#fdedc9] border-[#d04f99] shadow-[2px_2px_0px_0px_#d04f99] rounded-2xl">
          <p className="text-sm text-[#d04f99] font-medium">Tasks Completed</p>
          <p className="text-3xl font-bold text-[#d04f99] mt-1">
            {completedTasksCount}
          </p>
        </Card>
      </div>

      <div className="w-full mt-2 space-y-3">
        <div className="flex justify-between text-sm font-medium text-[#d04f99]">
          <span>Productive: {productivePercentage.toFixed(0)}%</span>
          <span>Break: {breakPercentage.toFixed(0)}%</span>
        </div>
        <div className="relative h-6 w-full rounded-full bg-[#d04f99]/20 overflow-hidden">
          <div className="flex h-full">
            <div
              className="bg-[#d04f99] transition-all duration-300 ease-out"
              style={{ width: `${productivePercentage}%` }}
              aria-label={`Productive time: ${productivePercentage.toFixed(
                0
              )}%`}
            />
            <div
              className="bg-blue-500 transition-all duration-300 ease-out"
              style={{ width: `${breakPercentage}%` }}
              aria-label={`Break time: ${breakPercentage.toFixed(0)}%`}
            />
          </div>
        </div>
        <p className="text-xs text-muted-foreground text-center">
          Pink: Productive &nbsp;|&nbsp; Blue: Break
        </p>
      </div>
    </div>
  );
}
