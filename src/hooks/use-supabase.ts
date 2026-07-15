"use client";

import { useMemo } from "react";
import { useSession } from "@clerk/nextjs";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(url && anonKey);

/**
 * A Supabase client whose every request carries the current Clerk session
 * token (native third-party-auth integration). Postgres RLS can then read
 * `auth.jwt()->>'sub'` (the Clerk user id) to enforce ownership + private DMs.
 *
 * Requires: Clerk's Supabase integration enabled, and Clerk added as a
 * Third-Party Auth provider in the Supabase dashboard.
 */
export function useSupabase(): SupabaseClient | null {
  const { session } = useSession();

  return useMemo(() => {
    if (!url || !anonKey) return null;
    return createClient(url, anonKey, {
      accessToken: async () => (await session?.getToken()) ?? null,
      realtime: { params: { eventsPerSecond: 10 } },
    });
    // Re-create when the Clerk session identity changes.
  }, [session]);
}
