"use client";

import BorderGlow from "@/components/BorderGlow";

interface Module {
  img: string;
  title: string;
  sub: string;
  desc: string;
  color: string;
  glow: string[];
}

const MODULES: Module[] = [
  { img: "/home/focus%20fest.png", title: "Focus Fest", sub: "Brain-training games", desc: "Three playful games that train attention and memory in short, dopamine-friendly bursts — progress, not pressure.", color: "#8acfd1", glow: ["#8acfd1", "#2D8EFF", "#38bdf8"] },
  { img: "/home/scheduler.png", title: "Scheduler", sub: "Plan without panic", desc: "A gentle week view with visual timers and a kind AI nudge that reshuffles your day around when you actually focus best.", color: "#ff9a9a", glow: ["#ED1C24", "#ED1C24", "#ff5a5f"] },
  { img: "/home/mood.png", title: "Mood", sub: "Check in, calm down", desc: "A 20-second weather check-in plus calming audio sessions, so big feelings get named and ridden out — never judged.", color: "#8fc0ff", glow: ["#2D8EFF", "#38bdf8", "#8fc0ff"] },
  { img: "/home/journal.png", title: "Journal", sub: "Brain dump, zero friction", desc: "A soft, private space to empty your head — with prompts for stuck days and a quiet chart of your mood over time.", color: "#f0cf7a", glow: ["#FFC107", "#F5B000", "#f0cf7a"] },
  { img: "/home/task%20breakdown.png", title: "Task Breakdown", sub: "One tiny step at a time", desc: "Turn one scary task into tiny doable steps, then enter Focus Mode that hides everything except the single next step.", color: "#ff9a9a", glow: ["#ED1C24", "#ff5a5f", "#ED1C24"] },
  { img: "/home/community.png", title: "Community", sub: "Kind, weird, distractible", desc: "Body-doubling rooms and warm forums grouped by ADHD type — celebrate small wins with people who genuinely get it.", color: "#8fd6d8", glow: ["#8acfd1", "#0d5b5e", "#2D8EFF"] },
];

export default function ModuleCarousel() {
  // Duplicate the list so the marquee can loop seamlessly.
  const loop = [...MODULES, ...MODULES];

  return (
    <section id="modules" className="overflow-hidden py-20">
      <h2 className="px-6 text-center font-display text-3xl font-extrabold md:text-4xl">
        Your Pace in Your Space
      </h2>
      <p className="mt-2 px-6 text-center text-sm font-medium text-[#a09da8]">
        Six gentle tools. Use one, use all — never a wall of red badges.
      </p>

      <div
        className="marquee relative mt-10 flex w-full overflow-hidden"
        style={{
          maskImage: "linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent)",
          WebkitMaskImage: "linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent)",
        }}
      >
        <div className="marquee-track flex shrink-0 gap-6 pr-6">
          {loop.map((m, i) => (
            <BorderGlow
              key={i}
              colors={m.glow}
              backgroundColor="#17171b"
              glowIntensity={1.4}
              className="w-[300px] shrink-0 cursor-pointer rounded-3xl transition-transform duration-200 hover:scale-[1.03]"
            >
              <div className="flex flex-col items-center p-7 text-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={m.img} alt={m.title} className="h-16 w-16 object-contain" />
                <h5 className="mt-4 text-xl font-extrabold" style={{ color: m.color }}>{m.title}</h5>
                <p className="mt-0.5 text-[11px] font-bold uppercase tracking-wider text-[#8b8892]">{m.sub}</p>
                <p className="mt-3 text-[13px] leading-relaxed text-[#a8a5b0]">{m.desc}</p>
              </div>
            </BorderGlow>
          ))}
        </div>
      </div>

      {/* Infinite marquee that pauses while hovered. */}
      <style>{`
        @keyframes carousel {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .marquee-track { animation: carousel 40s linear infinite; will-change: transform; }
        .marquee:hover .marquee-track { animation-play-state: paused; }
      `}</style>
    </section>
  );
}
