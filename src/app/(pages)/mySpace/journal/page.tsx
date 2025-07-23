"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, LinkIcon, X, Edit } from "lucide-react";
import { JournalProvider } from "@/components/journal/journal-provider";
import JournalList from "@/components/journal/journal-list";
import JournalEditor from "@/components/journal/journal-editor";
import CollectionManager from "@/components/journal/collection-manager";
import MediaUploader from "@/components/media/media-uploader";
import MediaGallery from "@/components/media/media-gallery";
import type { JournalEntry } from "@/types/journal";
import { Toaster } from "@/components/ui/toaster";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import RichTextEditor from "@/components/journal/rich-text-editor"; // Import RichTextEditor for viewing

export default function JournalPage() {
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);
  const [viewingEntry, setViewingEntry] = useState<JournalEntry | null>(null);
  const [showEditor, setShowEditor] = useState(false);

  const handleNewEntry = () => {
    setEditingEntry(null);
    setViewingEntry(null);
    setShowEditor(true);
  };

  const handleEditEntry = (entry: JournalEntry) => {
    setEditingEntry(entry);
    setViewingEntry(null);
    setShowEditor(true);
  };

  const handleViewEntry = (entry: JournalEntry) => {
    setViewingEntry(entry);
    setEditingEntry(null);
    setShowEditor(false); // Ensure editor is not shown in edit mode
  };

  const handleEditorSave = () => {
    setShowEditor(false);
    setEditingEntry(null);
    setViewingEntry(null); // Clear viewing entry after save
  };

  const handleEditorCancel = () => {
    setShowEditor(false);
    setEditingEntry(null);
    setViewingEntry(null);
  };

  return (
    <JournalProvider>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
        <header className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 max-w-4xl px-4 pt-8">
          <h1 className="text-4xl font-bold tracking-tight">My Journal</h1>
          <div className="flex gap-2">
            <Button
              onClick={handleNewEntry}
              className="gap-2 bg-[#d04f99] hover:bg-[#d04f99]/90 text-white rounded-2xl h-12 px-8 text-base font-medium"
            >
              <Plus className="h-5 w-5" /> New Entry
            </Button>
            <Button
              variant="outline"
              asChild
              className="rounded-2xl border-2 border-[#d04f99]/20 hover:bg-[#d04f99]/5 h-12 px-8 text-base font-medium"
            >
              <Link href="mySpace/journal/analytics" className="gap-2">
                <LinkIcon className="h-5 w-5" /> Analytics
              </Link>
            </Button>
          </div>
        </header>

        <main className="container mx-auto max-w-4xl px-4 pb-8">
          <Tabs defaultValue="journal" className="w-full">
            <TabsList className="grid w-full grid-cols-3 md:grid-cols-4 rounded-2xl border-2 border-[#d04f99]/20 mb-6">
              <TabsTrigger value="journal">Journal Entries</TabsTrigger>
              <TabsTrigger value="media">Media Gallery</TabsTrigger>
              <TabsTrigger value="collections">Collections</TabsTrigger>
              <TabsTrigger
                value="analytics-link"
                className="hidden md:inline-flex"
                asChild
              >
                <Link href="/analytics">Analytics</Link>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="journal" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                  {showEditor && (
                    <JournalEditor
                      entryToEdit={editingEntry}
                      onSave={handleEditorSave}
                      onCancel={handleEditorCancel}
                    />
                  )}

                  {viewingEntry && !showEditor && (
                    <Card className="w-full max-w-3xl mx-auto border shadow-[5px_5px_0px_0px_#d04f99] border-[#d04f99] rounded-3xl bg-[#fdedc9]">
                      <CardContent className="p-8 space-y-4">
                        <div className="flex justify-between items-start">
                          <h2 className="text-2xl font-bold text-[#d04f99]">
                            {viewingEntry.title}
                          </h2>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setViewingEntry(null)}
                            className="text-[#d04f99] hover:bg-[#d04f99]/10 rounded-2xl"
                          >
                            <X className="h-5 w-5" />
                            <span className="sr-only">Close view</span>
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Created:{" "}
                          {new Date(viewingEntry.createdAt).toLocaleString()}
                          {viewingEntry.updatedAt !==
                            viewingEntry.createdAt && (
                            <span>
                              {" "}
                              | Last Updated:{" "}
                              {new Date(
                                viewingEntry.updatedAt
                              ).toLocaleString()}
                            </span>
                          )}
                          {viewingEntry.status === "published" &&
                            viewingEntry.publishedAt && (
                              <span>
                                {" "}
                                | Published:{" "}
                                {new Date(
                                  viewingEntry.publishedAt
                                ).toLocaleString()}
                              </span>
                            )}
                        </p>
                        {/* Use RichTextEditor in read-only mode for viewing */}
                        <RichTextEditor
                          initialContent={viewingEntry.content}
                          onContentChange={() => {}}
                          editable={false}
                        />
                        <div className="flex justify-end">
                          <Button
                            onClick={() => handleEditEntry(viewingEntry)}
                            className="bg-[#d04f99] hover:bg-[#d04f99]/90 text-white rounded-2xl h-12 px-8 text-base font-medium"
                          >
                            <Edit className="h-4 w-4 mr-2" /> Edit Entry
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {!showEditor && !viewingEntry && (
                    <JournalList
                      onEditEntry={handleEditEntry}
                      onViewEntry={handleViewEntry}
                    />
                  )}
                </div>
                <aside className="lg:col-span-1 space-y-8">
                  <MediaUploader /> {/* Moved here for easy access */}
                </aside>
              </div>
            </TabsContent>

            <TabsContent value="media" className="mt-6">
              <MediaGallery />
            </TabsContent>

            <TabsContent value="collections" className="mt-6">
              <CollectionManager />
            </TabsContent>
          </Tabs>
        </main>
      </div>
      <Toaster />
    </JournalProvider>
  );
}
