"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Bell, Coffee, Pause, Play, RotateCcw, X, Sparkles } from "lucide-react";
import LottiePlaceholder from "@/components/myspace/LottiePlaceholder";

interface Block {
  id: string;
  time: string;
  title: string;
  detail?: string;
  accent: string; // left border + text
  bg: string;
  reminder?: boolean;
  icon?: "bell" | "coffee";
  open?: boolean;
}

const INITIAL_BLOCKS: Block[] = [
  { id: "b1", time: "9:00", title: "Deep work — report", detail: "90 min · phone on Do Not Disturb", accent: "#2D8EFF", bg: "#eaf3ff", reminder: true, icon: "bell" },
  { id: "b2", time: "11:00", title: "Move & snack break", detail: 'Reminder: "Stretch — you earned it 💛"', accent: "#F5B000", bg: "#fff7e0", icon: "coffee" },
  { id: "b3", time: "14:00", title: "Draft intro email", detail: "Broken into 3 subtasks · 15 min focus", accent: "#ED1C24", bg: "#fde9f3", reminder: true, icon: "bell" },
  { id: "b4", time: "16:30", title: "Open — protect your energy", accent: "#aaa", bg: "#fff", open: true },
];

const WEEK = [
  { d: "MON", n: 14 }, { d: "TUE", n: 15 }, { d: "WED", n: 16 }, { d: "THU", n: 17 },
  { d: "FRI", n: 18 }, { d: "SAT", n: 19, muted: true }, { d: "SUN", n: 20, muted: true },
];

const FOCUS_SECONDS = 25 * 60;

function useCountdown(total: number) {
  const [remaining, setRemaining] = useState(total);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(
      () => setRemaining((r) => (r <= 1 ? (setRunning(false), 0) : r - 1)),
      1000
    );
    return () => clearInterval(id);
  }, [running]);

  const reset = () => {
    setRunning(false);
    setRemaining(total);
  };
  return { remaining, running, toggle: () => setRunning((v) => !v), reset };
}

