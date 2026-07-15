import type { SupabaseClient } from "@supabase/supabase-js";
import {
  getMoodEntries,
  getJournalNotes,
  getTaskBreakdowns,
  getRole,
  type ScheduleBlock,
} from "@/lib/myspace-storage";

/**
 * One-time migration of a user's pre-backend localStorage data into Supabase.
 * Runs once per user (guarded by a flag) and is a no-op afterwards.
 */
export async function migrateLocalData(sb: SupabaseClient, userId: string): Promise<void> {
  if (typeof window === "undefined" || !userId) return;
  const flag = `adhd-migrated-${userId}`;
  if (localStorage.getItem(flag)) return;
  localStorage.setItem(flag, "1"); // set first so React strict-mode double-mount can't double-insert

  try {
    const moods = getMoodEntries();
    if (moods.length) {
      await sb.from("mood_entries").insert(
        moods.map((m) => ({
          user_id: userId,
          score: m.score,
          emoji: m.emoji,
          label: m.label,
          note: m.note ?? null,
          created_at: m.createdAt,
        }))
      );
    }

    const notes = getJournalNotes();
    if (notes.length) {
      await sb.from("journal_notes").insert(
        notes.map((n) => ({ user_id: userId, body: n.text, prompt: n.prompt ?? null, created_at: n.createdAt }))
      );
    }

    const tasks = getTaskBreakdowns();
    if (tasks.length) {
      await sb.from("task_breakdowns").insert(
        tasks.map((t) => ({ user_id: userId, title: t.title, subtasks: t.subtasks, created_at: t.createdAt }))
      );
    }

    // Schedule is stored as a map { "YYYY-MM-DD": ScheduleBlock[] }.
    const raw = localStorage.getItem("adhd-schedule");
    if (raw) {
      const map = JSON.parse(raw) as Record<string, ScheduleBlock[]>;
      const rows = Object.entries(map)
        .filter(([, blocks]) => blocks?.length)
        .map(([day, blocks]) => ({ user_id: userId, day, blocks }));
      if (rows.length) await sb.from("schedule_days").upsert(rows);
    }

    const role = getRole();
    if (role) await sb.from("user_settings").upsert({ user_id: userId, role });
  } catch (err) {
    console.error("Local data migration failed:", err);
    localStorage.removeItem(flag); // allow a retry on next load
  }
}
