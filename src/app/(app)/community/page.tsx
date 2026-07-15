"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Heart, Users, Send } from "lucide-react";
import {
  getCommunityPosts,
  saveCommunityPosts,
  type CommunityPost,
} from "@/lib/myspace-storage";

const ROOMS = [
  { id: "Inattentive", name: "Inattentive", color: "#2D8EFF" },
  { id: "Hyperactive", name: "Hyperactive", color: "#ED1C24" },
  { id: "Combined", name: "Combined", color: "#ED1C24" },
  { id: "Time-Blind Club", name: "Time-Blind Club", color: "#F5B000" },
  { id: "Body-Doubling", name: "Body-Doubling", color: "#0d5b5e" },
];

const roomColor = (room: string) => ROOMS.find((r) => r.id === room)?.color ?? "#ED1C24";

function relativeTime(iso: string): string {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

export default function CommunityPage() {
  const { user } = useUser();
  const [active, setActive] = useState<string>("all");
  const [room, setRoom] = useState<string>("Combined");
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [draft, setDraft] = useState("");

  useEffect(() => setPosts(getCommunityPosts()), []);

  const persist = (next: CommunityPost[]) => {
    setPosts(next);
    saveCommunityPosts(next);
  };

  const visible = active === "all" ? posts : posts.filter((p) => p.room === active);

  const like = (id: string) =>
    persist(posts.map((p) => (p.id === id ? { ...p, hearts: p.hearts + 1 } : p)));

  const post = () => {
    if (!draft.trim()) return;
    const name = user?.firstName || user?.username || "You";
    const initials =
      ((user?.firstName?.[0] ?? "") + (user?.lastName?.[0] ?? "")) ||
      name.slice(0, 2).toUpperCase();
    persist([
      {
        id: `p${Date.now()}`,
        author: name,
        initials,
        room,
        body: draft.trim(),
        hearts: 0,
        createdAt: new Date().toISOString(),
      },
      ...posts,
    ]);
    setDraft("");
  };

  return (
    <div className="mx-auto max-w-3xl px-5 py-8 md:px-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-[30px] font-extrabold leading-none">Community</h1>
          <p className="mt-2 text-sm font-medium text-[#9a97a3]">Kind, weird, and wonderfully distractible. 💛</p>
        </div>
        <Users className="h-8 w-8 text-[#ED1C24]" />
      </div>

      {/* Composer */}
      <div className="mt-6 rounded-2xl border border-white/10 bg-[#17171b] p-3">
        <div className="flex gap-2">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && post()}
            placeholder="Share a small win or a struggle…"
            className="flex-1 rounded-xl bg-[#080808] px-3.5 py-2.5 text-sm outline-none"
          />
          <button onClick={post} className="flex items-center gap-1.5 rounded-xl bg-[#ED1C24] px-4 text-sm font-extrabold text-white">
            <Send className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {ROOMS.map((r) => (
            <button
              key={r.id}
              onClick={() => setRoom(r.id)}
              className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${room === r.id ? "text-white" : "text-[#8b8892]"}`}
              style={{ background: room === r.id ? r.color : "transparent", border: `1px solid ${r.color}66` }}
            >
              {r.name}
            </button>
          ))}
        </div>
      </div>

      {/* Room filter */}
      <div className="mt-5 flex flex-wrap gap-2">
        <button
          onClick={() => setActive("all")}
          className={`rounded-full border-2 px-3.5 py-1.5 text-xs font-extrabold ${active === "all" ? "border-[#111] bg-[#111] text-white" : "border-white/12 bg-[#17171b] text-[#a8a5b0]"}`}
        >
          All
        </button>
        {ROOMS.map((r) => (
          <button
            key={r.id}
            onClick={() => setActive(r.id)}
            className={`rounded-full border-2 px-3.5 py-1.5 text-xs font-extrabold ${active === r.id ? "border-[#111]" : "border-transparent"}`}
            style={{ background: `${r.color}22`, color: r.color }}
          >
            {r.name}
          </button>
        ))}
      </div>

      {/* Feed */}
      <div className="mt-5 flex flex-col gap-4">
        {visible.map((p) => (
          <article key={p.id} className="hoverable rounded-3xl border-2 border-[#111] bg-[#17171b] p-5 shadow-[4px_4px_0_#111]">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-extrabold text-white" style={{ background: roomColor(p.room) }}>
                {p.initials}
              </span>
              <div>
                <div className="text-sm font-extrabold">{p.author}</div>
                <div className="text-[11px] font-medium text-[#8b8892]">
                  <span style={{ color: roomColor(p.room) }}>{p.room}</span> · {relativeTime(p.createdAt)}
                </div>
              </div>
            </div>
            <p className="mt-3 text-[15px] leading-relaxed text-[#d9d7df]">{p.body}</p>
            <div className="mt-4 flex items-center gap-5 text-[13px] font-bold text-[#9a97a3]">
              <button onClick={() => like(p.id)} className="flex items-center gap-1.5 hover:text-[#ED1C24]">
                <Heart className="h-4 w-4" /> {p.hearts}
              </button>
            </div>
          </article>
        ))}
        {visible.length === 0 && (
          <p className="py-12 text-center text-sm text-[#8b8892]">
            No posts yet — share the first small win. 🌱
          </p>
        )}
      </div>
    </div>
  );
}
