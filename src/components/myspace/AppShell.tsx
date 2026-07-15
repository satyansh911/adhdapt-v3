"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Gamepad2,
  CalendarCheck,
  Smile,
  NotebookPen,
  ListChecks,
  Users,
  Zap,
  type LucideIcon,
} from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  short: string;
  icon: LucideIcon;
}

const NAV: NavItem[] = [
  { href: "/dashboard", label: "Home", short: "Home", icon: LayoutDashboard },
  { href: "/game", label: "Focus Fest", short: "Games", icon: Gamepad2 },
  { href: "/scheduler", label: "Scheduler", short: "Plan", icon: CalendarCheck },
  { href: "/mood", label: "Mood", short: "Mood", icon: Smile },
  { href: "/journal", label: "Journal", short: "Journal", icon: NotebookPen },
  { href: "/tasks", label: "Tasks", short: "Tasks", icon: ListChecks },
  { href: "/community", label: "Community", short: "People", icon: Users },
];

// Mobile shows a condensed 5-tab bar.
const MOBILE_TABS = ["/dashboard", "/game", "/scheduler", "/mood", "/journal"];

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(href + "/");
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "";

  return (
    <div className="flex min-h-screen bg-[#080808] text-[#ececf0]">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-[214px] flex-shrink-0 flex-col gap-1.5 border-r-2 border-[#111] bg-[#141414] p-4 md:flex">
        <Link href="/dashboard" className="mb-3 flex items-center gap-2.5 px-2 py-1.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[#111]">
            <Zap className="h-[17px] w-[17px] text-[#FFC107]" />
          </span>
          <span className="font-sans text-base font-[900] tracking-tight">
            ADHD<span className="text-[#ED1C24]">APT</span>
          </span>
        </Link>

        <nav className="flex flex-col gap-1.5">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = isActive(pathname, href);
            return (
              <Link
                key={href}
                href={href}
                className={
                  active
                    ? "flex items-center gap-3 rounded-[13px] border-2 border-[#111] bg-[#ED1C24] px-3 py-2.5 text-[13.5px] font-extrabold text-white shadow-[3px_3px_0_#111]"
                    : "flex items-center gap-3 rounded-[13px] px-3 py-2.5 text-[13.5px] font-bold text-[#c98fb0] transition-colors hover:bg-white/50"
                }
              >
                <Icon className="h-[18px] w-[18px]" />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto flex items-center gap-2.5 rounded-2xl bg-white/55 p-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#ED1C24] text-[13px] font-extrabold text-white">
            JR
          </span>
          <span className="leading-tight">
            <span className="block text-[12.5px] font-bold">Jordan</span>
            <span className="block text-[10.5px] font-medium text-[#c98fb0]">
              Individual
            </span>
          </span>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 pb-20 md:pb-0">{children}</main>

      {/* Mobile bottom tab bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t-2 border-[#111] bg-[#141414] px-2 py-3 md:hidden">
        {NAV.filter((n) => MOBILE_TABS.includes(n.href)).map(
          ({ href, short, icon: Icon }) => {
            const active = isActive(pathname, href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex flex-col items-center gap-0.5 ${
                  active ? "text-[#ED1C24]" : "text-[#c98fb0]"
                }`}
              >
                <Icon className="h-[22px] w-[22px]" />
                <span
                  className={`text-[9px] ${
                    active ? "font-extrabold" : "font-semibold"
                  }`}
                >
                  {short}
                </span>
              </Link>
            );
          }
        )}
      </nav>
    </div>
  );
}
