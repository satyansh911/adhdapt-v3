"use client";

import Link from "next/link";
import { Zap, Lock, type LucideIcon } from "lucide-react";
import { useRole } from "@/hooks/use-role";
import type { UserRole } from "@/lib/myspace-storage";

export interface RoleNavItem {
  label: string;
  icon: LucideIcon;
  active?: boolean;
}

interface RoleShellProps {
  role: Exclude<UserRole, "individual">;
  label: string; // e.g. "Parent view"
  accent: string; // active-item color
  sidebarBg: string;
  nav: RoleNavItem[];
  user: { initials: string; name: string; sub: string };
  children: React.ReactNode;
}

/**
 * Simplified sidebar shell for the Parent / Therapist surfaces. Gates content
 * behind the onboarding-selected role — if the stored role doesn't match, it
 * shows a gentle switch prompt instead of the dashboard (role gating per spec).
 */
export default function RoleShell({
  role,
  label,
  accent,
  sidebarBg,
  nav,
  user,
  children,
}: RoleShellProps) {
  const { role: current, setRole } = useRole();

  return (
    <div className="flex min-h-screen bg-[#080808] text-[#ececf0]">
      <aside
        className="sticky top-0 hidden h-screen w-[214px] flex-shrink-0 flex-col gap-1.5 border-r border-white/[.07] p-4 md:flex"
        style={{ background: sidebarBg }}
      >
        <Link href="/dashboard" className="mb-2 flex items-center gap-2.5 px-2 py-1.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[#111]">
            <Zap className="h-[17px] w-[17px] text-[#FFC107]" />
          </span>
          <span className="text-base font-[900] tracking-tight">
            ADHD<span className="text-[#ED1C24]">APT</span>
          </span>
        </Link>
        <div className="px-3 pb-2 pt-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#9aa7bd]">
          {label}
        </div>
        {nav.map(({ label: l, icon: Icon, active }) => (
          <div
            key={l}
            className={
              active
                ? "flex items-center gap-3 rounded-[13px] px-3 py-2.5 text-[13.5px] font-extrabold text-white"
                : "flex items-center gap-3 rounded-[13px] px-3 py-2.5 text-[13.5px] font-bold text-[#9aa7bd]"
            }
            style={active ? { background: accent } : undefined}
          >
            <Icon className="h-[18px] w-[18px]" /> {l}
          </div>
        ))}
        <div className="mt-auto flex items-center gap-2.5 rounded-2xl bg-white/70 p-2.5">
          <span
            className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-extrabold text-white"
            style={{ background: accent }}
          >
            {user.initials}
          </span>
          <span className="leading-tight">
            <span className="block text-[12.5px] font-bold">{user.name}</span>
            <span className="block text-[10.5px] font-medium text-[#9aa7bd]">{user.sub}</span>
          </span>
        </div>
      </aside>

      <main className="flex-1">
        {current === undefined ? null : current === role ? (
          children
        ) : (
          <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#2D8EFF]/[.14]">
              <Lock className="h-7 w-7 text-[#2D8EFF]" />
            </span>
            <h1 className="mt-5 font-display text-3xl font-extrabold">This is the {label.toLowerCase()}</h1>
            <p className="mt-3 max-w-sm text-sm text-[#9aa7bd]">
              You&apos;re currently in <b>{current}</b> mode. Switch roles to preview this dashboard —
              you can change it back anytime in onboarding.
            </p>
            <button
              onClick={() => setRole(role)}
              className="mt-6 rounded-2xl px-6 py-3 text-sm font-extrabold text-white shadow-[3px_3px_0_#111]"
              style={{ background: accent }}
            >
              Switch to {role} view
            </button>
            <Link href="/login" className="mt-3 text-xs font-bold text-[#2D8EFF]">
              Go to login
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
