"use client";

import {
  LayoutDashboard,
  TrendingUp,
  HeartHandshake,
  GraduationCap,
  ShieldCheck,
  MessageCircleHeart,
  Gift,
} from "lucide-react";
import RoleShell from "@/components/myspace/RoleShell";

const MOOD_BARS = [45, 55, 40, 62, 58, 70, 66, 78];

export default function ParentPage() {
  return (
    <RoleShell
      role="parent"
      label="Parent view"
      accent="#2D8EFF"
      sidebarBg="#171a22"
      user={{ initials: "RP", name: "Rosa P.", sub: "Parent of Sam" }}
      nav={[
        { label: "Overview", icon: LayoutDashboard, active: true },
        { label: "Progress", icon: TrendingUp },
        { label: "Encourage", icon: HeartHandshake },
        { label: "Learn", icon: GraduationCap },
        { label: "Consent & privacy", icon: ShieldCheck },
      ]}
    >
      <div className="px-6 py-8 md:px-9">
        {/* Consent banner */}
        <div className="mb-6 flex items-center gap-3 rounded-2xl border border-[#2D8EFF]/25 bg-[#2D8EFF]/[.14] px-4 py-3.5">
          <ShieldCheck className="h-5 w-5 flex-shrink-0 text-[#2D8EFF]" />
          <span className="text-[13px] font-medium text-[#8fc0ff]">
            Sam chose to share <b>wins, streaks &amp; mood trends</b> with you. Detailed journal entries and chats stay private.
          </span>
          <button className="ml-auto flex-shrink-0 text-xs font-bold text-[#2D8EFF]">Manage</button>
        </div>

        {/* Child header */}
        <div className="mb-6 flex items-center gap-4">
          <span className="flex h-[60px] w-[60px] items-center justify-center rounded-[20px] bg-[#2D8EFF] p-4 text-2xl font-extrabold text-white">S</span>
          <div>
            <h1 className="font-display text-3xl font-extrabold leading-none">Sam&apos;s had a good week 🌟</h1>
            <p className="mt-1.5 text-sm font-medium text-[#9aa7bd]">14 years old · here&apos;s what to celebrate, not correct.</p>
          </div>
        </div>

        {/* Stat cards */}
        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          {[
            { v: "9🔥", l: "day check-in streak", c: "#F5B000" },
            { v: "23", l: "tasks finished this week", c: "#2D8EFF" },
            { v: "🙂 Steady", l: "overall mood, trending up", c: "#ED1C24" },
          ].map((s) => (
            <div key={s.l} className="hoverable rounded-3xl bg-[#17171b] p-6 shadow-[0_12px_30px_-22px_rgba(45,142,255,.5)]">
              <div className="text-[34px] font-[900]" style={{ color: s.c }}>{s.v}</div>
              <div className="mt-1 text-xs font-semibold text-[#9aa7bd]">{s.l}</div>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-5 lg:flex-row">
          {/* Mood chart */}
          <div className="hoverable flex-1 rounded-3xl bg-[#17171b] p-6 shadow-[0_12px_30px_-22px_rgba(45,142,255,.5)]">
            <h3 className="text-[17px] font-extrabold">Mood this month</h3>
            <p className="mb-4 text-[11px] font-medium text-[#9aa7bd]">A gentle overall picture — no daily details.</p>
            <div className="flex h-32 items-end gap-1.5">
              {MOOD_BARS.map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t-md"
                  style={{ height: `${h}%`, background: h > 65 ? "#2D8EFF" : h > 55 ? "#7fb6f2" : h > 45 ? "#a9cef7" : "#cfe2fb" }}
                />
              ))}
            </div>
          </div>

          {/* Encourage */}
          <div className="w-full flex-shrink-0 rounded-3xl bg-[#FFC107]/[.12] p-6 lg:w-[340px]">
            <h3 className="mb-4 text-[17px] font-extrabold">Ways to cheer Sam on</h3>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 rounded-2xl bg-[#17171b] p-3.5">
                <MessageCircleHeart className="h-5 w-5 flex-shrink-0 text-[#F5B000]" />
                <span className="text-[13px] font-semibold leading-snug text-[#d8cba0]">&ldquo;Saw you kept your streak — proud of you!&rdquo;</span>
              </div>
              <div className="flex items-center gap-3 rounded-2xl bg-[#17171b] p-3.5">
                <Gift className="h-5 w-5 flex-shrink-0 text-[#ED1C24]" />
                <span className="text-[13px] font-semibold leading-snug text-[#d8cba0]">Celebrate the finished science project together.</span>
              </div>
              <button className="mt-1 rounded-xl bg-[#F5B000] p-3 text-center text-[13px] font-extrabold text-white">
                Send an encouragement
              </button>
            </div>
          </div>
        </div>
      </div>
    </RoleShell>
  );
}
