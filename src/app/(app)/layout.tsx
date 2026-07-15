import AppShell from "@/components/myspace/AppShell";

// Shared shell for every signed-in mySpace surface (dashboard, scheduler,
// mood, journal, tasks, community). The Game route and public pages live
// outside this group so they keep their own chrome.
export default function AppGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell>{children}</AppShell>;
}
