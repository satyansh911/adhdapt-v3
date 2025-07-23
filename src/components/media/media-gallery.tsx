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
import { useJournal } from "@/components/journal/journal-provider";
import { format, parseISO } from "date-fns";
import { ImageIcon, Video } from "lucide-react";

const MediaGallery: React.FC = () => {
  const { mediaItems } = useJournal();

  const groupedMedia = useMemo(() => {
    const groups: { [date: string]: typeof mediaItems } = {};
    mediaItems.forEach((item) => {
      const dateKey = format(parseISO(item.createdAt), "yyyy-MM-dd");
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(item);
    });

    // Sort dates in descending order
    return Object.entries(groups).sort(([dateA], [dateB]) =>
      dateB.localeCompare(dateA)
    );
  }, [mediaItems]);

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Media Gallery</CardTitle>
        <CardDescription>
          All your uploaded images and videos, organized by date.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {mediaItems.length === 0 ? (
          <p className="text-center text-muted-foreground py-8 text-lg">
            No media uploaded yet. Use the "Upload Media" section to add some!
          </p>
        ) : (
          groupedMedia.map(([date, items]) => (
            <div key={date} className="space-y-4">
              <h3 className="text-xl font-semibold border-b pb-2">
                {format(parseISO(date), "PPP")}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="relative aspect-square rounded-md overflow-hidden group"
                  >
                    {item.type === "image" ? (
                      <img
                        src={item.url || "/placeholder.svg"}
                        alt={`Uploaded image from ${format(
                          parseISO(item.createdAt),
                          "PPP"
                        )}`}
                        className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                      />
                    ) : (
                      <video
                        src={item.url}
                        controls
                        className="w-full h-full object-cover bg-black transition-transform duration-200 group-hover:scale-105"
                      >
                        Your browser does not support the video tag.
                      </video>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-2 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      {item.type === "image" ? (
                        <ImageIcon className="h-4 w-4 mr-1" />
                      ) : (
                        <Video className="h-4 w-4 mr-1" />
                      )}
                      <span className="text-xs truncate">
                        {item.publicId.split("/").pop()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default MediaGallery;
