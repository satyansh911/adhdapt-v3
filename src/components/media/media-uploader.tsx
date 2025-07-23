"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useJournal } from "@/components/journal/journal-provider";
import { Upload, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast"; //

const MediaUploader: React.FC = () => {
  const { addMediaItem } = useJournal();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    } else {
      setSelectedFile(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", selectedFile);

    const res = await fetch("/api/mySpace/upload", {
      method: "POST",
      body: formData,
    });

    const result = await res.json();

    if (result.success && result.data) {
      // id and createdAt are generated in JournalProvider, so omit them here
      addMediaItem({
        url: result.data.url,
        publicId: result.data.publicId,
        type: result.data.type,
      });
      toast({
        title: "Upload Successful",
        description: `Your ${result.data.type} has been uploaded.`,
      });
    } else {
      toast({
        title: "Upload Failed",
        description: result.error || "Unknown error",
        variant: "destructive",
      });
    }

    setIsUploading(false);
  };

  return (
    <Card className="w-full max-w-md mx-auto border-2 border-[#d04f99] shadow-lg rounded-3xl bg-[#fdedc9]">
      <CardHeader className="pb-4 bg-[#d04f99] text-white rounded-t-3xl shadow">
        <CardTitle className="text-2xl text-white">Upload Media</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-8">
        <div className="grid w-full max-w-sm items-center gap-2">
          <Label
            htmlFor="media-upload"
            className="text-lg text-[#d04f99] font-semibold"
          >
            Image or Video
          </Label>
          <Input
            id="media-upload"
            type="file"
            accept="image/*,video/*"
            onChange={handleFileChange}
            disabled={isUploading}
            className="h-14 text-lg border-2 border-[#d04f99] bg-[#fdedc9] rounded-2xl shadow focus:border-[#d04f99] focus:ring-2 focus:ring-[#d04f99]/30 file:bg-[#d04f99] file:text-white file:rounded-2xl file:px-4 file:py-2 file:font-semibold file:border-0 file:mr-4"
          />
          {selectedFile && (
            <p className="text-sm text-muted-foreground mt-1">
              Selected: {selectedFile.name}
            </p>
          )}
        </div>
        <Button
          onClick={handleUpload}
          disabled={!selectedFile || isUploading}
          className="w-full gap-2 bg-[#d04f99] hover:bg-[#d04f99]/90 text-white h-14 text-lg font-semibold rounded-2xl shadow"
        >
          {isUploading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" /> Uploading...
            </>
          ) : (
            <>
              <Upload className="h-5 w-5" /> Upload
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default MediaUploader;
