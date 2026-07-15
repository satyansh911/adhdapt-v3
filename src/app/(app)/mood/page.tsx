"use client";

import { useEffect, useState } from "react";
import { Check, Play, Music, X } from "lucide-react";
import { getMoodEntries, saveMoodEntries, type MoodEntry } from "@/lib/myspace-storage";

const WEATHERS = [
  { score: 1, emoji: "⛈️", label: "Stormy", color: "#7c8db5" },
  { score: 2, emoji: "🌧️", label: "Rainy", color: "#2D8EFF" },
  { score: 3, emoji: "⛅", label: "Cloudy", color: "#F5B000" },
  { score: 4, emoji: "🌤️", label: "Bright", color: "#f5934f" },
  { score: 5, emoji: "☀️", label: "Sunny", color: "#ED1C24" },
];

// Real calming audio via YouTube embeds. Swap the ids for other tracks anytime.
const SESSIONS = [
  { yt: "jfKfPfyJRdk", title: "Lofi focus beats", tag: "Focus", color: "#2D8EFF" },
  { yt: "q76bMs-NwRk", title: "Gentle rain", tag: "Calm", color: "#8acfd1" },
  { yt: "1ZYbU82GVz4", title: "Deep sleep waves", tag: "Sleep", color: "#8fc0ff" },
  { yt: "OdIJ2x3nxzQ", title: "Forest morning", tag: "Nature", color: "#2ec16e" },
  { yt: "lFcSrYw-ARY", title: "Calm piano", tag: "Relax", color: "#F5B000" },
];

export default function MoodPage() {
  const [selected, setSelected] = useState(3);
  const [intensity, setIntensity] = useState(3);
  const [note, setNote] = useState("");
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [justSaved, setJustSaved] = useState(false);
  const [playing, setPlaying] = useState<string | null>(null);

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

  const nowPlaying = SESSIONS.find((s) => s.yt === playing);

  return (
    <div className="flex h-[100dvh] flex-col px-5 py-6 md:px-8">
      {/* Header */}
      <header className="flex-shrink-0">
        <h1 className="font-display text-[28px] font-extrabold leading-none">How&apos;s your weather today?</h1>
        <p className="mt-1.5 text-sm font-medium text-[#9a97a3]">No wrong answers. Just notice, gently.</p>
      </header>

      {/* Two panes */}
      <div className="mt-5 grid min-h-0 flex-1 grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Left — check-in + recent (scrolls internally if needed) */}
        <div className="flex min-h-0 flex-col gap-4 overflow-y-auto pr-1">
          <div className="rounded-3xl border border-white/10 bg-[#17171b] p-5">
            <div className="flex justify-between gap-2">
              {WEATHERS.map((w) => (
                <button
                  key={w.score}
                  onClick={() => setSelected(w.score)}
                  className={`flex flex-1 flex-col items-center gap-1 rounded-2xl border-2 py-2.5 transition-all ${
                    selected === w.score ? "scale-105 border-[#111] shadow-[3px_3px_0_#111]" : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                  style={{ background: selected === w.score ? w.color + "22" : "transparent" }}
                >
                  <span className="text-2xl">{w.emoji}</span>
                  <span className="text-[11px] font-bold" style={{ color: w.color }}>{w.label}</span>
                </button>
              ))}
            </div>

            <div className="mt-5">
              <label className="text-[12px] font-bold uppercase tracking-[0.12em] text-[#8b8892]">
                How strong is it? · {intensity}/5
              </label>
              <input
                type="range" min={1} max={5} value={intensity}
                onChange={(e) => setIntensity(Number(e.target.value))}
                className="mt-2 w-full"
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

          {entries.length > 0 && (
            <div>
              <h2 className="mb-2 text-[12px] font-bold uppercase tracking-[0.12em] text-[#8b8892]">Recent check-ins</h2>
              <div className="flex flex-col gap-2">
                {entries.slice(0, 8).map((e) => (
                  <div key={e.id} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#17171b] px-4 py-2.5">
                    <span className="text-xl">{e.emoji}</span>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-bold">{e.label}</div>
                      {e.note && <div className="truncate text-xs text-[#9a97a3]">{e.note}</div>}
                    </div>
                    <span className="text-[11px] font-medium text-[#7c7986]">
                      {new Date(e.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right — calming sessions (real YouTube audio) */}
        <div className="flex min-h-0 flex-col rounded-3xl border border-white/10 bg-[#17171b] p-5">
          <div className="flex-shrink-0">
            <h2 className="font-display text-xl font-extrabold">Calming sessions</h2>
            <p className="mt-1 text-sm font-medium text-[#9a97a3]">Press play, breathe, ride the wave.</p>
          </div>

          {/* Player */}
          {nowPlaying ? (
            <div className="mt-4 flex-shrink-0">
              <div className="relative overflow-hidden rounded-2xl border border-white/10">
                <iframe
                  key={nowPlaying.yt}
                  src={`https://www.youtube.com/embed/${nowPlaying.yt}?autoplay=1&rel=0`}
                  title={nowPlaying.title}
                  className="aspect-video w-full"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                />
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-sm font-bold" style={{ color: nowPlaying.color }}>
                  <Music className="h-3.5 w-3.5" /> Now playing · {nowPlaying.title}
                </span>
                <button onClick={() => setPlaying(null)} className="flex items-center gap-1 text-xs font-bold text-[#8b8892] hover:text-[#ED1C24]">
                  <X className="h-3.5 w-3.5" /> Stop
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-4 flex flex-shrink-0 items-center justify-center rounded-2xl border border-dashed border-white/15 py-8 text-sm text-[#8b8892]">
              Pick a session below to start listening.
            </div>
          )}

          {/* Session list */}
          <div className="mt-4 flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto pr-1">
            {SESSIONS.map((s) => {
              const active = playing === s.yt;
              return (
                <button
                  key={s.yt}
                  onClick={() => setPlaying(s.yt)}
                  className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-colors ${
                    active ? "border-white/20 bg-white/5" : "border-white/10 hover:bg-white/5"
                  }`}
                >
                  <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-[#111]" style={{ background: s.color }}>
                    <Play className="h-4 w-4 text-[#111]" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-extrabold">{s.title}</div>
                    <div className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: s.color }}>{s.tag}</div>
                  </div>
                  {active && <span className="flex-shrink-0 text-[11px] font-bold text-[#2ec16e]">▶ Playing</span>}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
