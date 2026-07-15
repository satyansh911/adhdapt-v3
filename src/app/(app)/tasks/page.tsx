"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, X, Check, Maximize2, ArrowRight } from "lucide-react";
import LottiePlaceholder from "@/components/myspace/LottiePlaceholder";
import {
  getTaskBreakdowns,
  saveTaskBreakdowns,
  type TaskBreakdown,
  type SubTask,
} from "@/lib/myspace-storage";

const uid = () => Math.random().toString(36).slice(2, 9);
const BREAK_SECONDS = 5 * 60;

export default function TasksPage() {
  const [tasks, setTasks] = useState<TaskBreakdown[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [bigInput, setBigInput] = useState("");
  const [subInput, setSubInput] = useState("");

  // Focus mode state
  const [focusMode, setFocusMode] = useState(false);
  const [breakActive, setBreakActive] = useState(false);
  const [breakLeft, setBreakLeft] = useState(BREAK_SECONDS);

  useEffect(() => {
    const loaded = getTaskBreakdowns();
    setTasks(loaded);
    if (loaded[0]) setActiveId(loaded[0].id);
  }, []);

  useEffect(() => {
    if (!breakActive) return;
    const id = setInterval(
      () => setBreakLeft((s) => (s <= 1 ? (setBreakActive(false), BREAK_SECONDS) : s - 1)),
      1000
    );
    return () => clearInterval(id);
  }, [breakActive]);

  const persist = (next: TaskBreakdown[]) => {
    setTasks(next);
    saveTaskBreakdowns(next);
  };

  const active = tasks.find((t) => t.id === activeId) || null;
  const currentSub = useMemo(
    () => active?.subtasks.find((s) => !s.done) || null,
    [active]
  );
  const progress = active && active.subtasks.length
    ? active.subtasks.filter((s) => s.done).length / active.subtasks.length
    : 0;

  const createTask = () => {
    if (!bigInput.trim()) return;
    const t: TaskBreakdown = {
      id: uid(),
      title: bigInput.trim(),
      subtasks: [],
      createdAt: new Date().toISOString(),
    };
    persist([t, ...tasks]);
    setActiveId(t.id);
    setBigInput("");
  };

  const addSub = () => {
    if (!subInput.trim() || !active) return;
    const sub: SubTask = { id: uid(), title: subInput.trim(), done: false };
    persist(tasks.map((t) => (t.id === active.id ? { ...t, subtasks: [...t.subtasks, sub] } : t)));
    setSubInput("");
  };

  const toggleSub = (sid: string) => {
    if (!active) return;
    persist(
      tasks.map((t) =>
        t.id === active.id
          ? { ...t, subtasks: t.subtasks.map((s) => (s.id === sid ? { ...s, done: !s.done } : s)) }
          : t
      )
    );
  };

  const completeCurrentInFocus = () => {
    if (!active || !currentSub) return;
    toggleSub(currentSub.id);
    // Built-in rest between subtasks — rest is designed in, not earned.
    setBreakActive(true);
    setBreakLeft(BREAK_SECONDS);
  };

  const fmt = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  // ---- FOCUS MODE overlay ----
  if (focusMode && active) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#111] px-6 text-center">
        <button
          onClick={() => { setFocusMode(false); setBreakActive(false); }}
          className="absolute right-6 top-6 flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-white"
        >
          <X className="h-4 w-4" /> Exit focus
        </button>

        {breakActive ? (
          <>
            <LottiePlaceholder name="break-breathe" note="Gentle breathing loop." className="mb-6 h-24 w-24 border-[#8acfd1]" />
            <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-[#8acfd1]">Break time</span>
            <h1 className="mt-3 font-display text-5xl font-extrabold text-white">{fmt(breakLeft)}</h1>
            <p className="mt-3 max-w-sm text-[#bbb]">Rest is part of the work. Stretch, sip water, look out a window. 💛</p>
            <button onClick={() => setBreakActive(false)} className="mt-8 rounded-2xl bg-[#8acfd1] px-6 py-3 font-extrabold text-[#0d3f41]">
              Skip to next step
            </button>
          </>
        ) : currentSub ? (
          <>
            <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-[#ED1C24]">One thing only</span>
            <h1 className="mt-4 max-w-2xl font-display text-4xl font-extrabold leading-tight text-white md:text-5xl">
              {currentSub.title}
            </h1>
            <p className="mt-4 text-sm text-[#9a97a3]">from &ldquo;{active.title}&rdquo;</p>
            <button
              onClick={completeCurrentInFocus}
              className="mt-10 inline-flex items-center gap-2 rounded-2xl bg-[#ED1C24] px-8 py-4 text-base font-extrabold text-white shadow-[4px_4px_0_#ED1C24]"
            >
              <Check className="h-5 w-5" /> Done — take a break
            </button>
          </>
        ) : (
          <>
            <LottiePlaceholder name="task-complete" note="Plays once on completion." className="mb-6 h-28 w-28 border-[#FFC107]" />
            <h1 className="font-display text-4xl font-extrabold text-white">All steps done! 🎉</h1>
            <p className="mt-3 text-[#bbb]">You broke the scary thing into wins. That counts.</p>
            <button onClick={() => setFocusMode(false)} className="mt-8 rounded-2xl bg-[#FFC107] px-6 py-3 font-extrabold text-[#ececf0]">
              Back to tasks
            </button>
          </>
        )}
      </div>
    );
  }

  // ---- NORMAL breakdown view ----
  return (
    <div className="mx-auto max-w-3xl px-5 py-8 md:px-8">
      <h1 className="font-display text-[30px] font-extrabold leading-none">Task breakdown</h1>
      <p className="mt-2 text-sm font-medium text-[#9a97a3]">
        Big scary task → tiny doable steps. One next thing at a time.
      </p>

      {/* New big task */}
      <div className="mt-6 flex gap-2">
        <input
          value={bigInput}
          onChange={(e) => setBigInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && createTask()}
          placeholder="What big thing is on your mind?"
          className="flex-1 rounded-2xl border-2 border-[#111] bg-[#17171b] px-4 py-3 text-sm outline-none focus:shadow-[3px_3px_0_#ED1C24]"
        />
        <button onClick={createTask} className="rounded-2xl bg-[#111] px-5 text-sm font-extrabold text-white">
          Add
        </button>
      </div>

      {/* Task list selector */}
      {tasks.length > 1 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {tasks.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveId(t.id)}
              className={`rounded-full border px-3 py-1.5 text-xs font-bold ${
                t.id === activeId ? "border-[#111] bg-[#251f16]" : "border-white/12 bg-[#17171b] text-[#9a97a3]"
              }`}
            >
              {t.title.slice(0, 24)}
            </button>
          ))}
        </div>
      )}

      {/* Active task breakdown */}
      {active ? (
        <div className="hoverable mt-6 rounded-3xl border-2 border-[#111] bg-[#17171b] p-6 shadow-[5px_5px_0_#ED1C24]">
          <div className="flex items-start justify-between gap-4">
            <h2 className="text-xl font-extrabold">{active.title}</h2>
            {/* progress ring */}
            <div className="relative h-14 w-14 flex-shrink-0">
              <svg viewBox="0 0 36 36" className="h-14 w-14 -rotate-90">
                <circle cx="18" cy="18" r="16" fill="none" stroke="#eee" strokeWidth="4" />
                <circle
                  cx="18" cy="18" r="16" fill="none" stroke="#ED1C24" strokeWidth="4"
                  strokeDasharray={`${progress * 100} 100`} strokeLinecap="round"
                  pathLength={100}
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-[11px] font-extrabold">
                {Math.round(progress * 100)}%
              </span>
            </div>
          </div>

          {/* subtasks */}
          <div className="mt-5 flex flex-col gap-2">
            {active.subtasks.map((s) => (
              <label key={s.id} className="flex cursor-pointer items-center gap-3 rounded-2xl border border-white/10 bg-[#080808] px-4 py-3">
                <button
                  onClick={() => toggleSub(s.id)}
                  className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg border-2 ${
                    s.done ? "border-[#ED1C24] bg-[#ED1C24] text-white" : "border-[#111]/30"
                  }`}
                >
                  {s.done && <Check className="h-4 w-4" />}
                </button>
                <span className={`text-sm font-medium ${s.done ? "text-[#7c7986] line-through" : ""}`}>{s.title}</span>
              </label>
            ))}
            {active.subtasks.length === 0 && (
              <p className="text-sm text-[#8b8892]">Break it down — what&apos;s the very first tiny step?</p>
            )}
          </div>

          {/* add subtask */}
          <div className="mt-4 flex gap-2">
            <input
              value={subInput}
              onChange={(e) => setSubInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addSub()}
              placeholder="Add a tiny step…"
              className="flex-1 rounded-xl border border-white/12 bg-[#17171b] px-3.5 py-2.5 text-sm outline-none focus:border-[#ED1C24]"
            />
            <button onClick={addSub} className="flex items-center gap-1 rounded-xl bg-[#8acfd1] px-3 text-sm font-extrabold">
              <Plus className="h-4 w-4" />
            </button>
          </div>

          <button
            onClick={() => setFocusMode(true)}
            disabled={active.subtasks.length === 0}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#ED1C24] py-3.5 text-sm font-extrabold text-white shadow-[3px_3px_0_#111] transition-transform hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none disabled:opacity-40"
          >
            <Maximize2 className="h-4 w-4" /> Enter focus mode
          </button>
        </div>
      ) : (
        <div className="mt-6 flex items-center gap-3 rounded-2xl border border-dashed border-white/12 bg-[#17171b] px-5 py-10 text-sm text-[#8b8892]">
          <ArrowRight className="h-5 w-5" /> Add a big task above to break it down.
        </div>
      )}
    </div>
  );
}
