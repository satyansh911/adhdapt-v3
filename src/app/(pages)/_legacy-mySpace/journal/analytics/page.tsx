"use client";

import MoodDashboard from "@/components/journal/mood-dashboard";
import { JournalProvider } from "@/components/journal/journal-provider";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <JournalProvider>
      <div className="min-h-screen bg-background text-foreground py-8">
        <header className="container mx-auto flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/">
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Back to Journal</span>
            </Link>
          </Button>
          <h1 className="text-4xl font-bold tracking-tight">
            Mood Analytics Dashboard
          </h1>
        </header>
        <main className="container mx-auto">
          <MoodDashboard />
        </main>
      </div>
    </JournalProvider>
  );
}
