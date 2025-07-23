"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { v4 as uuidv4 } from "uuid";
import type {
  JournalEntry,
  Collection,
  Mood,
  MediaItem,
} from "@/types/journal";
import { loadJournalState, saveJournalState } from "@/lib/local-storage-utils";

interface JournalContextType {
  entries: JournalEntry[];
  collections: Collection[];
  moods: Mood[];
  mediaItems: MediaItem[]; // Added mediaItems
  addEntry: (
    entry: Omit<JournalEntry, "id" | "createdAt" | "updatedAt" | "publishedAt">
  ) => void;
  updateEntry: (id: string, updates: Partial<JournalEntry>) => void;
  deleteEntry: (id: string) => void;
  addCollection: (name: string) => void;
  updateCollection: (id: string, name: string) => void;
  deleteCollection: (id: string) => void;
  addMood: (name: string, color: string, icon?: string) => void;
  addMediaItem: (item: Omit<MediaItem, "id" | "createdAt">) => void; // Added addMediaItem
  getCollectionName: (id: string | null) => string;
  getMoodById: (id: string | null) => Mood | undefined;
}

const JournalContext = createContext<JournalContextType | undefined>(undefined);

const DEFAULT_MOODS: Mood[] = [
  {
    id: uuidv4(),
    name: "Happy",
    color: "bg-green-100 text-green-800",
    icon: "Smile",
  },
  {
    id: uuidv4(),
    name: "Anxious",
    color: "bg-yellow-100 text-yellow-800",
    icon: "Frown",
  },
  {
    id: uuidv4(),
    name: "Tired",
    color: "bg-gray-100 text-gray-800",
    icon: "Moon",
  },
  {
    id: uuidv4(),
    name: "Focused",
    color: "bg-blue-100 text-blue-800",
    icon: "Target",
  },
  {
    id: uuidv4(),
    name: "Neutral",
    color: "bg-purple-100 text-purple-800",
    icon: "Meh",
  },
  {
    id: uuidv4(),
    name: "Energetic",
    color: "bg-orange-100 text-orange-800",
    icon: "Zap",
  },
  {
    id: uuidv4(),
    name: "Calm",
    color: "bg-teal-100 text-teal-800",
    icon: "Leaf",
  },
];

const DEFAULT_COLLECTIONS: Collection[] = [
  { id: uuidv4(), name: "Daily Reflections" },
  { id: uuidv4(), name: "Ideas & Brainstorms" },
];

export const JournalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [moods, setMoods] = useState<Mood[]>([]);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]); // New state for media
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const storedState = loadJournalState();
    if (storedState) {
      setEntries(storedState.entries || []);
      setCollections(storedState.collections || DEFAULT_COLLECTIONS);
      setMoods(storedState.moods || DEFAULT_MOODS);
      setMediaItems(storedState.mediaItems || []); // Load media items
    } else {
      setCollections(DEFAULT_COLLECTIONS);
      setMoods(DEFAULT_MOODS);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      saveJournalState({ entries, collections, moods, mediaItems }); // Save media items
    }
  }, [entries, collections, moods, mediaItems, isLoaded]);

  const addEntry = useCallback(
    (
      entry: Omit<
        JournalEntry,
        "id" | "createdAt" | "updatedAt" | "publishedAt"
      >
    ) => {
      const now = new Date().toISOString();
      const newEntry: JournalEntry = {
        ...entry,
        id: uuidv4(),
        createdAt: now,
        updatedAt: now,
        publishedAt: entry.status === "published" ? now : null,
      };
      setEntries((prev) => [newEntry, ...prev]);
    },
    []
  );

  const updateEntry = useCallback(
    (id: string, updates: Partial<JournalEntry>) => {
      setEntries((prev) =>
        prev.map((entry) => {
          if (entry.id === id) {
            const updatedEntry = {
              ...entry,
              ...updates,
              updatedAt: new Date().toISOString(),
            };
            if (
              updates.status === "published" &&
              entry.status !== "published"
            ) {
              updatedEntry.publishedAt = new Date().toISOString();
            }
            return updatedEntry;
          }
          return entry;
        })
      );
    },
    []
  );

  const deleteEntry = useCallback((id: string) => {
    setEntries((prev) => prev.filter((entry) => entry.id !== id));
  }, []);

  const addCollection = useCallback((name: string) => {
    setCollections((prev) => [...prev, { id: uuidv4(), name }]);
  }, []);

  const updateCollection = useCallback((id: string, name: string) => {
    setCollections((prev) =>
      prev.map((collection) =>
        collection.id === id ? { ...collection, name } : collection
      )
    );
  }, []);

  const deleteCollection = useCallback((id: string) => {
    setCollections((prev) => prev.filter((collection) => collection.id !== id));
    setEntries((prev) =>
      prev.map((entry) =>
        entry.collectionId === id ? { ...entry, collectionId: null } : entry
      )
    );
  }, []);

  const addMood = useCallback((name: string, color: string, icon?: string) => {
    setMoods((prev) => [...prev, { id: uuidv4(), name, color, icon }]);
  }, []);

  const addMediaItem = useCallback(
    (item: Omit<MediaItem, "id" | "createdAt">) => {
      const now = new Date().toISOString();
      const newItem: MediaItem = {
        ...item,
        id: uuidv4(),
        createdAt: now,
      };
      setMediaItems((prev) => [newItem, ...prev]);
    },
    []
  );

  const getCollectionName = useCallback(
    (id: string | null) => {
      if (!id) return "No Collection";
      const collection = collections.find((c) => c.id === id);
      return collection ? collection.name : "Unknown Collection";
    },
    [collections]
  );

  const getMoodById = useCallback(
    (id: string | null) => {
      if (!id) return undefined;
      return moods.find((m) => m.id === id);
    },
    [moods]
  );

  const value = React.useMemo(
    () => ({
      entries,
      collections,
      moods,
      mediaItems, // Added to context value
      addEntry,
      updateEntry,
      deleteEntry,
      addCollection,
      updateCollection,
      deleteCollection,
      addMood,
      addMediaItem, // Added to context value
      getCollectionName,
      getMoodById,
    }),
    [
      entries,
      collections,
      moods,
      mediaItems,
      addEntry,
      updateEntry,
      deleteEntry,
      addCollection,
      updateCollection,
      deleteCollection,
      addMood,
      addMediaItem,
      getCollectionName,
      getMoodById,
    ]
  );

  return (
    <JournalContext.Provider value={value}>{children}</JournalContext.Provider>
  );
};

export const useJournal = () => {
  const context = useContext(JournalContext);
  if (context === undefined) {
    throw new Error("useJournal must be used within a JournalProvider");
  }
  return context;
};
