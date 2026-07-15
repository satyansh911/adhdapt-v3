"use client";

import { useState } from "react";
import { Heart, MessageCircle, Radio, Users, Send } from "lucide-react";

const ROOMS = [
  { id: "inatt", name: "Inattentive", color: "#2D8EFF", bg: "#eaf3ff" },
  { id: "hyper", name: "Hyperactive", color: "#ED1C24", bg: "#fde9f3" },
  { id: "comb", name: "Combined", color: "#ED1C24", bg: "#fde9f3" },
  { id: "timeblind", name: "Time-Blind Club", color: "#F5B000", bg: "#fff7e0" },
  { id: "bodydouble", name: "Body-Doubling", color: "#0d5b5e", bg: "#e6f7f7" },
];

interface Post {
  id: string;
  author: string;
  initials: string;
  room: string;
  color: string;
  time: string;
  body: string;
  hearts: number;
  replies: number;
}

const MOCK_POSTS: Post[] = [
  { id: "p1", author: "Sam R.", initials: "SR", room: "Time-Blind Club", color: "#F5B000", time: "12m", body: "Anyone else set a timer for 20 min and look up 3 hours later? Just me hyperfocusing on reorganizing my fonts folder again 😅", hearts: 24, replies: 6 },
  { id: "p2", author: "Priya K.", initials: "PK", room: "Inattentive", color: "#2D8EFF", time: "48m", body: "Small win: I broke 'do taxes' into 8 tiny steps in the Task tool and did step one. That's the whole post. Celebrating anyway. 🎉", hearts: 61, replies: 14 },
  { id: "p3", author: "Marcus T.", initials: "MT", room: "Body-Doubling", color: "#0d5b5e", time: "2h", body: "Doing a focus sprint at 3pm ET if anyone wants to body-double. Cameras optional, snacks encouraged.", hearts: 18, replies: 9 },
];

export default function CommunityPage() {
  const [active, setActive] = useState<string>("all");
  const [posts, setPosts] = useState(MOCK_POSTS);
  const [draft, setDraft] = useState("");

  const visible = active === "all" ? posts : posts.filter((p) => p.room === ROOMS.find((r) => r.id === active)?.name);

  const like = (id: string) =>
    setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, hearts: p.hearts + 1 } : p)));

  const post = () => {
    if (!draft.trim()) return;
    setPosts((prev) => [
      { id: `p${Date.now()}`, author: "You", initials: "YO", room: "Combined", color: "#ED1C24", time: "now", body: draft.trim(), hearts: 0, replies: 0 },
      ...prev,
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

      {/* Body-doubling live strip */}
      <div className="mt-5 flex items-center gap-3 rounded-2xl border-2 border-[#111] bg-[#8acfd1] px-4 py-3 shadow-[4px_4px_0_#111]">
        <span className="flex items-center gap-1.5 rounded-full bg-[#ED1C24] px-2.5 py-1 text-[11px] font-extrabold text-white">
          <Radio className="h-3.5 w-3.5" /> LIVE
        </span>
        <span className="flex-1 text-sm font-bold text-[#0d3f41]">
          3 body-doubling rooms open now · 11 people focusing
        </span>
        <button className="rounded-xl bg-[#0d5b5e] px-3.5 py-2 text-xs font-extrabold text-white">Join</button>
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
            style={{ background: r.bg, color: r.color }}
          >
            {r.name}
          </button>
        ))}
      </div>

      {/* Composer */}
      <div className="mt-5 flex gap-2 rounded-2xl border border-white/10 bg-[#17171b] p-3">
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

      {/* Feed */}
      <div className="mt-5 flex flex-col gap-4">
        {visible.map((p) => (
          <article key={p.id} className="hoverable rounded-3xl border-2 border-[#111] bg-[#17171b] p-5 shadow-[4px_4px_0_#111]">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-extrabold text-white" style={{ background: p.color }}>
                {p.initials}
              </span>
              <div>
                <div className="text-sm font-extrabold">{p.author}</div>
                <div className="text-[11px] font-medium text-[#8b8892]">
                  <span style={{ color: p.color }}>{p.room}</span> · {p.time} ago
                </div>
              </div>
            </div>
            <p className="mt-3 text-[15px] leading-relaxed text-[#d9d7df]">{p.body}</p>
            <div className="mt-4 flex items-center gap-5 text-[13px] font-bold text-[#9a97a3]">
              <button onClick={() => like(p.id)} className="flex items-center gap-1.5 hover:text-[#ED1C24]">
                <Heart className="h-4 w-4" /> {p.hearts}
              </button>
              <span className="flex items-center gap-1.5">
                <MessageCircle className="h-4 w-4" /> {p.replies}
              </span>
            </div>
          </article>
        ))}
        {visible.length === 0 && (
          <p className="py-10 text-center text-sm text-[#8b8892]">No posts in this room yet — start the conversation. 🌱</p>
        )}
      </div>
    </div>
  );
}
