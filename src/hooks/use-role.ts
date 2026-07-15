"use client";

import { useEffect, useState } from "react";
import { getRole, setRole as persistRole, type UserRole } from "@/lib/myspace-storage";

/**
 * Reads the onboarding-selected role from localStorage. Returns `undefined`
 * until hydrated so callers can distinguish "not loaded yet" from a value.
 */
export function useRole() {
  const [role, setRoleState] = useState<UserRole | undefined>(undefined);

  useEffect(() => {
    setRoleState(getRole());
  }, []);

  const setRole = (next: UserRole) => {
    persistRole(next);
    setRoleState(next);
  };

  return { role, setRole };
}
