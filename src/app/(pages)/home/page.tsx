"use client"

import React from "react"
import { Reveal } from "@/components/animations/Reveal"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20">
      
      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-6 pt-32 pb-40">
        <section className="mb-40 flex flex-col items-center text-center">
          <Reveal direction="up" duration={1.2}>
            <h1 className="font-serif text-6xl md:text-8xl leading-tight mb-8">
              Find your focus.
            </h1>
          </Reveal>
          
          <Reveal direction="up" delay={0.2} duration={1}>
            <p className="text-secondary-foreground text-lg md:text-xl leading-relaxed max-w-xl mx-auto mb-12">
              A meticulously crafted sanctuary for the neurodivergent mind. 
              Leave the notification badges behind.
            </p>
          </Reveal>
          
          <Reveal direction="up" delay={0.4}>
            <Button size="lg" className="w-fit" asChild>
              <Link href="/signup">Enter the Workspace</Link>
            </Button>
          </Reveal>
        </section>

        {/* The Toolkit Section */}
        <section className="mb-40 border-t border-border pt-40">
          <Reveal direction="up">
            <h2 className="text-xs uppercase tracking-[0.3em] text-primary mb-16">
              The Arsenal
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <Reveal direction="up" delay={0.1} className="h-full">
              <div className="p-8 border border-border h-full flex flex-col hover:border-foreground transition-colors duration-700">
                <h3 className="font-serif text-2xl mb-4">Deep Journaling</h3>
                <p className="text-secondary-foreground text-sm leading-relaxed flex-grow">
                  A cognitive dump space that requires zero formatting. Type, think, and release the mental gridlock blocking your executive function.
                </p>
                <div className="mt-8 pt-8 border-t border-border flex justify-between items-center group cursor-pointer">
                  <span className="text-xs uppercase tracking-widest text-primary group-hover:text-foreground transition-colors">Explore</span>
                  <span className="text-primary group-hover:translate-x-2 transition-transform duration-500">→</span>
                </div>
              </div>
            </Reveal>

            {/* Feature 2 */}
            <Reveal direction="up" delay={0.2} className="h-full">
              <div className="p-8 border border-border h-full flex flex-col hover:border-foreground transition-colors duration-700">
                <h3 className="font-serif text-2xl mb-4">Pomodoro Timer</h3>
                <p className="text-secondary-foreground text-sm leading-relaxed flex-grow">
                  A high-contrast, brutalist timer ensuring you stay anchored to the present moment. Time blindness becomes a non-issue.
                </p>
                <div className="mt-8 pt-8 border-t border-border flex justify-between items-center group cursor-pointer">
                  <span className="text-xs uppercase tracking-widest text-primary group-hover:text-foreground transition-colors">Explore</span>
                  <span className="text-primary group-hover:translate-x-2 transition-transform duration-500">→</span>
                </div>
              </div>
            </Reveal>

            {/* Feature 3 */}
            <Reveal direction="up" delay={0.3} className="h-full">
              <div className="p-8 border border-border h-full flex flex-col hover:border-foreground transition-colors duration-700">
                <h3 className="font-serif text-2xl mb-4">Task Matrix</h3>
                <p className="text-secondary-foreground text-sm leading-relaxed flex-grow">
                  No complex tagging. No multi-layered folders. Just a pristine, prioritized list that visually quiets the noise.
                </p>
                <div className="mt-8 pt-8 border-t border-border flex justify-between items-center group cursor-pointer">
                  <span className="text-xs uppercase tracking-widest text-primary group-hover:text-foreground transition-colors">Explore</span>
                  <span className="text-primary group-hover:translate-x-2 transition-transform duration-500">→</span>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* The Philosophy/Manifesto */}
        <section className="mb-40 pt-40 border-t border-border">
          <div className="max-w-3xl mx-auto text-center">
            <Reveal direction="up">
              <h2 className="font-serif text-4xl md:text-5xl mb-8 leading-tight">
                Software should calm the mind, not crowd it.
              </h2>
            </Reveal>
            
            <Reveal direction="up" delay={0.2}>
              <p className="text-secondary-foreground text-lg leading-relaxed mb-8">
                The modern internet is a hostile environment for the ADHD brain. It demands attention through red dots, pop-ups, and infinite scrolling feeds. It assumes that more features equate to more productivity. 
              </p>
            </Reveal>

            <Reveal direction="up" delay={0.3}>
              <p className="text-secondary-foreground text-lg leading-relaxed mb-12">
                We reject this explicitly. By adopting an editorial, breathing architecture, we strip away the non-essential. The absence of clutter isn’t just an aesthetic choice; it’s a functional necessity for executive function.
              </p>
            </Reveal>

            <Reveal direction="up" delay={0.4}>
              <Button variant="outline" size="lg" asChild className="w-fit">
                <Link href="/about">Read Our Story</Link>
              </Button>
            </Reveal>
          </div>
        </section>

      </main>
    </div>
  )
}