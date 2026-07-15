"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause, Check, Music } from "lucide-react";
import { getMoodEntries, saveMoodEntries, type MoodEntry } from "@/lib/myspace-storage";

const WEATHERS = [
  { score: 1, emoji: "⛈️", label: "Stormy", color: "#7c8db5" },
  { score: 2, emoji: "🌧️", label: "Rainy", color: "#2D8EFF" },
  { score: 3, emoji: "⛅", label: "Cloudy", color: "#F5B000" },
  { score: 4, emoji: "🌤️", label: "Bright", color: "#f5934f" },
  { score: 5, emoji: "☀️", label: "Sunny", color: "#ED1C24" },
];

const SESSIONS = [
  { id: "s1", title: "Calm the racing mind", len: "8 min", tint: "#eaf3ff" },
  { id: "s2", title: "Body scan reset", len: "12 min", tint: "#fde9f3" },
  { id: "s3", title: "Focus rain sounds", len: "30 min", tint: "#fff7e0" },
];

export default function MoodPage() {
  const [selected, setSelected] = useState(3);
  const [intensity, setIntensity] = useState(3);
  const [note, setNote] = useState("");
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [justSaved, setJustSaved] = useState(false);
  const [playing, setPlaying] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => setEntries(getMoodEntries()), []);

  const weather = WEATHERS.find((w) => w.score === selected)!;

  const save = () => {
    const entry: MoodEntry = {
      id: `m${Date.now()}`,
      score: selected,
      emoji: weather.emoji,
      label: weather.label,
      note: note.trim() || undefined,
      createdAt: new Date().toISOString(),
    };
    const next = [entry, ...entries];
    setEntries(next);
    saveMoodEntries(next);
    setNote("");
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 2200);
  };

  // Stubbed player: no real audio file yet, so we just toggle UI state.
  // Swap the <audio> src for a real track later.
  const togglePlay = (id: string) => setPlaying((p) => (p === id ? null : id));

  return (
    <div className="mx-auto max-w-3xl px-5 py-8 md:px-8">
      <h1 className="font-display text-[30px] font-extrabold leading-none">
        How&apos;s your weather today?
      </h1>
      <p className="mt-2 text-sm font-medium text-[#9a97a3]">
        No wrong answers. Just notice, gently.
      </p>

      {/* Check-in card */}
      <div className="hoverable mt-6 rounded-3xl border border-white/10 bg-[#17171b] p-6 shadow-[0_12px_30px_-20px_rgba(17,17,17,.4)]">
        <div className="flex justify-between gap-2">
          {WEATHERS.map((w) => (
            <button
              key={w.score}
              onClick={() => setSelected(w.score)}
              className={`flex flex-1 flex-col items-center gap-1 rounded-2xl border-2 py-3 transition-all ${
                selected === w.score
                  ? "scale-105 border-[#111] shadow-[3px_3px_0_#111]"
                  : "border-transparent opacity-60 hover:opacity-100"
              }`}
              style={{ background: selected === w.score ? w.color + "22" : "transparent" }}
            >
              <span className="text-3xl">{w.emoji}</span>
              <span className="text-[11px] font-bold" style={{ color: w.color }}>{w.label}</span>
            </button>
          ))}
        </div>

        <div className="mt-6">
          <label className="text-[12px] font-bold uppercase tracking-[0.12em] text-[#8b8892]">
            How strong is it? {"·".repeat(1)} {intensity}/5
          </label>
          <input
            type="range"
            min={1}
            max={5}
            value={intensity}
            onChange={(e) => setIntensity(Number(e.target.value))}
            className="mt-2 w-full accent-[#ED1C24]"
            style={{ accentColor: weather.color }}
          />
        </div>

        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Anything you want to note? (optional)"
          rows={2}
          className="mt-4 w-full resize-none rounded-2xl border border-white/10 bg-[#080808] p-3.5 text-sm outline-none focus:border-[#ED1C24]"
        />

        <button
          onClick={save}
          className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-[#ED1C24] px-6 py-3 text-sm font-extrabold text-white shadow-[3px_3px_0_#111] transition-transform hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
        >
          {justSaved ? <><Check className="h-4 w-4" /> Saved 💛</> : "Save check-in"}
        </button>
      </div>

      {/* Calming audio sessions */}
      <h2 className="mt-9 font-display text-2xl font-extrabold">Calming sessions</h2>
      <p className="mt-1 text-sm font-medium text-[#9a97a3]">Press play, breathe, ride the wave.</p>
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        {SESSIONS.map((s) => (
          <div key={s.id} className="hoverable overflow-hidden rounded-3xl border border-white/10 bg-[#17171b] shadow-[0_10px_26px_-18px_rgba(17,17,17,.4)]">
            {/* Striped placeholder cover art */}
            <div
              className="flex h-28 items-end p-3"
              style={{
                background: `repeating-linear-gradient(135deg, ${s.tint}, ${s.tint} 10px, #ffffff 10px, #ffffff 20px)`,
              }}
            >
              <span className="rounded-md bg-white/80 px-2 py-0.5 font-mono text-[9.5px] text-[#9a97a3]">
                cover art placeholder
              </span>
            </div>
            <div className="flex items-center gap-3 p-4">
              <button
                onClick={() => togglePlay(s.id)}
                className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border-2 border-[#111] bg-[#8acfd1]"
                aria-label={playing === s.id ? "Pause" : "Play"}
              >
                {playing === s.id ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </button>
              <div className="min-w-0">
                <div className="truncate text-sm font-extrabold">{s.title}</div>
                <div className="flex items-center gap-1 text-[11px] font-medium text-[#9a97a3]">
                  <Music className="h-3 w-3" /> {s.len}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Placeholder element for swapping in a real audio source later */}
      <audio ref={audioRef} className="hidden" />

      {/* Recent check-ins */}
      {entries.length > 0 && (
        <>
          <h2 className="mt-9 font-display text-2xl font-extrabold">Recent check-ins</h2>
          <div className="mt-4 flex flex-col gap-2">
            {entries.slice(0, 6).map((e) => (
              <div key={e.id} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#17171b] px-4 py-3">
                <span className="text-2xl">{e.emoji}</span>
                <div className="flex-1">
                  <div className="text-sm font-bold">{e.label}</div>
                  {e.note && <div className="text-xs text-[#9a97a3]">{e.note}</div>}
                </div>
                <span className="text-[11px] font-medium text-[#7c7986]">
                  {new Date(e.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
