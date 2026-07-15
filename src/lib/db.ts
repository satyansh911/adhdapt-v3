import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  MoodEntry,
  JournalNote,
  TaskBreakdown,
  SubTask,
  ScheduleBlock,
  UserRole,
} from "@/lib/myspace-storage";

type SB = SupabaseClient;

// ------------------------------ MOOD ---------------------------------------
export async function listMoods(sb: SB, userId: string): Promise<MoodEntry[]> {
  const { data } = await sb
    .from("mood_entries")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  return (data ?? []).map((r) => ({
    id: r.id,
    score: r.score,
    emoji: r.emoji,
    label: r.label,
    note: r.note ?? undefined,
    createdAt: r.created_at,
  }));
}

export async function addMood(
  sb: SB,
  userId: string,
  e: { score: number; emoji: string; label: string; note?: string }
): Promise<MoodEntry | null> {
  const { data } = await sb
    .from("mood_entries")
    .insert({ user_id: userId, score: e.score, emoji: e.emoji, label: e.label, note: e.note ?? null })
    .select()
    .single();
  return data
    ? { id: data.id, score: data.score, emoji: data.emoji, label: data.label, note: data.note ?? undefined, createdAt: data.created_at }
    : null;
}

// ------------------------------ JOURNAL ------------------------------------
export async function listJournal(sb: SB, userId: string): Promise<JournalNote[]> {
  const { data } = await sb
    .from("journal_notes")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  return (data ?? []).map((r) => ({
    id: r.id,
    text: r.body,
    prompt: r.prompt ?? undefined,
    createdAt: r.created_at,
  }));
}

export async function addJournal(
  sb: SB,
  userId: string,
  n: { text: string; prompt?: string }
): Promise<JournalNote | null> {
  const { data } = await sb
    .from("journal_notes")
    .insert({ user_id: userId, body: n.text, prompt: n.prompt ?? null })
    .select()
    .single();
  return data ? { id: data.id, text: data.body, prompt: data.prompt ?? undefined, createdAt: data.created_at } : null;
}

// ------------------------------ TASKS --------------------------------------
export async function listTasks(sb: SB, userId: string): Promise<TaskBreakdown[]> {
  const { data } = await sb
    .from("task_breakdowns")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  return (data ?? []).map((r) => ({
    id: r.id,
    title: r.title,
    subtasks: (r.subtasks ?? []) as SubTask[],
    createdAt: r.created_at,
  }));
}

export async function createTask(sb: SB, userId: string, title: string): Promise<TaskBreakdown | null> {
  const { data } = await sb
    .from("task_breakdowns")
    .insert({ user_id: userId, title, subtasks: [] })
    .select()
    .single();
  return data ? { id: data.id, title: data.title, subtasks: (data.subtasks ?? []) as SubTask[], createdAt: data.created_at } : null;
}

export async function updateTaskSubtasks(sb: SB, userId: string, taskId: string, subtasks: SubTask[]): Promise<void> {
  await sb.from("task_breakdowns").update({ subtasks }).eq("id", taskId).eq("user_id", userId);
}

export async function deleteTask(sb: SB, userId: string, taskId: string): Promise<void> {
  await sb.from("task_breakdowns").delete().eq("id", taskId).eq("user_id", userId);
}

// ------------------------------ SCHEDULE -----------------------------------
export async function getScheduleDay(sb: SB, userId: string, dayKey: string): Promise<ScheduleBlock[]> {
  const { data } = await sb
    .from("schedule_days")
    .select("blocks")
    .eq("user_id", userId)
    .eq("day", dayKey)
    .maybeSingle();
  return ((data?.blocks as ScheduleBlock[]) ?? []);
}

export async function saveScheduleDay(sb: SB, userId: string, dayKey: string, blocks: ScheduleBlock[]): Promise<void> {
  await sb
    .from("schedule_days")
    .upsert({ user_id: userId, day: dayKey, blocks, updated_at: new Date().toISOString() });
}

// ------------------------------ SETTINGS -----------------------------------
export async function getRole(sb: SB, userId: string): Promise<UserRole> {
  const { data } = await sb.from("user_settings").select("role").eq("user_id", userId).maybeSingle();
  return (data?.role as UserRole) ?? "individual";
}

export async function setRole(sb: SB, userId: string, role: UserRole): Promise<void> {
  await sb.from("user_settings").upsert({ user_id: userId, role, updated_at: new Date().toISOString() });
}
