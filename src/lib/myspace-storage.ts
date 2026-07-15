// Lightweight localStorage-backed persistence for the mySpace surfaces.
// Mirrors the existing journal approach (see local-storage-utils.ts) — no
// backend yet, so every module reads/writes a namespaced key on the client.

export type UserRole = "individual" | "parent" | "therapist";

export interface MoodEntry {
  id: string;
  /** 1 (stormy) – 5 (sunny). */
  score: number;
  emoji: string;
  label: string;
  note?: string;
  createdAt: string; // ISO
}

export interface SubTask {
  id: string;
  title: string;
  done: boolean;
}

export interface TaskBreakdown {
  id: string;
  title: string;
  subtasks: SubTask[];
  createdAt: string; // ISO
}

export interface JournalNote {
  id: string;
  text: string;
  prompt?: string;
  createdAt: string; // ISO
}

const KEYS = {
  role: "adhd-user-role",
  mood: "adhd-mood-entries",
  tasks: "adhd-task-breakdowns",
  journal: "adhd-journal-notes",
} as const;

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch (err) {
    console.error(`Failed to read ${key} from localStorage`, err);
    return fallback;
  }
}

function write<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Failed to write ${key} to localStorage`, err);
  }
}

export const getRole = (): UserRole => read<UserRole>(KEYS.role, "individual");
export const setRole = (role: UserRole) => write(KEYS.role, role);

export const getMoodEntries = (): MoodEntry[] => read<MoodEntry[]>(KEYS.mood, []);
export const saveMoodEntries = (entries: MoodEntry[]) => write(KEYS.mood, entries);

export const getTaskBreakdowns = (): TaskBreakdown[] =>
  read<TaskBreakdown[]>(KEYS.tasks, []);
export const saveTaskBreakdowns = (tasks: TaskBreakdown[]) =>
  write(KEYS.tasks, tasks);

export const getJournalNotes = (): JournalNote[] =>
  read<JournalNote[]>(KEYS.journal, []);
export const saveJournalNotes = (notes: JournalNote[]) =>
  write(KEYS.journal, notes);

export const storageKeys = KEYS;
