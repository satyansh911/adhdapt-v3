import type { JournalState } from "@/types/journal";

const JOURNAL_STORAGE_KEY = "adhd-journal-state";

export const loadJournalState = (): JournalState | null => {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    const serializedState = localStorage.getItem(JOURNAL_STORAGE_KEY);
    if (serializedState === null) {
      return null;
    }
    const parsedState: JournalState = JSON.parse(serializedState);
    // Ensure mediaItems array exists, default to empty if not present in old state
    if (!parsedState.mediaItems) {
      parsedState.mediaItems = [];
    }
    return parsedState;
  } catch (error) {
    console.error("Error loading journal state from local storage:", error);
    return null;
  }
};

export const saveJournalState = (state: JournalState) => {
  if (typeof window === "undefined") {
    return;
  }
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(JOURNAL_STORAGE_KEY, serializedState);
  } catch (error) {
    console.error("Error saving journal state to local storage:", error);
  }
};
