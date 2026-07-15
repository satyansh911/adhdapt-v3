import { ListChecks, Smile, Gamepad2 } from "lucide-react";
import DotField from "@/components/DotField";
import AuthBox from "@/components/AuthBox";
import LandingMenu from "@/components/landing/LandingMenu";

export const metadata = { title: "Login · ADHDapt" };
export const dynamic = "force-dynamic";

const POINTS = [
  { icon: ListChecks, text: "Break scary tasks into tiny, doable steps." },
  { icon: Smile, text: "Check in with your mood and calm the noise." },
  { icon: Gamepad2, text: "Train focus with playful, low-pressure games." },
];

export default function LoginPage() {
  return (
    <div className="relative h-dvh w-full overflow-hidden bg-[#080808] text-[#ececf0]">
      {/* Top navbar (logo + menu) */}
      <LandingMenu />

      {/* Subtle dot-field backdrop */}
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <DotField />
      </div>

      <div className="relative z-10 mx-auto flex h-full max-w-6xl items-stretch px-6">
        {/* Left — copy (desktop only) */}
        <div className="hidden flex-1 flex-col justify-center gap-6 pr-10 lg:flex">
          <h1 className="font-display text-4xl font-extrabold leading-tight">
            Your calmer system for the ADHD brain.
          </h1>
          <p className="max-w-md text-[15px] leading-relaxed text-[#a8a5b0]">
            Tools that reward you, never shame you. Log in to pick up right where you left off.
          </p>
          <ul className="flex flex-col gap-3">
            {POINTS.map((p) => (
              <li key={p.text} className="flex items-center gap-3 text-sm font-medium text-[#c9c7d0]">
                <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-[#ED1C24]/15">
                  <p.icon className="h-[18px] w-[18px] text-[#ED1C24]" />
                </span>
                {p.text}
              </li>
            ))}
          </ul>
        </div>

        {/* Right — auth box (only this swaps between sign-in / sign-up).
            Scrolls from the top (with navbar clearance) when the form is tall,
            centers when it fits. */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="flex min-h-full items-center justify-center px-1 pb-10 pt-24 lg:pt-20">
            <div className="w-full max-w-[26rem]">
              <AuthBox />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
