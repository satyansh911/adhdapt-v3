"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Send, Hash, Users, MessageCircle, Loader2, WifiOff } from "lucide-react";
import { useSupabase, isSupabaseConfigured } from "@/hooks/use-supabase";

interface Message {
  id: string;
  channel: string;
  author_id: string;
  author_name: string;
  body: string;
  created_at: string;
}
interface Profile {
  id: string;
  name: string;
}

const GROUPS = [
  { slug: "inattentive", label: "Inattentive", color: "#2D8EFF" },
  { slug: "hyperactive", label: "Hyperactive", color: "#ED1C24" },
  { slug: "combined", label: "Combined", color: "#f5934f" },
  { slug: "time-blind", label: "Time-Blind Club", color: "#F5B000" },
  { slug: "body-doubling", label: "Body-Doubling", color: "#0d5b5e" },
];

const dmChannel = (a: string, b: string) => `dm:${[a, b].sort().join("__")}`;
const initials = (name: string) =>
  name.trim().split(/\s+/).map((p) => p[0]).slice(0, 2).join("").toUpperCase() || "?";

function relTime(iso: string) {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return "now";
  if (s < 3600) return `${Math.floor(s / 60)}m`;
  if (s < 86400) return `${Math.floor(s / 3600)}h`;
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function CommunityPage() {
  const { user } = useUser();
  const supabase = useSupabase();
  const myId = user?.id ?? "";
  const myName = user?.fullName || user?.firstName || user?.username || "You";

  const [selected, setSelected] = useState("general");
  const [messages, setMessages] = useState<Message[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Register my profile + load the directory (for DMs).
  useEffect(() => {
    if (!supabase || !myId) return;
    supabase.from("profiles").upsert({ id: myId, name: myName, updated_at: new Date().toISOString() }).then(() => {});
    supabase
      .from("profiles")
      .select("id,name")
      .then(({ data }) => data && setProfiles(data as Profile[]));
  }, [supabase, myId, myName]);

  // Load history + subscribe to realtime for the selected channel.
  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setMessages([]);

    supabase
      .from("messages")
      .select("*")
      .eq("channel", selected)
      .order("created_at", { ascending: true })
      .limit(300)
      .then(({ data }) => {
        if (!cancelled) {
          setMessages((data as Message[]) ?? []);
          setLoading(false);
        }
      });

    const ch = supabase
      .channel(`realtime:${selected}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `channel=eq.${selected}` },
        (payload) => setMessages((prev) => [...prev, payload.new as Message])
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase?.removeChannel(ch);
    };
  }, [supabase, selected]);

  // Auto-scroll to newest.
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = useCallback(async () => {
    const body = draft.trim();
    if (!body || !supabase || !myId) return;
    setSending(true);
    setDraft("");
    const { error } = await supabase.from("messages").insert({
      channel: selected,
      author_id: myId,
      author_name: myName,
      body,
    });
    if (error) setDraft(body); // restore on failure
    setSending(false);
  }, [supabase, draft, selected, myId, myName]);

  const dmPartners = profiles.filter((p) => p.id !== myId);

  const channelTitle = () => {
    if (selected === "general") return "# General";
    if (selected.startsWith("room:")) {
      const g = GROUPS.find((x) => `room:${x.slug}` === selected);
      return `# ${g?.label ?? "Room"}`;
    }
    if (selected.startsWith("dm:")) {
      const otherId = selected.slice(3).split("__").find((id) => id !== myId);
      const p = profiles.find((x) => x.id === otherId);
      return `@ ${p?.name ?? "Direct message"}`;
    }
    return "";
  };

  // ---- Not configured fallback ----
  if (!isSupabaseConfigured) {
    return (
      <div className="mx-auto max-w-lg px-6 py-16 text-center">
        <WifiOff className="mx-auto h-10 w-10 text-[#8b8892]" />
        <h1 className="mt-4 font-display text-2xl font-extrabold">Community isn&apos;t connected yet</h1>
        <p className="mt-2 text-sm text-[#9a97a3]">
          Set <code className="text-[#ED1C24]">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
          <code className="text-[#ED1C24]">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>, then run the schema in{" "}
          <code>supabase/schema.sql</code>.
        </p>
      </div>
    );
  }

  const ChannelBtn = ({ id, label, color, icon: Icon }: { id: string; label: string; color?: string; icon: typeof Hash }) => {
    const active = selected === id;
    return (
      <button
        onClick={() => setSelected(id)}
        className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm font-bold transition-colors ${
          active ? "bg-[#ED1C24] text-white" : "text-[#c98fb0] hover:bg-white/5"
        }`}
      >
        <Icon className="h-4 w-4 flex-shrink-0" style={!active && color ? { color } : undefined} />
        <span className="truncate">{label}</span>
      </button>
    );
  };

  return (
    // Mobile: leave room for the fixed bottom tab bar so the composer never
    // ends up hidden underneath it. Desktop has no bottom bar, so it takes the
    // full viewport height. (Underscores are required inside Tailwind's
    // arbitrary calc() so the CSS keeps the whitespace around the minus.)
    <div className="flex h-[calc(100dvh_-_3.5rem)] flex-col md:h-dvh md:flex-row">
      {/* Channel rail */}
      <aside className="flex-shrink-0 border-b border-white/10 bg-[#141414] p-3 md:h-full md:w-64 md:overflow-y-auto md:border-b-0 md:border-r">
        <h1 className="px-1 py-2 font-display text-2xl font-extrabold">Community</h1>

        <div className="mt-1 flex gap-1 overflow-x-auto md:flex-col md:overflow-visible">
          <div className="min-w-max md:min-w-0">
            <ChannelBtn id="general" label="General" icon={Hash} />
          </div>

          <div className="hidden px-1 pb-1 pt-3 text-[10px] font-bold uppercase tracking-wider text-[#8b8892] md:block">
            Group rooms
          </div>
          {GROUPS.map((g) => (
            <div key={g.slug} className="min-w-max md:min-w-0">
              <ChannelBtn id={`room:${g.slug}`} label={g.label} color={g.color} icon={Users} />
            </div>
          ))}

          <div className="hidden px-1 pb-1 pt-3 text-[10px] font-bold uppercase tracking-wider text-[#8b8892] md:block">
            Direct messages
          </div>
          {dmPartners.map((p) => (
            <div key={p.id} className="min-w-max md:min-w-0">
              <ChannelBtn id={dmChannel(myId, p.id)} label={p.name} icon={MessageCircle} />
            </div>
          ))}
          {dmPartners.length === 0 && (
            <p className="hidden px-2 py-1 text-[11px] text-[#6a6774] md:block">
              Others appear here once they open Community.
            </p>
          )}
        </div>
      </aside>

      {/* Chat pane */}
      <section className="flex min-h-0 flex-1 flex-col">
        <header className="flex-shrink-0 border-b border-white/10 px-5 py-3">
          <h2 className="text-lg font-extrabold">{channelTitle()}</h2>
        </header>

        <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-5 py-4">
          {loading ? (
            <div className="m-auto flex items-center gap-2 text-sm text-[#8b8892]">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading messages…
            </div>
          ) : messages.length === 0 ? (
            <div className="m-auto text-center text-sm text-[#8b8892]">
              No messages yet — say hi and start the conversation. 🌱
            </div>
          ) : (
            messages.map((m) => {
              const mine = m.author_id === myId;
              return (
                <div key={m.id} className={`flex items-end gap-2.5 ${mine ? "flex-row-reverse" : ""}`}>
                  <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-[11px] font-extrabold text-white" style={{ background: mine ? "#ED1C24" : "#2D8EFF" }}>
                    {initials(m.author_name)}
                  </span>
                  <div className={`max-w-[75%] ${mine ? "text-right" : ""}`}>
                    <div className="mb-0.5 text-[11px] font-medium text-[#8b8892]">
                      {mine ? "You" : m.author_name} · {relTime(m.created_at)}
                    </div>
                    <div
                      className={`inline-block rounded-2xl px-3.5 py-2 text-[14px] leading-snug ${
                        mine ? "bg-[#ED1C24] text-white" : "bg-[#17171b] text-[#e9e7ef]"
                      }`}
                    >
                      {m.body}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={bottomRef} />
        </div>

        {/* Composer */}
        <div className="flex-shrink-0 border-t border-white/10 p-3">
          <div className="flex gap-2">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
              placeholder={`Message ${channelTitle()}…`}
              className="flex-1 rounded-xl bg-[#080808] px-4 py-3 text-sm outline-none"
            />
            <button
              onClick={send}
              disabled={sending || !draft.trim()}
              className="flex items-center justify-center rounded-xl bg-[#ED1C24] px-4 text-white disabled:opacity-40"
            >
              {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
