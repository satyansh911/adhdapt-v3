"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useSupabase } from "@/hooks/use-supabase";
import { getRole as dbGetRole, setRole as dbSetRole } from "@/lib/db";
import type { UserRole } from "@/lib/myspace-storage";

/**
 * The onboarding-selected role, persisted per-user in Supabase (user_settings).
 * `role` is `undefined` until loaded so callers can distinguish "loading" from
 * a value.
 */
export function useRole() {
  const supabase = useSupabase();
  const { user } = useUser();
  const uid = user?.id;
  const [role, setRoleState] = useState<UserRole | undefined>(undefined);

  useEffect(() => {
    if (!supabase || !uid) return;
    dbGetRole(supabase, uid).then(setRoleState);
  }, [supabase, uid]);

  const setRole = (next: UserRole) => {
    setRoleState(next);
    if (supabase && uid) dbSetRole(supabase, uid, next);
  };

  return { role, setRole };
}
