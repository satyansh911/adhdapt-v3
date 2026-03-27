"use client"

import React from "react"
import { Reveal } from "@/components/animations/Reveal"
import { Navbar } from "@/components/ui/Navbar"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20">
      <Navbar />
      
      <main className="max-w-6xl mx-auto px-6 pt-32 pb-40">
        
        {/* Header Section */}
        <section className="mb-40 max-w-4xl">
          <Reveal direction="up" duration={1.2}>
            <h1 className="font-serif text-5xl md:text-7xl leading-tight mb-8">
              Designing silence <br className="hidden md:block" />
              for the noisy mind.
            </h1>
          </Reveal>
          
          <Reveal direction="up" delay={0.2} duration={1}>
            <p className="text-secondary-foreground text-lg md:text-xl leading-relaxed max-w-2xl">
              ADHDapt was born from a singular vision: to create a digital sanctuary 
              where neurodivergent thinkers can thrive without the overwhelm of typical 
              productivity software. We believe that focus isn&apos;t about white-knuckling 
              through distractions; it&apos;s about cultivating an environment that honors 
              how your brain actually works.
            </p>
          </Reveal>
        </section>

        {/* The Founders Section */}
        <section className="mb-40">
          <Reveal direction="up">
            <h2 className="text-xs uppercase tracking-[0.3em] text-primary mb-16 border-b border-border pb-4">
              The Founders
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
            {/* Satyansh Singh */}
            <Reveal direction="up" delay={0.1}>
              <article className="group">
                <div className="w-full aspect-[3/4] bg-secondary/30 mb-8 overflow-hidden relative border border-border">
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent mix-blend-overlay" />
                  {/* Image placeholder - pure luxury minimalist style */}
                </div>
                <h3 className="font-serif text-3xl mb-2">Satyansh Singh</h3>
                <p className="text-xs uppercase tracking-widest text-primary mb-6">Co-Founder & Architect</p>
                <p className="text-secondary-foreground leading-relaxed text-sm">
                  Satyansh approaches system architecture not as a rigid hierarchy, but as 
                  a flowing ecosystem. Frustrated by the cognitive load of traditional task 
                  managers, he set out to strip away every non-essential pixel, resulting in 
                  the hyper-minimalist framework that powers ADHDapt today. His philosophy: 
                  "If the tool requires active thinking to use, the tool has failed."
                </p>
              </article>
            </Reveal>

            {/* Kushagra Saxena */}
            <Reveal direction="up" delay={0.3}>
              <article className="group md:mt-32">
                <div className="w-full aspect-[3/4] bg-secondary/30 mb-8 overflow-hidden relative border border-border">
                  <div className="absolute inset-0 bg-gradient-to-tr from-foreground/5 to-transparent mix-blend-overlay" />
                  {/* Image placeholder */}
                </div>
                <h3 className="font-serif text-3xl mb-2">Kushagra Saxena</h3>
                <p className="text-xs uppercase tracking-widest text-primary mb-6">Co-Founder & Design Director</p>
                <p className="text-secondary-foreground leading-relaxed text-sm">
                  Drawing inspiration from high-end editorial design and brutalist architecture, 
                  Kushagra champions the visual serenity of the platform. He understands that for 
                  an ADHD brain, visual clutter triggers executive dysfunction. By enforcing strict 
                  typographic hierarchies and sweeping negative space, he ensures ADHDapt feels less 
                  like software and more like a quiet room.
                </p>
              </article>
            </Reveal>
          </div>
        </section>

        {/* The Philosophy Section */}
        <section className="max-w-3xl mx-auto text-center border-t border-border pt-40">
          <Reveal direction="up">
            <h2 className="font-serif text-4xl mb-8">The Philosophy of Less</h2>
          </Reveal>
          
          <Reveal direction="up" delay={0.2}>
            <p className="text-secondary-foreground leading-relaxed text-lg mb-12">
              Every shadow, every animation, every hue in ADHDapt is meticulously calculated 
              to reduce cortisol and invite deep work. We reject gamification. We reject 
              endless notifications. We embrace the void.
            </p>
          </Reveal>
          
          <Reveal direction="up" delay={0.4}>
            <p className="font-serif text-2xl italic text-primary">
              "Focus is a fragile state. Treat it with reverence."
            </p>
          </Reveal>
        </section>

      </main>
    </div>
  )
}
