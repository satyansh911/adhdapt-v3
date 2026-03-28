/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useEffect, useRef } from "react";
import { Navbar } from "@/components/ui/Navbar";
import Link from "next/link";
import { Calendar, MonitorPlay, Sparkles, Zap, Brain, Target, Activity, MousePointer2, Star, ArrowRight } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogDescription
} from "@/components/ui/dialog";
import { AdhdFlavors } from "@/components/ui/AdhdFlavors";
import { GlobalMap } from "@/components/ui/GlobalMap";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Hero entrance timeline
      const tl = gsap.timeline();

      tl.from(".hero-content", {
        y: 40,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
        stagger: 0.2,
      });

      // Floating elements appear after text
      tl.from(".floating-shape", {
        scale: 0,
        opacity: 0,
        duration: 1,
        ease: "back.out(1.7)",
        stagger: 0.05,
      }, "-=0.4"); // Slight overlap for smoothness

      // Storytelling video/image section
      gsap.from(".story-media", {
        scrollTrigger: {
          trigger: ".story-section",
          start: "top 75%",
        },
        opacity: 0,
        scale: 0.9,
        y: 50,
        duration: 1,
        ease: "back.out(1.5)",
      });

      gsap.from(".story-text", {
        scrollTrigger: {
          trigger: ".story-section",
          start: "top 75%",
        },
        opacity: 0,
        x: -50,
        duration: 1,
        ease: "power3.out",
        stagger: 0.2,
      });

      // 3 Flavors Cards Stagger
      gsap.from(".flavor-card", {
        scrollTrigger: {
          trigger: ".flavors-section",
          start: "top 80%",
        },
        opacity: 0,
        y: 80,
        duration: 0.8,
        ease: "back.out(1.7)",
        stagger: 0.15,
      });

      // Continuous Floating Shapes
      gsap.to(".floating-shape", {
        y: "random(-25, 25)",
        rotation: "random(-15, 15)",
        duration: 3,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
        stagger: {
          amount: 1,
          from: "random"
        }
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative w-full min-h-screen bg-background text-foreground font-sans pt-32 pb-20 overflow-x-hidden">
      
      {/* Simple Static Ambient Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute w-[50vw] h-[50vw] bg-[#E91E63]/10 rounded-full blur-[120px] top-[-10%] left-[-10%]"></div>
        <div className="absolute w-[60vw] h-[60vw] bg-[#2D8EFF]/10 rounded-full blur-[120px] bottom-[-20%] right[-10%]"></div>
        <div className="absolute w-[40vw] h-[40vw] bg-[#FFC107]/10 rounded-full blur-[120px] top-[30%] left-[40%]"></div>
      </div>

      <Navbar />

      {/* Hero Section */}
      <section className="relative z-10 w-full min-h-[70vh] flex flex-col items-center justify-center text-center px-4 pt-10 pb-48">
        
        {/* Floating Decorative Elements */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden flex items-center justify-center">
          <div className="w-full h-full max-w-7xl relative">
            <div className="floating-shape absolute top-[8%] left-[5%] md:left-[15%] text-[#FFC107]">
              <Star className="w-12 h-12 md:w-20 md:h-20" fill="#FFC107" />
            </div>
            <div className="floating-shape absolute bottom-[35%] left-[10%] md:left-[25%] text-[#2D8EFF]">
              <Activity className="w-16 h-16 md:w-24 md:h-24 stroke-[4px]" />
            </div>
            <div className="floating-shape absolute top-[15%] right-[10%] md:right-[20%] text-[#E91E63]">
              <MousePointer2 className="w-12 h-12 md:w-20 md:h-20 rotate-[120deg] stroke-[3px]" fill="#E91E63" />
            </div>
            <div className="floating-shape absolute bottom-[40%] right-[5%] md:right-[15%] text-[#FFC107]">
              <Zap className="w-16 h-16 md:w-24 md:h-24 rotate-[-15deg]" fill="#FFC107" />
            </div>
            {/* Decorative pills */}
            <div className="floating-shape absolute top-[45%] left-[5%] md:left-[10%] w-16 h-8 md:w-24 md:h-12 rounded-full bg-[#E91E63] rotate-[30deg]"></div>
            <div className="floating-shape absolute top-[5%] right-[20%] md:right-[30%] w-20 h-10 md:w-32 md:h-14 rounded-full border-4 md:border-8 border-[#2D8EFF] rotate-[-20deg]"></div>
          </div>
        </div>

        <div className="mb-8 inline-flex flex-col items-center justify-center relative hero-content z-10 select-none">
          <div className="w-80 h-80 md:w-[500px] md:h-[500px] rounded-full bg-gradient-to-tr from-[#E91E63] to-[#FFC107] blur-[120px] absolute -z-10 mix-blend-multiply opacity-40"></div>
          
          <h1 className="text-[6rem] sm:text-[9rem] md:text-[12rem] font-display font-black tracking-tighter leading-[0.8] mt-0 mb-0 text-[#111] relative z-10 whitespace-nowrap drop-shadow-sm">
            ADHD<span className="text-[#E91E63]">APT</span>
          </h1>
          <span className="text-xl md:text-2xl font-black tracking-[0.6em] uppercase text-[#111]/30 mt-4 ml-6">ARCADE</span>
        </div>

        <p className="mt-8 text-xl sm:text-2xl text-[#333] max-w-3xl mx-auto font-black flex items-center justify-center gap-4 hero-content uppercase tracking-tight">
          <Zap className="w-8 h-8 text-[#FFC107]" fill="#FFC107" />
          Dopamine-Driven Productivity
          <Zap className="w-8 h-8 text-[#FFC107]" fill="#FFC107" />
        </p>
        <p className="mt-4 text-xl text-[#666] max-w-2xl mx-auto font-bold leading-relaxed hero-content">
          Built strictly for the ADHD brain. Capture chaotic thoughts, hack your executive function, and turn paralyzing overwhelm into a playful, high-energy playground.
        </p>

        {/* Action Button */}
        <div className="hero-content mt-12">
          <Link href="/dashboard" className="arcade-button inline-flex items-center gap-4 text-xl">
            <Target className="w-7 h-7" /> ENTER THE PLAYGROUND
          </Link>
        </div>
      </section>

      {/* Enhanced Interactive ADHD Info Section */}
      <section className="story-section relative z-20 w-full py-24 px-4 sm:px-6 max-w-7xl mx-auto mb-20">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-7xl font-display font-bold tracking-tight mb-4 text-[#111]">
            UNDERSTANDING <span className="sgf-gradient-text">ADHD</span>
          </h2>
          <p className="text-xl text-[#666] font-medium max-w-2xl mx-auto">
            It's not a deficit of attention—it's an inability to regulate it. A Ferrari engine with bicycle brakes.
          </p>
        </div>

        {/* Bento Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[300px] md:auto-rows-[250px]">
          
          {/* Card 1: The Global Scale (Large) */}
          <Dialog>
            <DialogTrigger asChild>
              <div className="md:col-span-8 md:row-span-2 group relative overflow-hidden bg-[#fdedc9] border-4 border-[#d04f99] rounded-[48px] p-12 shadow-[8px_8px_0px_#d04f99] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none cursor-pointer">
                <div className="relative z-10 h-full flex flex-col justify-end">
                  <div className="absolute top-0 right-0 bg-[#d04f99] text-white px-6 py-3 rounded-bl-[24px] font-black text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                    DEEP DIVE <ArrowRight size={14} />
                  </div>
                  <span className="text-[#d04f99] font-black text-7xl md:text-9xl mb-4 tracking-tighter">366M</span>
                  <h3 className="text-4xl font-black mb-4 tracking-tight">ADULT POPULATION</h3>
                  <p className="text-[#111]/70 font-bold text-xl leading-relaxed max-w-lg">
                    You are part of a global neurotype. Navigating a world built for neurotypicals while carrying a totally valid neurodivergent glitch.
                  </p>
                </div>
                {/* Visual background for this card */}
                <div className="absolute top-10 right-10 opacity-10 group-hover:rotate-12 transition-transform duration-500">
                  <Brain size={250} className="text-[#d04f99]" />
                </div>
              </div>
            </DialogTrigger>
            <DialogContent className="max-w-3xl rounded-[40px] border-4 border-[#2D8EFF] p-12 bg-[#F9F7F2]">
              <DialogHeader>
                <DialogTitle className="text-5xl font-black text-[#111] mb-4">A Global Neurotype</DialogTitle>
                <DialogDescription className="text-xl text-[#333] font-medium leading-relaxed">
                  ADHD isn't just a label; it's a fundamental part of human cognitive diversity. In a world of 8 billion people, 366 million adults are estimated to have ADHD. This isn't a "new" phenomenon—it's likely an evolutionary adaptation that once served hunters and explorers.
                  <br /><br />
                  <span className="font-black text-[#2D8EFF]">THE CORE FACT:</span> Awareness is rising because we're finally acknowledging that executive function isn't a measure of intelligence, but a biological process. You aren't "lazy"—you're literally wired for a different kind of speed.
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>

          {/* Card 2: Prefrontal Cortex (Medium) */}
          <Dialog>
            <DialogTrigger asChild>
              <div className="md:col-span-4 md:row-span-1 bg-[#E91E63] text-white rounded-[40px] p-8 flex flex-col justify-center items-center text-center shadow-[8px_8px_0px_#A01545] hover:scale-[1.02] transition-transform cursor-pointer group relative">
                 <div className="absolute top-4 right-4 text-white/50 group-hover:text-white transition-colors">
                    <ArrowRight size={20} />
                 </div>
                 <Activity className="w-16 h-16 mb-4" />
                 <h4 className="text-2xl font-black">Prefrontal Cortex</h4>
                 <p className="text-sm font-bold opacity-90 mt-2">The "CEO" working differently on rewards.</p>
              </div>
            </DialogTrigger>
            <DialogContent className="max-w-2xl rounded-[40px] border-4 border-[#E91E63] p-12 bg-white">
              <DialogHeader>
                <DialogTitle className="text-4xl font-black text-[#E91E63] mb-4">The CEO Glitch</DialogTitle>
                <DialogDescription className="text-lg text-[#333] font-medium leading-relaxed">
                  The Prefrontal Cortex (PFC) is the brain's headquarters for executive function—governing working memory, impulse control, and task initiation. 
                  <br /><br />
                  In the ADHD brain, the PFC can be chronically under-stimulated. Imagine a <span className="font-bold text-[#E91E63]">Ferrari Engine</span> (your creativity and processing power) paired with <span className="font-bold text-[#E91E63]">Bicycle Brakes</span>. You have the horsepower, but the "stopping" and "starting" mechanism requires external support to function at peak capacity.
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>

          {/* Card 3: The Video Loop (Medium) */}
          <div className="md:col-span-4 md:row-span-2 relative rounded-[40px] border-4 border-[#111] overflow-hidden group">
             <iframe 
               src="https://player.vimeo.com/video/442749463?background=1&autoplay=1&loop=1&byline=0&title=0" 
               className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
               frameBorder="0" 
               allow="autoplay; fullscreen">
             </iframe>
             <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none p-8 flex flex-col justify-end">
                <p className="text-white font-black text-2xl leading-tight">THE KINETIC ENGINE THAT NEVER POWERS DOWN.</p>
             </div>
          </div>

          {/* Card 4: Baseline Receptors (Medium) */}
          <Dialog>
            <DialogTrigger asChild>
              <div className="md:col-span-4 md:row-span-1 bg-[#fdedc9] border-4 border-[#FFC107] text-[#111] rounded-[40px] p-8 flex items-center gap-6 shadow-[5px_5px_0px_#FFC107] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all cursor-pointer group relative">
                 <div className="absolute top-4 right-4 text-[#111]/30 group-hover:text-[#111] transition-colors">
                    <ArrowRight size={20} />
                 </div>
                 <div className="shrink-0 w-16 h-16 bg-[#FFC107]/20 border-2 border-[#FFC107]/30 rounded-full flex items-center justify-center text-[#FFC107]">
                    <Zap size={32} fill="#FFC107" />
                 </div>
                 <div>
                    <h4 className="text-2xl font-black tracking-tight leading-none">DOPAMINE HUNGER</h4>
                    <p className="text-sm font-bold opacity-60 mt-2 uppercase tracking-tight">Chronic baseline hit-chasing.</p>
                 </div>
              </div>
            </DialogTrigger>
            <DialogContent className="max-w-2xl rounded-[40px] border-4 border-[#FFC107] p-12 bg-white">
              <DialogHeader>
                <DialogTitle className="text-4xl font-black text-[#F5B000] mb-4">The Dopamine Chase</DialogTitle>
                <DialogDescription className="text-lg text-[#333] font-medium leading-relaxed">
                  ADHD brains typically have fewer or less sensitive dopamine receptors. This creates a "low-baseline" state—a constant feeling of mental hunger for stimulation.
                  <br /><br />
                  <span className="font-bold text-[#F5B000]">Novelty is Medicine:</span> When something is NEW, URGENT, or INTERESTING, your brain releases a spike of dopamine that finally bridges the communication gap. This is why we can hyperfocus on a hobby for 10 hours but find it physically painful to do 5 minutes of mundane paperwork.
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>

          {/* Card 5: Why Apps Fail (Medium) */}
          <Dialog>
            <DialogTrigger asChild>
              <div className="md:col-span-4 md:row-span-1 bg-[#fdedc9] border-4 border-[#111] rounded-[40px] p-8 flex flex-col justify-center shadow-[5px_5px_0px_#111] cursor-pointer group relative hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
                 <div className="absolute top-4 right-4 text-[#111]/30 group-hover:text-[#E91E63] transition-colors">
                    <ArrowRight size={20} />
                 </div>
                 <h4 className="text-3xl font-black mb-2 text-[#E91E63] leading-none tracking-tighter">RIGID LISTS FAIL</h4>
                 <p className="text-[#111]/60 font-bold text-sm leading-tight uppercase">Traditional systems cause instant task-paralysis.</p>
              </div>
            </DialogTrigger>
            <DialogContent className="max-w-2xl rounded-[40px] border-4 border-[#111] p-12 bg-[#F9F7F2]">
              <DialogHeader>
                <DialogTitle className="text-4xl font-black text-[#111] mb-4">Design For The Glitch</DialogTitle>
                <DialogDescription className="text-lg text-[#333] font-medium leading-relaxed">
                  Traditional productivity apps rely on "Red Dot" anxiety and complex folder hierarchies. For an ADHDer, these triggers cause a <span className="font-bold text-[#E91E63]">shame spiral</span>.
                  <br /><br />
                  <span className="font-bold text-[#2D8EFF]">The ADHDapt Way:</span> We use massive typography, high-contrast visual rewards, and zero-friction capture to feed your brain's need for novelty. We design for the "Now" and the "Not Now," removing the friction that leads to paralysis.
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>

        {/* The 3 Flavors Picker */}
        <div className="flavors-section mt-32">
          <h3 className="text-4xl md:text-6xl font-display font-bold tracking-tight mb-12 text-center text-[#111]">
            THE THREE FLAVORS
          </h3>

          <AdhdFlavors />
        </div>
      </section>

      {/* Global Interactive Map Section */}
      <section className="relative z-20 w-full py-24 px-4 sm:px-6 max-w-7xl mx-auto mb-20 overflow-hidden">
        <GlobalMap />
      </section>

      {/* Module Cards Section */}
      <section className="relative z-20 w-full py-20 px-4 sm:px-6 max-w-7xl mx-auto">
        <h2 className="text-5xl md:text-7xl font-display font-bold tracking-tight mb-16 text-center text-[#111]">
          THE PLAYGROUND
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          
          <div className="arcade-card p-10 flex flex-col h-full border-[#d04f99] shadow-[8px_8px_0px_#d04f99]">
            <div className="w-20 h-20 rounded-[28px] bg-[#d04f99]/10 flex items-center justify-center mb-8 text-[#d04f99] border-2 border-[#d04f99]/20">
              <MonitorPlay size={40} />
            </div>
            <h3 className="text-4xl font-black tracking-tighter mb-4 leading-none uppercase">The Nexus</h3>
            <p className="text-[#111]/70 mb-8 font-bold text-lg leading-relaxed">
              Your visual bento box. When executive dysfunction hits, use this high-contrast, friendly dashboard to see exactly what to do next without the anxiety mapping of a normal to-do list.
            </p>
            <div className="mt-auto">
              <Link href="/dashboard" className="w-full py-5 bg-[#111] text-white rounded-[24px] font-black flex items-center justify-center gap-3 transition-all hover:scale-[1.02] text-sm uppercase tracking-widest shadow-[6px_6px_0px_#d04f99]">
                <Calendar size={20} /> Plan Your Day
              </Link>
            </div>
          </div>

          <div className="arcade-card p-10 flex flex-col h-full border-[#d04f99] shadow-[8px_8px_0px_#d04f99]">
            <div className="w-20 h-20 rounded-[28px] bg-[#FFC107]/10 flex items-center justify-center mb-8 text-[#F5B000] border-2 border-[#FFC107]/20">
              <Sparkles size={40} />
            </div>
            <h3 className="text-4xl font-black tracking-tighter mb-4 leading-none uppercase">Focus Timer</h3>
            <p className="text-[#111]/70 mb-8 font-bold text-lg leading-relaxed">
              Time blindness? Fixed. A massive, beautiful colorful squircle to track your sprints without the sheer terror and guilt induced by a traditional ticking clock.
            </p>
            <div className="mt-auto">
              <Link href="/tools/timer" className="w-full py-5 bg-[#111] text-white rounded-[24px] font-black flex items-center justify-center gap-3 transition-all hover:scale-[1.02] text-sm uppercase tracking-widest shadow-[6px_6px_0px_#d04f99]">
                <Zap size={20} /> Trigger Focus
              </Link>
            </div>
          </div>

          <div className="arcade-card p-10 flex flex-col h-full border-[#d04f99] shadow-[8px_8px_0px_#d04f99]">
            <div className="w-20 h-20 rounded-[28px] bg-[#8acfd1]/20 flex items-center justify-center mb-8 text-[#6bbcc0] border-2 border-[#8acfd1]/40">
              <Brain size={40} />
            </div>
            <h3 className="text-4xl font-black tracking-tighter mb-4 leading-none uppercase">Brain Dump</h3>
            <p className="text-[#111]/70 mb-8 font-bold text-lg leading-relaxed">
              Get the noise off your timeline. Zero-friction journaling to drop your chaotic, racing thoughts into a soft, highly readable, entirely private interface.
            </p>
            <div className="mt-auto">
              <Link href="/journal" className="w-full py-5 bg-[#111] text-white rounded-[24px] font-black flex items-center justify-center gap-3 transition-all hover:scale-[1.02] text-sm uppercase tracking-widest shadow-[6px_6px_0px_#d04f99]">
                <MonitorPlay size={20} /> Write It Down
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* Footer Area */}
      <footer className="relative z-10 pt-32 pb-12 flex flex-col items-center justify-center mt-20 overflow-hidden">
        <h2 className="text-[12vw] font-display font-bold tracking-tight text-[#111]/5 leading-none absolute top-10 pointer-events-none select-none whitespace-nowrap">
          ADHDAPT
        </h2>
        <div className="relative z-10 flex flex-col items-center mt-20">
          <p className="text-[#666] font-bold tracking-widest text-sm uppercase">© {(new Date()).getFullYear()} ADHDAPT. ALL VIBES RESERVED.</p>
        </div>
      </footer>
    </div>
  );
}