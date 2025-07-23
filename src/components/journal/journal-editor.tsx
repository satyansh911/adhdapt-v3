"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import dynamic from "next/dynamic";
const RichTextEditor = dynamic(() => import("./rich-text-editor"), {
  ssr: false,
});
import MoodSelector from "./mood-selector";
import CollectionSelector from "./collection-selector";
import { useJournal } from "./journal-provider";
import type { JournalEntry } from "@/types/journal";
import { toast } from "@/hooks/use-toast";
import { X } from "lucide-react";

interface JournalEditorProps {
  entryToEdit?: JournalEntry | null;
  onSave: () => void;
  onCancel: () => void;
}

const JournalEditor: React.FC<JournalEditorProps> = ({
  entryToEdit,
  onSave,
  onCancel,
}) => {
  const { addEntry, updateEntry } = useJournal();
  const [title, setTitle] = useState(entryToEdit?.title || "");
  const [content, setContent] = useState(entryToEdit?.content || "");
  const [selectedMoodId, setSelectedMoodId] = useState<string | null>(
    entryToEdit?.moodId || null
  );
  const [selectedCollectionId, setSelectedCollectionId] = useState<
    string | null
  >(entryToEdit?.collectionId || null);

  useEffect(() => {
    if (entryToEdit) {
      setTitle(entryToEdit.title);
      setContent(entryToEdit.content);
      setSelectedMoodId(entryToEdit.moodId);
      setSelectedCollectionId(entryToEdit.collectionId);
    } else {
      setTitle("");
      setContent("");
      setSelectedMoodId(null);
      setSelectedCollectionId(null);
    }
  }, [entryToEdit]);

  const handleSave = (status: "draft" | "published") => {
    if (!title.trim()) {
      toast({
        title: "Title is required",
        description: "Please enter a title for your journal entry.",
        variant: "destructive",
      });
      return;
    }

    if (entryToEdit) {
      updateEntry(entryToEdit.id, {
        title,
        content,
        moodId: selectedMoodId,
        collectionId: selectedCollectionId,
        status,
      });
      toast({
        title: "Entry Updated!",
        description: `Your entry has been ${status}.`,
      });
    } else {
      addEntry({
        title,
        content,
        moodId: selectedMoodId,
        collectionId: selectedCollectionId,
        status,
      });
      toast({
        title: "New Entry Created!",
        description: `Your entry has been ${status}.`,
      });
    }
    onSave();
  };

  return (
    <Card className="w-full max-w-3xl mx-auto border-2 border-[#d04f99] shadow-lg rounded-3xl bg-[#fdedc9]">
      <CardHeader className="bg-[#d04f99] text-white rounded-t-3xl flex flex-row items-center justify-between pb-4 shadow">
        <CardTitle className="text-2xl text-white">
          {entryToEdit ? "Edit Journal Entry" : "New Journal Entry"}
        </CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={onCancel}
          className="text-white hover:bg-[#d04f99]/20 rounded-2xl"
        >
          <X className="h-5 w-5" />
          <span className="sr-only">Close editor</span>
        </Button>
      </CardHeader>
      <CardContent className="space-y-6 p-8">
        <Input
          placeholder="Entry Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-lg font-semibold h-14 border-2 border-[#d04f99] bg-[#fdedc9] rounded-2xl shadow focus:border-[#d04f99] focus:ring-2 focus:ring-[#d04f99]/30"
        />
        <RichTextEditor initialContent={content} onContentChange={setContent} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <MoodSelector
            selectedMoodId={selectedMoodId}
            onSelectMood={setSelectedMoodId}
          />
          <CollectionSelector
            selectedCollectionId={selectedCollectionId}
            onSelectCollection={setSelectedCollectionId}
          />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button
            variant="outline"
            onClick={() => handleSave("draft")}
            className="rounded-2xl border-2 border-[#d04f99] bg-white text-[#d04f99] h-12 px-8 text-lg font-semibold shadow hover:bg-[#d04f99]/10"
          >
            Save Draft
          </Button>
          <Button
            onClick={() => handleSave("published")}
            className="bg-[#d04f99] hover:bg-[#d04f99]/90 text-white h-12 px-8 text-lg font-semibold rounded-2xl shadow"
          >
            Publish Entry
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default JournalEditor;
