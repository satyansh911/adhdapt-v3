"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Play } from "lucide-react";
import DotField from "@/components/DotField";

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  // Only run the DotField canvas loop while the hero is on screen — mounting it
  // full-time keeps a requestAnimationFrame loop going and janks scrolling.
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0.01,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <header
      ref={heroRef}
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
    >
      {/* Default DotField background — only mounted while the hero is visible. */}
      <div className="absolute inset-0">{inView && <DotField />}</div>

      {/* Hero content */}
      <div className="relative z-10 mx-auto max-w-5xl px-6 py-24 text-center">
        <div className="mb-3.5 text-[13px] font-bold uppercase tracking-[0.22em] text-[#ED1C24]">
          Built for the ADHD brain
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/home/logo.png"
          alt="ADHDapt"
          className="mx-auto w-full max-w-[560px]"
        />
        <p className="mx-auto mt-7 max-w-xl text-lg font-bold text-[#ececf0] md:text-xl">
          Turn overwhelm into a playful, low-pressure playground.
        </p>
        <p className="mx-auto mt-1.5 max-w-lg text-base font-medium leading-relaxed text-[#a8a5b0]">
          Capture racing thoughts, break big tasks into tiny wins, and build focus with tools that
          reward you — never shame you.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3.5">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 rounded-2xl border-2 border-[#111] bg-[#ED1C24] px-8 py-3.5 text-[15px] font-extrabold text-white shadow-[5px_5px_0_#111] transition-transform hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
          >
            Login
          </Link>
          <Link
            href="/#modules"
            className="inline-flex items-center gap-2 rounded-2xl border-2 border-[#111] bg-[#FFC107] px-7 py-3.5 text-[15px] font-extrabold text-[#111] shadow-[5px_5px_0_#111] transition-transform hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
          >
            <Play className="h-4 w-4" /> See how it works
          </Link>
        </div>
      </div>
    </header>
  );
}
