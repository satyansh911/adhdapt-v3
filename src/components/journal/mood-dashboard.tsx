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

// Custom Y-Axis Tick component to render Lucide icons and text
const CustomYAxisTick = ({ x, y, payload, moods }: any) => {
  // Recharts sometimes sends an empty tick; skip it.
  if (!payload || payload.value === undefined) return null;

  const mood = moods?.find((m: any) => m.name === payload.value);
  const IconComponent = mood?.icon ? (LucideIcons as any)[mood.icon] : null;
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
            xmlns="http://www.w3.org/1999/xhtml"
            className="flex items-center justify-end h-full"
          >
            <IconComponent className="h-4 w-4 text-muted-foreground" />
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

  const moodData = useMemo(() => {
    const counts: { [key: string]: number } = {};
    entries.forEach((entry) => {
      if (entry.moodId) {
        counts[entry.moodId] = (counts[entry.moodId] || 0) + 1;
      }
    });

    // Map moods to chart data, assigning a chart color variable based on index
    const chartColors = [
      "chart-1",
      "chart-2",
      "chart-3",
      "chart-4",
      "chart-5",
      "chart-6",
      "chart-7",
    ];

    return moods
      .map((mood, index) => ({
        name: mood.name,
        count: counts[mood.id] || 0,
        colorClass: mood.color.split(" ")[0].replace("bg-", ""), // e.g., "green-100"
        chartColorVar: chartColors[index % chartColors.length], // Assign a chart color variable
        id: mood.id,
        icon: mood.icon,
      }))
      .filter((m) => m.count > 0) // Only show moods with entries
      .sort((a, b) => b.count - a.count); // Sort by count descending
  }, [entries, moods]);

  const totalEntries = entries.length;

  // Dynamically create chart config for ChartContainer
  const chartConfig = useMemo(() => {
    return moodData.reduce((acc, mood) => {
      acc[mood.name] = {
        label: mood.name,
        color: `hsl(var(--${mood.chartColorVar}))`, // Use assigned chart color variable
      };
      return acc;
    }, {} as any);
  }, [moodData]);

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Mood Analytics</CardTitle>
        <CardDescription>Insights into your emotional trends.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-8">
        {totalEntries === 0 ? (
          <p className="text-center text-muted-foreground py-8 text-lg">
            No entries yet to analyze moods. Start writing!
          </p>
        ) : (
          <>
            <div className="h-[250px] w-full">
              <h3 className="text-lg font-semibold mb-4">Entries per Mood</h3>
              <ChartContainer config={chartConfig} className="w-full h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={moodData}
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
              <ChartContainer config={chartConfig} className="w-full h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={moodData}
                      dataKey="count"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name} (${(percent * 100).toFixed(0)}%)`
                      }
                    >
                      {moodData.map((entry, index) => (
                        // Use chartColorVar for cell fill
                        <Cell
                          key={`cell-${index}`}
                          fill={`hsl(var(--${entry.chartColorVar}))`}
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
                      formatter={(value) => {
                        const mood = moods.find((m) => m.name === value);
                        const Icon = mood?.icon
                          ? (LucideIcons as any)[mood.icon]
                          : null;
                        return (
                          <span className="flex items-center gap-1 text-sm text-foreground">
                            {Icon && <Icon className="h-4 w-4" />}
                            {value}
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
