"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Plus,
  Play,
  Pause,
  RotateCcw,
  X,
  Check,
  ChevronUp,
  ChevronDown,
  Trash2,
  Loader2,
  CalendarDays,
} from "lucide-react";
import {
  getSchedule,
  saveSchedule,
  type ScheduleBlock,
} from "@/lib/myspace-storage";

const ACCENTS = ["#2D8EFF", "#F5B000", "#ED1C24", "#8acfd1", "#8fc0ff", "#0d5b5e"];
const uid = () => Math.random().toString(36).slice(2, 9);
const dateKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

const DAY_LABELS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

/** The Mon–Sun week containing `base`. */
function getWeek(base: Date) {
  const day = base.getDay(); // 0 Sun … 6 Sat
  const monday = new Date(base);
  monday.setDate(base.getDate() + (day === 0 ? -6 : 1 - day));
  return DAY_LABELS.map((label, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return { label, key: dateKey(d), n: d.getDate(), weekend: i > 4 };
  });
}

// ---------------- Focus timer ----------------
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
  return {
    remaining,
    running,
    toggle: () => setRunning((v) => !v),
    reset: () => {
      setRunning(false);
      setRemaining(total);
    },
  };
}
const fmt = (s: number) =>
  `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

interface Suggestion {
  message: string;
  blocks: { title: string; time: string }[];
}

export default function SchedulerPage() {
  const { remaining, running, toggle, reset } = useCountdown(FOCUS_SECONDS);
  const progress = useMemo(() => 1 - remaining / FOCUS_SECONDS, [remaining]);

  const todayKey = useMemo(() => dateKey(new Date()), []);
  const week = useMemo(() => getWeek(new Date()), []);
  const [selected, setSelected] = useState(todayKey);
  const [blocks, setBlocks] = useState<ScheduleBlock[]>([]);

  const isPast = selected < todayKey;
  const editable = !isPast;

  // Load blocks for the selected day.
  useEffect(() => {
    setBlocks(getSchedule(selected));
  }, [selected]);

  const persist = useCallback(
    (next: ScheduleBlock[]) => {
      setBlocks(next);
      saveSchedule(selected, next);
    },
    [selected]
  );

  const addBlock = () =>
    persist([
      ...blocks,
      { id: uid(), time: "09:00", title: "", done: false, accent: ACCENTS[blocks.length % ACCENTS.length] },
    ]);
  const update = (id: string, patch: Partial<ScheduleBlock>) =>
    persist(blocks.map((b) => (b.id === id ? { ...b, ...patch } : b)));
  const remove = (id: string) => persist(blocks.filter((b) => b.id !== id));
  const move = (id: string, dir: -1 | 1) => {
    const i = blocks.findIndex((b) => b.id === id);
    const j = i + dir;
    if (i < 0 || j < 0 || j >= blocks.length) return;
    const next = [...blocks];
    [next[i], next[j]] = [next[j], next[i]];
    persist(next);
  };

  // ---------------- Real AI suggestion ----------------
  const [aiOpen, setAiOpen] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [suggestion, setSuggestion] = useState<Suggestion | null>(null);

  const askAi = async () => {
    setAiOpen(true);
    setAiLoading(true);
    setAiError(null);
    setSuggestion(null);
    try {
      const res = await fetch("/api/scheduler/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          blocks: blocks.map((b) => ({ time: b.time, title: b.title || "Untitled" })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "AI request failed");
      setSuggestion(data as Suggestion);
    } catch (err) {
      setAiError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setAiLoading(false);
    }
  };

  const applySuggestion = () => {
    if (!suggestion) return;
    const used = new Set<string>();
    const reordered: ScheduleBlock[] = [];
    for (const s of suggestion.blocks) {
      const match = blocks.find(
        (b) => !used.has(b.id) && b.title.trim().toLowerCase() === s.title.trim().toLowerCase()
      );
      if (match) {
        used.add(match.id);
        reordered.push({ ...match, time: s.time });
      }
    }
    const rest = blocks.filter((b) => !used.has(b.id));
    persist([...reordered, ...rest]);
    setAiOpen(false);
    setSuggestion(null);
  };

  const selectedLabel = week.find((w) => w.key === selected);

  return (
    <div className="flex flex-col gap-5 px-5 py-6 lg:flex-row lg:gap-6 lg:px-7 lg:py-7">
      {/* Left: calendar + timeline */}
      <section className="min-w-0 flex-1">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="font-display text-[30px] font-extrabold leading-none">This week</h1>
          {editable && (
            <button
              onClick={addBlock}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#ED1C24] px-3.5 py-2 text-xs font-extrabold text-white"
            >
              <Plus className="h-3.5 w-3.5" /> Add block
            </button>
          )}
        </div>

        {/* Week strip */}
        <div className="mb-5 grid grid-cols-7 gap-2">
          {week.map(({ label, key, n, weekend }) => {
            const active = key === selected;
            const past = key < todayKey;
            const today = key === todayKey;
            return (
              <button
                key={key}
                onClick={() => setSelected(key)}
                className={
                  active
                    ? "rounded-2xl border-2 border-[#111] bg-[#ED1C24] py-3 text-center shadow-[3px_3px_0_#111]"
                    : `rounded-2xl border py-3 text-center ${today ? "border-[#ED1C24]/50 bg-[#17171b]" : "border-white/10 bg-[#17171b]"}`
                }
              >
                <div className={`text-[10px] font-semibold ${active ? "text-[#ffd9ee]" : "text-[#8b8892]"}`}>{label}</div>
                <div
                  className={`text-base font-extrabold ${
                    active ? "text-white" : past ? "text-[#6a6774]" : weekend ? "text-[#8b8892]" : "text-[#d9d7df]"
                  }`}
                >
                  {n}
                </div>
              </button>
            );
          })}
        </div>

        <div className="mb-3 flex items-center gap-2">
          <h4 className="text-[12px] font-bold uppercase tracking-[0.12em] text-[#8b8892]">Timeline</h4>
          {isPast && (
            <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] font-bold text-[#8b8892]">
              Past day · read-only
            </span>
          )}
        </div>

        {/* Blocks */}
        <div className="flex flex-col gap-2.5">
          {blocks.length === 0 && (
            <div className="flex items-center gap-3 rounded-2xl border border-dashed border-white/15 bg-[#17171b] px-5 py-8 text-sm text-[#8b8892]">
              <CalendarDays className="h-5 w-5" />
              {isPast
                ? "Nothing was scheduled on this day."
                : editable
                ? "No blocks yet — add one to plan your day."
                : "Nothing here yet."}
            </div>
          )}

          {blocks.map((b, i) => (
            <div
              key={b.id}
              className="flex items-center gap-3 rounded-2xl border border-white/5 px-3 py-3"
              style={{ background: `${b.accent}22`, borderLeft: `5px solid ${b.accent}` }}
            >
              {editable ? (
                <>
                  {/* Time */}
                  <input
                    type="time"
                    value={b.time}
                    onChange={(e) => update(b.id, { time: e.target.value })}
                    className="w-[92px] flex-shrink-0 rounded-lg bg-[#080808] px-2 py-1.5 text-[13px] font-bold outline-none [color-scheme:dark]"
                    style={{ color: b.accent }}
                  />
                  {/* Title */}
                  <input
                    value={b.title}
                    onChange={(e) => update(b.id, { title: e.target.value })}
                    placeholder="What's this block?"
                    className={`min-w-0 flex-1 bg-transparent text-[15px] font-extrabold outline-none placeholder:text-[#6a6774] ${
                      b.done ? "text-[#7c7986] line-through" : "text-[#ececf0]"
                    }`}
                  />
                  {/* Controls */}
                  <div className="flex flex-shrink-0 items-center gap-1">
                    <button
                      onClick={() => update(b.id, { done: !b.done })}
                      className={`flex h-7 w-7 items-center justify-center rounded-lg border-2 ${
                        b.done ? "border-[#2ec16e] bg-[#2ec16e] text-white" : "border-white/20 text-transparent hover:border-white/40"
                      }`}
                      title="Mark done"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => move(b.id, -1)}
                      disabled={i === 0}
                      className="flex h-7 w-7 items-center justify-center rounded-lg text-[#8b8892] hover:bg-white/5 disabled:opacity-25"
                      title="Move up"
                    >
                      <ChevronUp className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => move(b.id, 1)}
                      disabled={i === blocks.length - 1}
                      className="flex h-7 w-7 items-center justify-center rounded-lg text-[#8b8892] hover:bg-white/5 disabled:opacity-25"
                      title="Move down"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => remove(b.id)}
                      className="flex h-7 w-7 items-center justify-center rounded-lg text-[#8b8892] hover:bg-[#ED1C24] hover:text-white"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <span className="w-[52px] flex-shrink-0 text-[13px] font-extrabold" style={{ color: b.accent }}>
                    {b.time}
                  </span>
                  <span className={`min-w-0 flex-1 text-[15px] font-extrabold ${b.done ? "text-[#7c7986] line-through" : "text-[#ececf0]"}`}>
                    {b.title || "Untitled"}
                  </span>
                  <span
                    className={`flex-shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold ${
                      b.done ? "bg-[#2ec16e]/15 text-[#2ec16e]" : "bg-[#ED1C24]/15 text-[#ff9a9a]"
                    }`}
                  >
                    {b.done ? "Completed" : "Missed"}
                  </span>
                </>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Right rail */}
      <aside className="flex w-full flex-shrink-0 flex-col gap-4 lg:w-[280px]">
        {/* Focus timer (no red shadow) */}
        <div className="rounded-3xl border-2 border-[#111] bg-[#251f16] p-6 text-center">
          <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#ED1C24]">Focus timer</span>
          <div className="relative mx-auto my-4 h-[150px] w-[150px]">
            <div className="absolute inset-0 flex flex-col items-center justify-center rounded-[44px] border-[3px] border-[#111] bg-[#17171b]">
              <div className="text-[40px] font-[900] leading-none text-[#ececf0]">{fmt(remaining)}</div>
              <div className="mt-1 text-[11px] font-semibold text-[#9a97a3]">of 25:00</div>
            </div>
            <div className="absolute -right-1.5 -top-1.5 rounded-[10px] border-2 border-[#111] bg-[#8acfd1] px-2 py-0.5 text-[10px] font-extrabold text-[#111]">
              {progress > 0.5 ? "Sprint 3" : "Sprint 2"}
            </div>
          </div>
          <div className="flex justify-center gap-2.5">
            <button
              onClick={toggle}
              className="flex h-11 w-11 items-center justify-center rounded-2xl border-2 border-[#111] bg-[#8acfd1] text-[#111]"
              aria-label={running ? "Pause" : "Play"}
            >
              {running ? <Pause className="h-[18px] w-[18px]" /> : <Play className="h-[18px] w-[18px]" />}
            </button>
            <button
              onClick={reset}
              className="flex h-11 w-11 items-center justify-center rounded-2xl border-2 border-[#111] bg-[#17171b] text-[#ececf0]"
              aria-label="Reset"
            >
              <RotateCcw className="h-[18px] w-[18px]" />
            </button>
          </div>
        </div>

        {/* Real AI suggestion */}
        {editable && (
          <div className="rounded-3xl border-2 border-[#111] bg-[#8acfd1] p-[18px] shadow-[5px_5px_0_#111]">
            <div className="mb-2.5 flex items-center justify-between">
              <span className="flex items-center gap-2 text-[13px] font-extrabold text-[#0d3f41]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/home/ai.png" alt="" className="h-6 w-6 object-contain" />
                AI suggestion · optional
              </span>
              {aiOpen && (
                <button onClick={() => setAiOpen(false)} aria-label="Dismiss">
                  <X className="h-4 w-4 text-[#0d3f41]" />
                </button>
              )}
            </div>

            {!aiOpen ? (
              <>
                <p className="mb-3.5 text-[13px] font-semibold leading-[1.55] text-[#0d3f41]">
                  Let a kind AI coach reshuffle {selectedLabel ? `${selectedLabel.label}'s` : "your"} plan for gentler focus.
                </p>
                <button
                  onClick={askAi}
                  disabled={blocks.length === 0}
                  className="rounded-xl bg-[#0d5b5e] px-4 py-2.5 text-xs font-extrabold text-white disabled:opacity-50"
                >
                  {blocks.length === 0 ? "Add blocks first" : "Get a suggestion"}
                </button>
              </>
            ) : aiLoading ? (
              <div className="flex items-center gap-2 py-2 text-[13px] font-semibold text-[#0d3f41]">
                <Loader2 className="h-4 w-4 animate-spin" /> Thinking about your day…
              </div>
            ) : aiError ? (
              <>
                <p className="mb-3 text-[13px] font-semibold leading-[1.5] text-[#0d3f41]">{aiError}</p>
                <button onClick={askAi} className="rounded-xl bg-[#0d5b5e] px-4 py-2.5 text-xs font-extrabold text-white">
                  Try again
                </button>
              </>
            ) : suggestion ? (
              <>
                <p className="mb-3 text-[13px] font-semibold leading-[1.5] text-[#0d3f41]">&ldquo;{suggestion.message}&rdquo;</p>
                <div className="mb-3 flex flex-col gap-1 rounded-xl bg-white/40 p-2.5">
                  {suggestion.blocks.map((s, i) => (
                    <div key={i} className="flex justify-between text-[12px] font-semibold text-[#0d3f41]">
                      <span className="truncate pr-2">{s.title}</span>
                      <span className="flex-shrink-0 font-extrabold">{s.time}</span>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2.5">
                  <button onClick={applySuggestion} className="rounded-xl bg-[#0d5b5e] px-4 py-2.5 text-xs font-extrabold text-white">
                    Apply
                  </button>
                  <button onClick={() => setAiOpen(false)} className="rounded-xl bg-white/60 px-4 py-2.5 text-xs font-extrabold text-[#0d5b5e]">
                    Not now
                  </button>
                </div>
              </>
            ) : null}
          </div>
        )}
      </aside>
    </div>
  );
}
