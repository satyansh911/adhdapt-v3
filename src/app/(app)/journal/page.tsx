"use client";

import { useEffect, useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useUser } from "@clerk/nextjs";
import { Sparkles, NotebookPen } from "lucide-react";
import { useSupabase } from "@/hooks/use-supabase";
import { listJournal, addJournal, listMoods } from "@/lib/db";
import type { JournalNote } from "@/lib/myspace-storage";

const PROMPTS = [
  "What's one small thing that went okay today?",
  "What's taking up the most space in your head right now?",
  "If today had a weather report, what would it say?",
  "What would make tomorrow 1% gentler?",
];

export default function JournalPage() {
  const supabase = useSupabase();
  const { user } = useUser();
  const uid = user?.id;

  const [text, setText] = useState("");
  const [prompt, setPrompt] = useState(PROMPTS[0]);
  const [notes, setNotes] = useState<JournalNote[]>([]);
  const [moodSeries, setMoodSeries] = useState<{ day: string; mood: number }[]>([]);

  useEffect(() => {
    if (!supabase || !uid) return;
    listJournal(supabase, uid).then(setNotes);

    // Build a 14-day mood-over-time series from saved mood check-ins.
    listMoods(supabase, uid).then((entries) => {
      const byDay = new Map<string, { sum: number; n: number }>();
      entries.forEach((e) => {
        const key = new Date(e.createdAt).toISOString().slice(0, 10);
        const cur = byDay.get(key) || { sum: 0, n: 0 };
        byDay.set(key, { sum: cur.sum + e.score, n: cur.n + 1 });
      });
      const series: { day: string; mood: number }[] = [];
      for (let i = 13; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const key = d.toISOString().slice(0, 10);
        const agg = byDay.get(key);
        series.push({
          day: d.toLocaleDateString("en-US", { month: "numeric", day: "numeric" }),
          mood: agg ? Math.round((agg.sum / agg.n) * 10) / 10 : 0,
        });
      }
      setMoodSeries(series);
    });
  }, [supabase, uid]);

  const hasMood = useMemo(() => moodSeries.some((p) => p.mood > 0), [moodSeries]);

  const save = async () => {
    if (!text.trim() || !supabase || !uid) return;
    const created = await addJournal(supabase, uid, { text: text.trim(), prompt });
    if (created) setNotes((prev) => [created, ...prev]);
    setText("");
  };

  const shufflePrompt = () =>
    setPrompt(PROMPTS[Math.floor(Math.random() * PROMPTS.length)]);

  return (
    <div className="mx-auto max-w-3xl px-5 py-8 md:px-8">
      <h1 className="font-display text-[30px] font-extrabold leading-none">Brain dump</h1>
      <p className="mt-2 text-sm font-medium text-[#9a97a3]">
        Private, no formatting anxiety. Just let it out.
      </p>

      {/* Write area */}
      <div className="hoverable mt-6 rounded-3xl border border-white/10 bg-[#17171b] p-5 shadow-[0_12px_30px_-20px_rgba(17,17,17,.4)]">
        <button
          onClick={shufflePrompt}
          className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-[#ED1C24]/30 bg-[#ED1C24]/[.14] px-3 py-1.5 text-xs font-bold text-[#ff9a9a]"
        >
          <Sparkles className="h-3.5 w-3.5" /> {prompt}
        </button>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Start typing…"
          rows={6}
          className="w-full resize-none rounded-2xl bg-transparent text-[15px] leading-relaxed outline-none"
        />
        <div className="flex justify-end">
          <button
            onClick={save}
            disabled={!text.trim()}
            className="rounded-2xl bg-[#ED1C24] px-6 py-3 text-sm font-extrabold text-white shadow-[3px_3px_0_#111] transition-transform hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none disabled:opacity-40"
          >
            Save entry
          </button>
        </div>
      </div>

      {/* Reflection graph */}
      <h2 className="mt-9 font-display text-2xl font-extrabold">Mood over 14 days</h2>
      <div className="hoverable mt-4 rounded-3xl border border-white/10 bg-[#17171b] p-5">
        {hasMood ? (
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={moodSeries} margin={{ top: 8, right: 8, bottom: 0, left: -24 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#999" }} interval={1} />
                <YAxis domain={[0, 5]} tick={{ fontSize: 11, fill: "#999" }} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="mood"
                  stroke="#ED1C24"
                  strokeWidth={3}
                  dot={{ r: 3, fill: "#ED1C24" }}
                  connectNulls
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="py-10 text-center text-sm text-[#8b8892]">
            No mood check-ins yet — visit <b>Mood</b> to start your trend line. 🌤️
          </p>
        )}
      </div>

      {/* Past entries */}
      <h2 className="mt-9 font-display text-2xl font-extrabold">Past entries</h2>
      <div className="mt-4 flex flex-col gap-3">
        {notes.length === 0 && (
          <div className="flex items-center gap-3 rounded-2xl border border-dashed border-white/12 bg-[#17171b] px-5 py-8 text-sm text-[#8b8892]">
            <NotebookPen className="h-5 w-5" /> Your first entry will land here. No pressure. 💛
          </div>
        )}
        {notes.map((n) => (
          <article key={n.id} className="rounded-2xl border border-white/10 bg-[#17171b] p-4">
            {n.prompt && <div className="mb-1 text-[11px] font-bold text-[#ED1C24]">{n.prompt}</div>}
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-[#d9d7df]">{n.text}</p>
            <time className="mt-2 block text-[11px] font-medium text-[#7c7986]">
              {new Date(n.createdAt).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
            </time>
          </article>
        ))}
      </div>
    </div>
  );
}
