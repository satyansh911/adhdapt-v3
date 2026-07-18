"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useClerk, useUser } from "@clerk/nextjs";
import { useSupabase } from "@/hooks/use-supabase";
import { migrateLocalData } from "@/lib/migrate-local";
import { LogOut, type LucideIcon } from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  short: string;
  icon?: LucideIcon;
  img?: string;
}

const NAV: NavItem[] = [
  { href: "/dashboard", label: "Home", short: "Home", img: "/home/home.png" },
  { href: "/game", label: "Focus Fest", short: "Games", img: "/home/focus%20fest.png" },
  { href: "/scheduler", label: "Scheduler", short: "Plan", img: "/home/scheduler.png" },
  { href: "/mood", label: "Mood", short: "Mood", img: "/home/mood.png" },
  { href: "/journal", label: "Journal", short: "Journal", img: "/home/journal.png" },
  { href: "/tasks", label: "Tasks", short: "Tasks", img: "/home/task%20breakdown.png" },
  { href: "/community", label: "Community", short: "People", img: "/home/community.png" },
];

function NavIcon({ item, className }: { item: NavItem; className: string }) {
  if (item.img) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={item.img} alt="" className={`${className} object-contain`} />;
  }
  const Icon = item.icon!;
  return <Icon className={className} />;
}

// Mobile shows all sections in the tab bar.
const MOBILE_TABS = ["/dashboard", "/game", "/scheduler", "/mood", "/journal", "/tasks", "/community"];

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(href + "/");
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "";
  const router = useRouter();
  const { user } = useUser();
  const { signOut } = useClerk();
  const supabase = useSupabase();
  // Community manages its own full-bleed, fixed-height layout (chat rail +
  // scrollable messages + composer), so it shouldn't get the bottom padding
  // other pages use to clear the fixed mobile tab bar.
  const isFullBleed = pathname.startsWith("/community");

  // One-time import of any pre-backend localStorage data for this user.
  useEffect(() => {
    if (supabase && user?.id) migrateLocalData(supabase, user.id);
  }, [supabase, user?.id]);

  const displayName =
    user?.fullName || user?.firstName || user?.username || "Your space";
  const initials =
    (user?.firstName?.[0] ?? "") + (user?.lastName?.[0] ?? "") ||
    user?.username?.slice(0, 2).toUpperCase() ||
    "ME";

  return (
    <div className="flex min-h-screen bg-[#080808] text-[#ececf0]">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-[214px] flex-shrink-0 flex-col gap-1.5 border-r-2 border-[#111] bg-[#141414] p-4 md:flex">
        <Link href="/dashboard" className="mb-3 flex items-center px-2 py-1.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/home/logo.png" alt="ADHDapt" className="h-9 w-auto" />
        </Link>

        <nav className="flex flex-col gap-1.5">
          {NAV.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={
                  active
                    ? "flex items-center gap-3 rounded-[13px] border-2 border-[#111] bg-[#ED1C24] px-3 py-2.5 text-[13.5px] font-extrabold text-white shadow-[3px_3px_0_#111]"
                    : "flex items-center gap-3 rounded-[13px] px-3 py-2.5 text-[13.5px] font-bold text-[#c98fb0] transition-colors hover:bg-white/50"
                }
              >
                <NavIcon item={item} className="h-[18px] w-[18px]" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto flex items-center gap-2.5 rounded-2xl bg-white/[.06] p-2.5">
          {user?.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.imageUrl} alt={displayName} className="h-9 w-9 flex-shrink-0 rounded-full object-cover" />
          ) : (
            <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#ED1C24] text-[13px] font-extrabold text-white">
              {initials}
            </span>
          )}
          <span className="min-w-0 flex-1 leading-tight">
            <span className="block truncate text-[12.5px] font-bold">{displayName}</span>
            <span className="block truncate text-[10.5px] font-medium text-[#c98fb0]">
              {user?.primaryEmailAddress?.emailAddress ?? "Signed in"}
            </span>
          </span>
          <button
            onClick={() => signOut(() => router.push("/login"))}
            title="Log out"
            aria-label="Log out"
            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-[#c98fb0] transition-colors hover:bg-[#ED1C24] hover:text-white"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className={`min-h-0 flex-1 ${isFullBleed ? "" : "pb-20 md:pb-0"}`}>{children}</main>

      {/* Mobile bottom tab bar — all sections, sized to fit without wrapping */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-between gap-0.5 overflow-x-auto border-t-2 border-[#111] bg-[#141414] px-1.5 py-2 md:hidden">
        {NAV.filter((n) => MOBILE_TABS.includes(n.href)).map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-lg px-0.5 py-1 ${
                active ? "text-[#ED1C24]" : "text-[#c98fb0]"
              }`}
            >
              <NavIcon item={item} className="h-[19px] w-[19px]" />
              <span className={`text-[8px] leading-none ${active ? "font-extrabold" : "font-semibold"}`}>
                {item.short}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
