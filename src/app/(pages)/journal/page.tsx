"use client"

import React from "react"
import { Reveal } from "@/components/animations/Reveal"
import { Navbar } from "@/components/ui/Navbar"

export default function JournalPage() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-6 pt-32 pb-40">
        
        {/* Header */}
        <section className="mb-20">
          <Reveal direction="up" duration={1}>
            <div className="flex justify-between items-end border-b border-border pb-8">
              <div>
                <h1 className="font-serif text-4xl mb-2">The Archive</h1>
                <p className="text-secondary-foreground text-sm uppercase tracking-widest">
                  Unload the cognitive gridlock.
                </p>
              </div>
              <span className="text-xs font-serif text-primary italic">
                {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
          </Reveal>
        </section>

        {/* Editor Area */}
        <section>
          <Reveal direction="up" delay={0.1}>
            <div className="min-h-[60vh] relative group">
              <textarea 
                className="w-full h-full min-h-[60vh] bg-transparent resize-none focus:outline-none font-serif text-lg leading-relaxed md:text-xl placeholder:text-secondary-foreground/30 text-foreground"
                placeholder="Begin typing. There is no wrong way to format your thoughts here..."
                autoFocus
              />
              
              {/* Fade out bottom overlay to keep aesthetic */}
              <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
              
              <div className="absolute bottom-[-60px] right-0 flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <button className="text-xs uppercase tracking-widest text-secondary-foreground hover:text-foreground transition-colors px-4 py-2 border border-border hover:border-foreground">
                  Clear
                </button>
                <button className="text-xs uppercase tracking-widest text-background bg-foreground hover:bg-primary transition-colors px-6 py-2">
                  Preserve
                </button>
              </div>
            </div>
          </Reveal>
        </section>

      </main>
    </div>
  )
}
