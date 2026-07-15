import Link from "next/link";
import {
  Gamepad2,
  CalendarCheck,
  Smile,
  NotebookPen,
  ListChecks,
  Users,
  Play,
  type LucideIcon,
} from "lucide-react";
import LottiePlaceholder from "@/components/myspace/LottiePlaceholder";

export const metadata = { title: "mySpace · Dashboard" };

interface ModuleTile {
  href: string;
  title: string;
  sub: string;
  icon: LucideIcon;
  accent: string; // icon color
  featured?: boolean;
}

const MODULES: ModuleTile[] = [
  {
    href: "/game",
    title: "Focus Fest",
    sub: "3 brain games ready",
    icon: Gamepad2,
    accent: "#0d5b5e",
    featured: true,
  },
  { href: "/scheduler", title: "Scheduler", sub: "2 reminders today", icon: CalendarCheck, accent: "#ED1C24" },
  { href: "/mood", title: "Mood", sub: "Check in — 20s", icon: Smile, accent: "#2D8EFF" },
  { href: "/journal", title: "Journal", sub: "Last: 2 days ago", icon: NotebookPen, accent: "#F5B000" },
  { href: "/tasks", title: "Task Breakdown", sub: "1 big task waiting", icon: ListChecks, accent: "#ED1C24" },
  { href: "/community", title: "Community", sub: "4 new in Time-Blind Club", icon: Users, accent: "#2D8EFF" },
];

export default function DashboardPage() {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="px-6 py-8 md:px-9">
      {/* Greeting + stats */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-extrabold leading-none md:text-[34px]">
            Hey Jordan 👋
          </h1>
          <p className="mt-1.5 text-sm font-medium text-[#a09da8]">
            {today} · Let&apos;s make today gentle and doable.
          </p>
        </div>
        <div className="flex gap-3">
          <div className="rounded-2xl border border-white/10 bg-[#FFC107]/[.12] px-4 py-3 text-center">
            <div className="text-[22px] font-[900] text-[#F5B000]">7🔥</div>
            <div className="text-[10.5px] font-semibold text-[#f0cf7a]">day streak</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-[#2D8EFF]/[.14] px-4 py-3 text-center">
            <div className="text-[22px] font-[900] text-[#2D8EFF]">3/5</div>
            <div className="text-[10.5px] font-semibold text-[#8fc0ff]">tasks today</div>
          </div>
        </div>
      </div>

      {/* One next thing */}
      <div className="mb-6 flex flex-col items-start gap-5 rounded-3xl border-2 border-[#111] bg-[#251f16] p-6 shadow-[5px_5px_0_#ED1C24] sm:flex-row sm:items-center">
        <LottiePlaceholder
          name="focus-timer-idle"
          note="Idle pulse, plays on hover only."
          className="h-[74px] w-[74px] flex-shrink-0"
        />
        <div className="flex-1">
          <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#ED1C24]">
            Your one next thing
          </span>
          <h3 className="mb-0.5 mt-1.5 text-[22px] font-extrabold">
            Draft the intro email — 15 min
          </h3>
          <p className="text-[13px] font-medium text-[#d8c9a0]">
            Just the first sentence counts as a win.
          </p>
        </div>
        <Link
          href="/tasks"
          className="inline-flex items-center gap-2 rounded-2xl bg-[#ED1C24] px-6 py-3.5 text-sm font-extrabold text-white shadow-[3px_3px_0_#111] transition-transform hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
        >
          <Play className="h-4 w-4" /> Start focus
        </Link>
      </div>

      {/* Module grid */}
      <h4 className="mb-3.5 text-[12px] font-bold uppercase tracking-[0.14em] text-[#8b8892]">
        Jump back in
      </h4>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {MODULES.map(({ href, title, sub, icon: Icon, accent, featured }) => (
          <Link
            key={href}
            href={href}
            className={
              featured
                ? "rounded-3xl border-2 border-[#111] bg-[#8acfd1] p-5 shadow-[4px_4px_0_#111] transition-transform hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
                : "rounded-3xl border border-white/10 bg-[#17171b] p-5 shadow-[0_8px_22px_-14px_rgba(17,17,17,.3)] transition-transform hover:-translate-y-0.5"
            }
          >
            <Icon className="h-6 w-6" style={{ color: accent }} />
            <h5
              className="mb-0.5 mt-3 text-[17px] font-extrabold"
              style={featured ? { color: "#0d3f41" } : undefined}
            >
              {title}
            </h5>
            <p
              className="text-xs font-medium"
              style={{ color: featured ? "#0d5b5e" : "#888" }}
            >
              {sub}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
