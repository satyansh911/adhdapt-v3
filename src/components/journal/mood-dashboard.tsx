"use client";

import type React from "react";
import { useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useJournal } from "./journal-provider";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { Pie, PieChart, Cell, Legend } from "recharts";
import * as LucideIcons from "lucide-react";
import type { Mood, IconKey } from "@/types/journal";

interface CustomYAxisTickProps {
  x?: number;
  y?: number;
  payload?: { value: string };
  moods: Mood[];
}

// Custom Y-Axis Tick component to render Lucide icons and text
const CustomYAxisTick = ({ x, y, payload, moods }: CustomYAxisTickProps) => {
  // Recharts sometimes sends an empty tick; skip it.
  if (!payload || payload.value === undefined) return null;

  const activeMood = moods?.find((m) => m.name === payload.value);
  const IconComponent = activeMood?.icon ? (LucideIcons[activeMood.icon as IconKey] as React.ElementType) : null;
  const textOffset = IconComponent ? 20 : 0; // Adjust text position if icon is present

  return (
    <g transform={`translate(${x},${y})`}>
      {IconComponent && (
        // Using foreignObject to embed React component (Lucide Icon) within SVG
        // Increased width and height to give enough space, overflow:visible
        <foreignObject
          x={-40}
          y={-10}
          width={30}
          height={20}
          style={{ overflow: "visible" }}
        >
          <div
            className="flex items-center justify-end h-full"
          >
            {IconComponent && (IconComponent as React.ElementType) && (
              <IconComponent className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
        </foreignObject>
      )}
      <text
        x={-5 - textOffset}
        y={0}
        dy={4}
        textAnchor="end"
        fill="hsl(var(--foreground))"
        className="text-sm"
      >
        {payload.value}
      </text>
    </g>
  );
};

const MoodDashboard: React.FC = () => {
  const { entries, moods } = useJournal();

  const vibrationAnalysis = useMemo(() => {
    const activityCounts: { [key: string]: number } = {};
    entries.forEach((record) => {
      if (record.moodId) {
        activityCounts[record.moodId] = (activityCounts[record.moodId] || 0) + 1;
      }
    });

    const paletteTokens = [
      "chart-1",
      "chart-2",
      "chart-3",
      "chart-4",
      "chart-5",
      "chart-6",
      "chart-7",
    ];

    return moods
      .map((mood, idx) => ({
        name: mood.name,
        count: activityCounts[mood.id] || 0,
        colorClass: mood.color.split(" ")[0].replace("bg-", ""),
        chartColorVar: paletteTokens[idx % paletteTokens.length],
        id: mood.id,
        icon: mood.icon,
      }))
      .filter((analysis) => analysis.count > 0)
      .sort((first, second) => second.count - first.count);
  }, [entries, moods]);

  const totalJournalPresence = entries.length;

  // Dynamically create chart config for ChartContainer
  const graphStructuralMap = useMemo(() => {
    return vibrationAnalysis.reduce((memo, mood) => {
      memo[mood.name] = {
        label: mood.name,
        color: `hsl(var(--${mood.chartColorVar}))`,
      };
      return memo;
    }, {} as Record<string, { label: string; color: string }>);
  }, [vibrationAnalysis]);

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Mood Analytics</CardTitle>
        <CardDescription>Insights into your emotional trends.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-8">
        {totalJournalPresence === 0 ? (
          <p className="text-center text-muted-foreground py-8 text-lg">
            No entries yet to analyze moods. Start writing!
          </p>
        ) : (
          <>
            <div className="h-[250px] w-full">
              <h3 className="text-lg font-semibold mb-4">Entries per Mood</h3>
              <ChartContainer config={graphStructuralMap} className="w-full h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={vibrationAnalysis}
                    layout="vertical"
                    margin={{ left: 50, right: 20 }}
                  >
                    <XAxis type="number" dataKey="count" hide />
                    <YAxis
                      type="category"
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      width={120} // Increased width for icon + text + offset
                      tick={<CustomYAxisTick moods={moods} />} // Use custom tick component
                    />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent />}
                    />
                    <Bar dataKey="count" fill="var(--color-count)" radius={5} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>

            <div className="h-[250px] w-full">
              <h3 className="text-lg font-semibold mb-4">Mood Distribution</h3>
              <ChartContainer config={graphStructuralMap} className="w-full h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={vibrationAnalysis}
                      dataKey="count"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      labelLine={false}
                      label={({ name, percent }: { name: string; percent: number }) =>
                        `${name} (${(percent * 100).toFixed(0)}%)`
                      }
                    >
                      {vibrationAnalysis.map((summaryRecord, idx) => (
                        // Use chartColorVar for cell fill
                        <Cell
                          key={`cell-${idx}`}
                          fill={`hsl(var(--${summaryRecord.chartColorVar}))`}
                        />
                      ))}
                    </Pie>
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent />}
                    />
                    <Legend
                      layout="horizontal"
                      verticalAlign="bottom"
                      align="center"
                      wrapperStyle={{ paddingTop: 20 }}
                      formatter={(key) => {
                        const correspondingMood = moods.find((m) => m.name === key);
                        const MoodIcon = correspondingMood?.icon
                          ? (LucideIcons[correspondingMood.icon as IconKey] as React.ElementType)
                          : null;
                        return (
                          <span className="flex items-center gap-1 text-sm text-foreground">
                            {MoodIcon && <MoodIcon className="h-4 w-4" />}
                            {key}
                          </span>
                        );
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default MoodDashboard;
