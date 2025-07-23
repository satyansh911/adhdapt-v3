"use client";

import type React from "react";
import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useJournal } from "./journal-provider";
import type { JournalEntry } from "@/types/journal";
import { format, parseISO } from "date-fns";
import { Edit, Trash2, Search, Filter, XCircle } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import * as LucideIcons from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Sentinel used when no mood filter is applied
const ALL_MOODS = "all";

interface JournalListProps {
  onEditEntry: (entry: JournalEntry) => void;
  onViewEntry: (entry: JournalEntry) => void;
}

const JournalList: React.FC<JournalListProps> = ({
  onEditEntry,
  onViewEntry,
}) => {
  const {
    entries,
    moods,
    collections,
    deleteEntry,
    getMoodById,
    getCollectionName,
  } = useJournal();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMoodId, setFilterMoodId] = useState<string>(ALL_MOODS);
  const [dateRange, setDateRange] = useState<
    { from?: Date; to?: Date } | undefined
  >(undefined);

  const filteredEntries = useMemo(() => {
    let filtered = entries;

    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (entry) =>
          entry.title.toLowerCase().includes(lowerCaseSearchTerm) ||
          entry.content.toLowerCase().includes(lowerCaseSearchTerm)
      );
    }

    if (filterMoodId !== ALL_MOODS) {
      filtered = filtered.filter((entry) => entry.moodId === filterMoodId);
    }

    if (dateRange?.from) {
      filtered = filtered.filter((entry) => {
        const entryDate = parseISO(entry.createdAt);
        return entryDate >= dateRange.from!;
      });
    }

    if (dateRange?.to) {
      filtered = filtered.filter((entry) => {
        const entryDate = parseISO(entry.createdAt);
        // Add one day to 'to' date to include entries on that day
        const toDatePlusOne = new Date(dateRange.to.getTime());
        toDatePlusOne.setDate(toDatePlusOne.getDate() + 1);
        return entryDate < toDatePlusOne;
      });
    }

    return filtered.sort(
      (a, b) =>
        parseISO(b.createdAt).getTime() - parseISO(a.createdAt).getTime()
    );
  }, [entries, searchTerm, filterMoodId, dateRange]);

  const clearFilters = () => {
    setSearchTerm("");
    setFilterMoodId(ALL_MOODS);
    setDateRange(undefined);
  };

  const hasActiveFilters =
    searchTerm ||
    filterMoodId !== ALL_MOODS ||
    dateRange?.from ||
    dateRange?.to;

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4">
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#d04f99]" />
          <Input
            placeholder="Search entries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 h-14 text-lg bg-[#fdedc9] border-2 border-[#d04f99] rounded-2xl shadow focus:border-[#d04f99] focus:ring-2 focus:ring-[#d04f99]/30 transition-all"
          />
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="flex items-center gap-2 bg-[#fdedc9] border-2 border-[#d04f99] text-[#d04f99] rounded-2xl h-14 px-8 text-lg font-semibold shadow hover:bg-[#d04f99]/10 hover:shadow-lg transition-all"
            >
              <Filter className="h-5 w-5" />
              Filter
              {hasActiveFilters && (
                <span className="ml-1 text-xs font-medium">
                  (
                  {(searchTerm ? 1 : 0) +
                    (filterMoodId !== ALL_MOODS ? 1 : 0) +
                    (dateRange?.from || dateRange?.to ? 1 : 0)}
                  )
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4 space-y-4 rounded-2xl border-2 border-[#d04f99]/20">
            <h4 className="font-medium">Filter Options</h4>
            <div className="space-y-2">
              <label className="text-sm font-medium">Mood</label>
              <Select
                value={filterMoodId}
                onValueChange={(value) => setFilterMoodId(value)}
              >
                <SelectTrigger className="rounded-2xl border-2 border-[#d04f99]/20 focus:border-[#d04f99] h-10">
                  <SelectValue placeholder="Select Mood" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl">
                  <SelectItem value={ALL_MOODS}>All Moods</SelectItem>
                  {moods.map((mood) => (
                    <SelectItem key={mood.id} value={mood.id}>
                      {mood.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Date Range</label>
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={(range) => setDateRange(range ?? undefined)}
                numberOfMonths={1}
              />
            </div>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                onClick={clearFilters}
                className="w-full rounded-2xl"
              >
                <XCircle className="h-4 w-4 mr-2" /> Clear Filters
              </Button>
            )}
          </PopoverContent>
        </Popover>
      </div>

      {filteredEntries.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">
          No journal entries found.
        </p>
      ) : (
        <div className="grid gap-4">
          {filteredEntries.map((entry) => {
            const mood = getMoodById(entry.moodId);
            const collectionName = getCollectionName(entry.collectionId);
            const MoodIcon = mood?.icon
              ? (LucideIcons as any)[mood.icon]
              : null;

            return (
              <Card
                key={entry.id}
                className="relative border shadow-[5px_5px_0px_0px_#d04f99] border-[#d04f99] rounded-3xl bg-[#fdedc9]"
              >
                <CardHeader className="pb-2 bg-[#d04f99] text-white rounded-t-3xl">
                  <CardTitle
                    className="text-xl cursor-pointer hover:underline text-white"
                    onClick={() => onViewEntry(entry)}
                  >
                    {entry.title}
                  </CardTitle>
                  <CardDescription className="flex flex-wrap items-center gap-2 text-sm text-white">
                    <span>{format(parseISO(entry.createdAt), "PPP")}</span>
                    {entry.status === "draft" && (
                      <Badge
                        variant="outline"
                        className="bg-yellow-50 text-yellow-700"
                      >
                        Draft
                      </Badge>
                    )}
                    {mood && (
                      <Badge
                        className={cn("flex items-center gap-1", mood.color)}
                      >
                        {MoodIcon && <MoodIcon className="h-3 w-3" />}
                        {mood.name}
                      </Badge>
                    )}
                    {collectionName && collectionName !== "No Collection" && (
                      <Badge variant="secondary">{collectionName}</Badge>
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div
                    className="prose dark:prose-invert max-w-none line-clamp-3 text-sm text-muted-foreground"
                    dangerouslySetInnerHTML={{
                      __html: entry.content || "No content.",
                    }}
                  />
                  <div className="flex justify-end gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEditEntry(entry)}
                      className="rounded-2xl border-2 border-[#d04f99]/20 hover:bg-[#d04f99]/5 bg-transparent h-10 px-6 text-base font-medium"
                    >
                      <Edit className="h-4 w-4 mr-2" /> Edit
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="rounded-2xl h-10 px-6 text-base font-medium"
                        >
                          <Trash2 className="h-4 w-4 mr-2" /> Delete
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="rounded-2xl">
                        <DialogHeader>
                          <DialogTitle>
                            Are you sure you want to delete this entry?
                          </DialogTitle>
                          <DialogDescription>
                            This action cannot be undone. This will permanently
                            delete your entry "{entry.title}".
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <Button
                            variant="outline"
                            onClick={() => {}}
                            className="rounded-2xl"
                          >
                            Cancel
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={() => deleteEntry(entry.id)}
                            className="rounded-2xl"
                          >
                            Delete
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default JournalList;
