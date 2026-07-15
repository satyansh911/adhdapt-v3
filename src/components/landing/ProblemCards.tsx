"use client";

import BorderGlow from "@/components/BorderGlow";

interface Problem {
  img: string;
  color: string;
  title: string;
  text: string;
  glow: string[];
}

const PROBLEMS: Problem[] = [
  { img: "/home/task%20paralysis.png", color: "#ff9a9a", title: "Task paralysis", text: "A big to-do stares back and your brain freezes. We break it into the one next tiny step.", glow: ["#ED1C24", "#ED1C24", "#ff5a5f"] },
  { img: "/home/time.png", color: "#8fc0ff", title: "Time blindness", text: "Five minutes or fifty? Visual timers and gentle nudges make time feel real, not scary.", glow: ["#2D8EFF", "#38bdf8", "#8fc0ff"] },
  { img: "/home/calm.png", color: "#f0cf7a", title: "Emotional waves", text: "Big feelings, fast. Mood check-ins and calming sessions help you ride them out kindly.", glow: ["#FFC107", "#F5B000", "#f0cf7a"] },
];

export default function ProblemCards() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-14">
      <h2 className="text-center font-display text-3xl font-extrabold">Why the usual apps fail you</h2>
      <p className="mt-1 text-center text-sm font-medium text-[#a09da8]">
        It&apos;s not a lack of willpower. It&apos;s a mismatch.
      </p>
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {PROBLEMS.map((p) => (
          <BorderGlow
            key={p.title}
            colors={p.glow}
            backgroundColor="#17171b"
            glowIntensity={1.4}
            className="cursor-pointer rounded-3xl transition-transform duration-200 hover:scale-[1.03]"
          >
            <div className="flex flex-col items-center p-6 text-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.img} alt={p.title} className="h-14 w-14 object-contain" />
              <h3 className="mt-4 text-xl font-extrabold" style={{ color: p.color }}>{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#a8a5b0]">{p.text}</p>
            </div>
          </BorderGlow>
        ))}
      </div>
    </section>
  );
}
