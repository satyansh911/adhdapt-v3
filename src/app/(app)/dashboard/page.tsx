"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { Play, Plus } from "lucide-react";
import { useSupabase } from "@/hooks/use-supabase";
import { listMoods, listTasks, listJournal } from "@/lib/db";

interface ModuleTile {
  href: string;
  title: string;
  sub: string;
  img: string;
  featured?: boolean;
}

const dayKey = (iso: string) => new Date(iso).toISOString().slice(0, 10);

/** Consecutive days (ending today) that have at least one mood check-in. */
function moodStreak(dates: Set<string>): number {
  let streak = 0;
  const d = new Date();
  while (dates.has(d.toISOString().slice(0, 10))) {
    streak++;
    d.setDate(d.getDate() - 1);
  }
  return streak;
}

function relativeDay(iso: string): string {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
  if (days <= 0) return "today";
  if (days === 1) return "yesterday";
  return `${days} days ago`;
}

export default function DashboardPage() {
  const { user } = useUser();
  const supabase = useSupabase();
  const uid = user?.id;
  const [loaded, setLoaded] = useState(false);
  const [streak, setStreak] = useState(0);
  const [subDone, setSubDone] = useState(0);
  const [subTotal, setSubTotal] = useState(0);
  const [nextThing, setNextThing] = useState<{ sub: string; task: string } | null>(null);
  const [modules, setModules] = useState<ModuleTile[]>([]);

  useEffect(() => {
    if (!supabase || !uid) return;
    let cancelled = false;
    (async () => {
      const [moods, tasks, notes] = await Promise.all([
        listMoods(supabase, uid),
        listTasks(supabase, uid),
        listJournal(supabase, uid),
      ]);
      if (cancelled) return;

    const moodDays = new Set(moods.map((m) => dayKey(m.createdAt)));
    setStreak(moodStreak(moodDays));

    const allSubs = tasks.flatMap((t) => t.subtasks);
    setSubTotal(allSubs.length);
    setSubDone(allSubs.filter((s) => s.done).length);

    const nextTask = tasks.find((t) => t.subtasks.some((s) => !s.done));
    const nextSub = nextTask?.subtasks.find((s) => !s.done);
    setNextThing(nextTask && nextSub ? { sub: nextSub.title, task: nextTask.title } : null);

    const openTasks = tasks.filter((t) => t.subtasks.some((s) => !s.done)).length;
    const lastMood = moods[0];
    const lastNote = notes[0];

    setModules([
      { href: "/game", title: "Focus Fest", sub: "3 brain-training games", img: "/home/focus%20fest.png", featured: true },
      { href: "/scheduler", title: "Scheduler", sub: "Plan your day", img: "/home/scheduler.png" },
      { href: "/mood", title: "Mood", sub: lastMood ? `Last check-in ${relativeDay(lastMood.createdAt)}` : "Check in — 20s", img: "/home/mood.png" },
      { href: "/journal", title: "Journal", sub: lastNote ? `Last entry ${relativeDay(lastNote.createdAt)}` : "Start writing", img: "/home/journal.png" },
      { href: "/tasks", title: "Task Breakdown", sub: openTasks ? `${openTasks} task${openTasks > 1 ? "s" : ""} in progress` : "Break down a big task", img: "/home/task%20breakdown.png" },
      { href: "/community", title: "Community", sub: "Join the conversation", img: "/home/community.png" },
    ]);
      setLoaded(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [supabase, uid]);

  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  const firstName = user?.firstName || user?.username || "there";

  return (
    <div className="px-6 py-8 md:px-9">
      {/* Greeting + real stats */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 font-display text-3xl font-extrabold leading-none md:text-[34px]">
            Hey {firstName}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/home/wave.png" alt="wave" className="h-8 w-8 object-contain" />
          </h1>
          <p className="mt-1.5 text-sm font-medium text-[#a09da8]">
            {today} · Let&apos;s make today gentle and doable.
          </p>
        </div>
        <div className="flex gap-3">
          <div className="rounded-2xl border border-white/10 bg-[#FFC107]/[.12] px-4 py-3 text-center">
            <div className="flex items-center justify-center gap-1 text-[22px] font-[900] text-[#F5B000]">
              {loaded ? streak : "—"}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/home/fire.png" alt="streak" className="h-6 w-6 object-contain" />
            </div>
            <div className="text-[10.5px] font-semibold text-[#f0cf7a]">day streak</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-[#2D8EFF]/[.14] px-4 py-3 text-center">
            <div className="text-[22px] font-[900] text-[#2D8EFF]">{loaded ? `${subDone}/${subTotal}` : "—"}</div>
            <div className="text-[10.5px] font-semibold text-[#8fc0ff]">subtasks done</div>
          </div>
        </div>
      </div>

      {/* One next thing — from real task breakdowns */}
      {nextThing ? (
        <div className="mb-6 flex flex-col items-start gap-5 rounded-3xl border-2 border-[#111] bg-[#251f16] p-6 shadow-[5px_5px_0_#ED1C24] sm:flex-row sm:items-center">
          <div className="flex-1">
            <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#ED1C24]">
              Your one next thing
            </span>
            <h3 className="mb-0.5 mt-1.5 text-[22px] font-extrabold">{nextThing.sub}</h3>
            <p className="text-[13px] font-medium text-[#d8c9a0]">from &ldquo;{nextThing.task}&rdquo;</p>
          </div>
          <Link
            href="/tasks"
            className="inline-flex items-center gap-2 rounded-2xl bg-[#ED1C24] px-6 py-3.5 text-sm font-extrabold text-white shadow-[3px_3px_0_#111] transition-transform hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
          >
            <Play className="h-4 w-4" /> Start focus
          </Link>
        </div>
      ) : (
        loaded && (
          <div className="mb-6 flex flex-col items-start gap-4 rounded-3xl border border-dashed border-white/15 bg-[#17171b] p-6 sm:flex-row sm:items-center">
            <div className="flex-1">
              <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#ED1C24]">Your one next thing</span>
              <h3 className="mb-0.5 mt-1.5 text-[20px] font-extrabold">Nothing queued yet</h3>
              <p className="text-[13px] font-medium text-[#a09da8]">Break a big task into tiny steps to get a next action here.</p>
            </div>
            <Link
              href="/tasks"
              className="inline-flex items-center gap-2 rounded-2xl bg-[#ED1C24] px-6 py-3.5 text-sm font-extrabold text-white shadow-[3px_3px_0_#111] transition-transform hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
            >
              <Plus className="h-4 w-4" /> Add a task
            </Link>
          </div>
        )
      )}

      {/* Module grid */}
      <h4 className="mb-3.5 text-[12px] font-bold uppercase tracking-[0.14em] text-[#8b8892]">Jump back in</h4>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(loaded ? modules : []).map(({ href, title, sub, img, featured }) => (
          <Link
            key={href}
            href={href}
            className={
              featured
                ? "rounded-3xl border-2 border-[#111] bg-[#8acfd1] p-5 shadow-[4px_4px_0_#111] transition-transform hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
                : "rounded-3xl border border-white/10 bg-[#17171b] p-5 transition-transform hover:-translate-y-0.5"
            }
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img} alt={title} className="h-10 w-10 object-contain" />
            <h5 className="mb-0.5 mt-3 text-[17px] font-extrabold" style={featured ? { color: "#0d3f41" } : undefined}>
              {title}
            </h5>
            <p className="text-xs font-medium" style={{ color: featured ? "#0d5b5e" : "#8b8892" }}>{sub}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
