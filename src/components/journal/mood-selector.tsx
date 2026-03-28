"use client";

import type React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useJournal } from "./journal-provider";
import * as LucideIcons from "lucide-react";
import { cn } from "@/lib/utils";
import type { IconKey } from "@/types/journal";

interface MoodSelectorProps {
  selectedMoodId: string | null;
  onSelectMood: (moodId: string | null) => void;
}

const MoodSelector: React.FC<MoodSelectorProps> = ({
  selectedMoodId,
  onSelectMood,
}) => {
  const { moods } = useJournal();
  const activeEmotionalState = moods.find((m) => m.id === selectedMoodId);

  const IconComponent = activeEmotionalState?.icon
    ? (LucideIcons[activeEmotionalState.icon as IconKey] as React.ElementType)
    : null;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-start text-left font-normal bg-transparent"
        >
          {activeEmotionalState ? (
            <div className="flex items-center gap-2">
              {IconComponent && <IconComponent className="h-4 w-4" />}
              <span className={cn(activeEmotionalState.color.split(" ")[1])}>
                {activeEmotionalState.name}
              </span>
            </div>
          ) : (
            <span>Select Vibe</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-2">
        <div className="grid grid-cols-2 gap-2">
          {moods.map((mood) => {
            const VibeGlyph = mood.icon ? (LucideIcons[mood.icon as IconKey] as React.ElementType) : null;
            return (
              <Badge
                key={mood.id}
                className={cn(
                  "cursor-pointer flex items-center justify-center gap-1 py-1 px-2",
                  mood.color,
                  selectedMoodId === mood.id
                    ? "ring-2 ring-offset-2 ring-primary"
                    : ""
                )}
                onClick={() => onSelectMood(mood.id)}
              >
                {VibeGlyph && <VibeGlyph className="h-4 w-4" />}
                {mood.name}
              </Badge>
            );
          })}
          <Badge
            className={cn(
              "cursor-pointer flex items-center justify-center gap-1 py-1 px-2 bg-muted text-muted-foreground",
              selectedMoodId === null ? "ring-2 ring-offset-2 ring-primary" : ""
            )}
            onClick={() => onSelectMood(null)}
          >
            Clear Vibe
          </Badge>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default MoodSelector;