const fmt = (s: number) =>
  `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

export default function SchedulerPage() {
  const { remaining, running, toggle, reset } = useCountdown(FOCUS_SECONDS);
  const [blocks, setBlocks] = useState<Block[]>(INITIAL_BLOCKS);
  const [aiOpen, setAiOpen] = useState(true);
  const [selectedDay, setSelectedDay] = useState(15);

  const addBlock = () => {
    const id = `b${Date.now()}`;
    setBlocks((prev) => [
      ...prev.filter((b) => !b.open),
      { id, time: "17:00", title: "New block", detail: "Tap to edit later", accent: "#8acfd1", bg: "#effbfb" },
    ]);
  };

  // Stubbed "AI" — no real model call; just a canned gentle reorder suggestion.
  const applyAiSuggestion = () => {
    setBlocks((prev) =>
      prev.map((b) =>
        b.id === "b3" ? { ...b, time: "10:00", detail: "Moved earlier — you focus best before noon" } : b
      )
    );
    setAiOpen(false);
  };

  const progress = useMemo(() => 1 - remaining / FOCUS_SECONDS, [remaining]);

  return (
    <div className="flex flex-col gap-5 px-5 py-6 lg:flex-row lg:gap-6 lg:px-7 lg:py-7">
      {/* Left: calendar + timeline */}
      <section className="min-w-0 flex-1">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="font-display text-[30px] font-extrabold leading-none">This week</h1>
          <button
            onClick={addBlock}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#111] px-3.5 py-2 text-xs font-extrabold text-white"
          >
            <Plus className="h-3.5 w-3.5" /> Add block
          </button>
        </div>

        <div className="mb-5 grid grid-cols-7 gap-2">
          {WEEK.map(({ d, n, muted }) => {
            const active = n === selectedDay;
            return (
              <button
                key={d}
                onClick={() => setSelectedDay(n)}
                className={
                  active
                    ? "rounded-2xl border-2 border-[#111] bg-[#ED1C24] py-3 text-center shadow-[3px_3px_0_#111]"
                    : "rounded-2xl border border-white/10 bg-[#17171b] py-3 text-center"
                }
              >
                <div className={`text-[10px] font-semibold ${active ? "text-[#ffd9ee]" : "text-[#8b8892]"}`}>{d}</div>
                <div className={`text-base font-extrabold ${active ? "text-white" : muted ? "text-[#6a6774]" : "text-[#d9d7df]"}`}>{n}</div>
              </button>
            );
          })}
        </div>

        <h4 className="mb-3 text-[12px] font-bold uppercase tracking-[0.12em] text-[#8b8892]">Timeline</h4>
        <div className="flex flex-col gap-2.5">
          {blocks.map((b) => (
            <div
              key={b.id}
              className={`flex items-center gap-3.5 rounded-2xl px-4 py-3.5 ${b.open ? "border border-dashed border-white/15" : ""}`}
              style={{ background: b.bg, borderLeft: b.open ? undefined : `5px solid ${b.accent}` }}
            >
              <span className="w-[52px] text-[13px] font-extrabold" style={{ color: b.accent }}>{b.time}</span>
              <div className="flex-1">
                <div className={`text-[15px] font-extrabold ${b.open ? "text-[#7c7986]" : ""}`}>{b.title}</div>
                {b.detail && <div className="text-xs font-medium" style={{ color: b.accent }}>{b.detail}</div>}
              </div>
              {b.icon === "bell" && <Bell className="h-[18px] w-[18px]" style={{ color: b.accent }} />}
              {b.icon === "coffee" && <Coffee className="h-[18px] w-[18px]" style={{ color: b.accent }} />}
            </div>
          ))}
        </div>
      </section>

      {/* Right rail */}
      <aside className="flex w-full flex-shrink-0 flex-col gap-4 lg:w-[280px]">
        {/* Focus timer (squircle) */}
        <div className="rounded-3xl border-2 border-[#111] bg-[#251f16] p-6 text-center shadow-[5px_5px_0_#ED1C24]">
          <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#ED1C24]">Focus timer</span>
          <div className="relative mx-auto my-4 h-[150px] w-[150px]">
            <div className="absolute inset-0 flex flex-col items-center justify-center rounded-[44px] border-[3px] border-[#111] bg-[#17171b]">
              <div className="text-[40px] font-[900] leading-none text-[#ececf0]">{fmt(remaining)}</div>
              <div className="mt-1 text-[11px] font-semibold text-[#9a97a3]">of 25:00</div>
            </div>
            <div className="absolute -right-1.5 -top-1.5 rounded-[10px] border-2 border-[#111] bg-[#8acfd1] px-2 py-0.5 text-[10px] font-extrabold">
              {progress > 0.5 ? "Sprint 3" : "Sprint 2"}
            </div>
          </div>
          <div className="flex justify-center gap-2.5">
            <button
              onClick={toggle}
              className="flex h-11 w-11 items-center justify-center rounded-2xl border-2 border-[#111] bg-[#8acfd1]"
              aria-label={running ? "Pause" : "Play"}
            >
              {running ? <Pause className="h-[18px] w-[18px]" /> : <Play className="h-[18px] w-[18px]" />}
            </button>
            <button
              onClick={reset}
              className="flex h-11 w-11 items-center justify-center rounded-2xl border-2 border-[#111] bg-[#17171b]"
              aria-label="Reset"
            >
              <RotateCcw className="h-[18px] w-[18px]" />
            </button>
          </div>
        </div>

        {/* AI suggestion panel (stub) */}
        {aiOpen && (
          <div className="relative rounded-3xl border-2 border-[#111] bg-[#8acfd1] p-[18px] shadow-[5px_5px_0_#111]">
            <button onClick={() => setAiOpen(false)} className="absolute right-3.5 top-3.5" aria-label="Dismiss">
              <X className="h-4 w-4 text-[#0d3f41]" />
            </button>
            <div className="mb-2.5 flex items-center gap-2">
              <LottiePlaceholder name="ai-spark" className="h-[34px] w-[34px] border-[#0d5b5e]" />
              <span className="flex items-center gap-1 text-[13px] font-extrabold text-[#0d3f41]">
                <Sparkles className="h-3.5 w-3.5" /> AI suggestion · optional
              </span>
            </div>
            <p className="mb-3.5 text-[13px] font-semibold leading-[1.55] text-[#0d3f41]">
              &ldquo;You focus best before noon. Want me to move <b>Draft email</b> to 10:00 and keep the afternoon light?&rdquo;
            </p>
            <div className="flex gap-2.5">
              <button onClick={applyAiSuggestion} className="rounded-xl bg-[#0d5b5e] px-4 py-2.5 text-xs font-extrabold text-white">
                Yes, do it
              </button>
              <button onClick={() => setAiOpen(false)} className="rounded-xl bg-white/60 px-4 py-2.5 text-xs font-extrabold text-[#0d5b5e]">
                Not now
              </button>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
