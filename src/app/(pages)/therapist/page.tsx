"use client";

import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  Target,
  ShieldCheck,
  NotebookPen,
} from "lucide-react";
import RoleShell from "@/components/myspace/RoleShell";

interface Client {
  id: string;
  name: string;
  initials: string;
  color: string;
  status: string;
  consent: "shared" | "pending";
  mood: number[];
  focusSessions: number;
  taskCompletion: number;
  goals: string[];
}

const CLIENTS: Client[] = [
  { id: "al", name: "Alex L.", initials: "AL", color: "#0d5b5e", status: "Active · shared", consent: "shared", mood: [50, 62, 58, 70, 66, 74, 80], focusSessions: 18, taskCompletion: 72, goals: ["Morning routine 4×/week", "Use focus timer before overwhelm"] },
  { id: "mr", name: "Mia R.", initials: "MR", color: "#ED1C24", status: "Session Fri", consent: "shared", mood: [40, 45, 55, 48, 60, 58, 64], focusSessions: 11, taskCompletion: 55, goals: ["Body-double 2×/week", "Journal after hard days"] },
  { id: "jt", name: "Jae T.", initials: "JT", color: "#F5B000", status: "Consent pending", consent: "pending", mood: [], focusSessions: 0, taskCompletion: 0, goals: [] },
  { id: "sm", name: "Sam M.", initials: "SM", color: "#2D8EFF", status: "Active · shared", consent: "shared", mood: [60, 55, 62, 68, 65, 70, 72], focusSessions: 21, taskCompletion: 81, goals: ["Break big tasks into ≤5 steps"] },
];

export default function TherapistPage() {
  const [selectedId, setSelectedId] = useState("al");
  const [notes, setNotes] = useState("");
  const client = CLIENTS.find((c) => c.id === selectedId)!;

  return (
    <RoleShell
      role="therapist"
      label="Therapist view"
      accent="#0d5b5e"
      sidebarBg="#191921"
      user={{ initials: "DR", name: "Dr. Okafor", sub: "Therapist · 8 clients" }}
      nav={[
        { label: "Dashboard", icon: LayoutDashboard, active: true },
        { label: "Clients", icon: Users },
        { label: "Shared goals", icon: Target },
        { label: "Consent log", icon: ShieldCheck },
      ]}
    >
      <div className="flex flex-col lg:flex-row">
        {/* Client list */}
        <div className="border-b border-white/[.08] bg-[#17171b] p-4 lg:w-[250px] lg:border-b-0 lg:border-r">
          <div className="mb-3 text-[11px] font-bold uppercase tracking-[0.12em] text-[#93a0a0]">
            Clients · {CLIENTS.length}
          </div>
          <div className="flex gap-2 overflow-x-auto lg:flex-col">
            {CLIENTS.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedId(c.id)}
                className={`flex flex-shrink-0 items-center gap-3 rounded-2xl px-3 py-2.5 ${
                  c.id === selectedId ? "border border-[#0d5b5e]/15 bg-[#8acfd1]/[.14]" : ""
                }`}
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full text-[13px] font-extrabold text-white" style={{ background: c.color }}>
                  {c.initials}
                </span>
                <span className="text-left">
                  <span className="block text-[13px] font-extrabold">{c.name}</span>
                  <span className="block text-[10.5px] font-medium text-[#93a0a0]">{c.status}</span>
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Selected client */}
        <div className="flex-1 p-6 md:p-8">
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 items-center justify-center rounded-[18px] text-xl font-extrabold text-white" style={{ background: client.color }}>
              {client.initials}
            </span>
            <div>
              <h1 className="font-display text-3xl font-extrabold leading-none">{client.name}</h1>
              <span
                className={`mt-1.5 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ${
                  client.consent === "shared" ? "bg-[#8acfd1]/[.14] text-[#0d5b5e]" : "bg-[#FFC107]/[.12] text-[#c99b3f]"
                }`}
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                {client.consent === "shared" ? "Sharing trends with consent" : "Consent pending"}
              </span>
            </div>
          </div>

          {client.consent === "pending" ? (
            <div className="hoverable mt-8 rounded-3xl border border-dashed border-white/12 bg-[#17171b] p-10 text-center text-sm text-[#8b8892]">
              {client.name} hasn&apos;t shared their data yet. You&apos;ll see trends here once they consent. 🤝
            </div>
          ) : (
            <>
              {/* Shared trends */}
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div className="hoverable rounded-3xl bg-[#17171b] p-5 shadow-[0_12px_30px_-22px_rgba(13,91,94,.5)]">
                  <div className="text-[30px] font-[900] text-[#0d5b5e]">{client.focusSessions}</div>
                  <div className="mt-1 text-xs font-semibold text-[#9aa7bd]">focus sessions / mo</div>
                </div>
                <div className="hoverable rounded-3xl bg-[#17171b] p-5 shadow-[0_12px_30px_-22px_rgba(13,91,94,.5)]">
                  <div className="text-[30px] font-[900] text-[#2D8EFF]">{client.taskCompletion}%</div>
                  <div className="mt-1 text-xs font-semibold text-[#9aa7bd]">task completion</div>
                </div>
                <div className="hoverable rounded-3xl bg-[#17171b] p-5 shadow-[0_12px_30px_-22px_rgba(13,91,94,.5)]">
                  <div className="flex h-[38px] items-end gap-1">
                    {client.mood.map((h, i) => (
                      <div key={i} className="flex-1 rounded-t-sm bg-[#8acfd1]" style={{ height: `${h}%` }} />
                    ))}
                  </div>
                  <div className="mt-1 text-xs font-semibold text-[#9aa7bd]">mood trend (7d)</div>
                </div>
              </div>

              {/* Goals + notes */}
              <div className="mt-5 flex flex-col gap-5 lg:flex-row">
                <div className="flex-1 rounded-3xl bg-[#8acfd1]/[.14] p-6">
                  <div className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-[#0d5b5e]" />
                    <h3 className="text-[17px] font-extrabold">Shared goals</h3>
                  </div>
                  <ul className="mt-4 space-y-2">
                    {client.goals.map((g) => (
                      <li key={g} className="flex items-center gap-2 rounded-2xl bg-[#17171b] px-4 py-3 text-[13px] font-medium">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#0d5b5e]" /> {g}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="hoverable w-full flex-shrink-0 rounded-3xl bg-[#17171b] p-6 shadow-[0_12px_30px_-22px_rgba(13,91,94,.5)] lg:w-[360px]">
                  <div className="flex items-center gap-2">
                    <NotebookPen className="h-5 w-5 text-[#ED1C24]" />
                    <h3 className="text-[17px] font-extrabold">Private session notes</h3>
                  </div>
                  <p className="mt-1 text-[11px] font-medium text-[#9aa7bd]">Only you can see these.</p>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={5}
                    placeholder="Notes from your last session…"
                    className="mt-3 w-full resize-none rounded-2xl border border-white/10 bg-[#080808] p-3.5 text-sm outline-none focus:border-[#0d5b5e]"
                  />
                  <button className="mt-3 rounded-xl bg-[#0d5b5e] px-5 py-2.5 text-xs font-extrabold text-white">
                    Save note
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </RoleShell>
  );
}
