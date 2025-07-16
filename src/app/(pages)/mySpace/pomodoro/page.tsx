import ADHDDashboard from "@/components/pomodoro/adhd-dashboard";

export default function Page() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700">
      <ADHDDashboard />
    </div>
  );
}
