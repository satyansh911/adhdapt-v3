export interface Mood {
  id: string;
  name: string;
  color: string; // Tailwind color class, e.g., "bg-green-100 text-green-800"
  icon?: string; // Lucide icon name, e.g., "Smile"
}

export interface Collection {
  id: string;
  name: string;
}

export interface JournalEntry {
  id: string;
  title: string;
  content: string; // HTML content from rich text editor
  moodId: string | null;
  collectionId: string | null;
  status: "draft" | "published"; // 'draft' or 'published'
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  publishedAt: string | null; // ISO date string
}

export interface MediaItem {
  id: string;
  url: string; // Cloudinary URL
  publicId: string; // Cloudinary public ID
  type: "image" | "video";
  createdAt: string; // ISO date string
}

export interface JournalState {
  entries: JournalEntry[];
  collections: Collection[];
  moods: Mood[];
  mediaItems: MediaItem[]; // Added media items
}
