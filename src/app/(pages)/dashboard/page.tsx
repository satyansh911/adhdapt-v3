"use client"

import React from "react"
import { Reveal } from "@/components/animations/Reveal"
import { Navbar } from "@/components/ui/Navbar"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20">
      <Navbar />
      
      <main className="max-w-6xl mx-auto px-6 pt-32 pb-40">
        
        {/* Welcome Section */}
        <section className="mb-20">
          <Reveal direction="up" duration={1}>
            <h1 className="font-serif text-4xl mb-4">Workspace</h1>
            <p className="text-secondary-foreground text-sm uppercase tracking-widest">
              Quiet your mind. Begin your work.
            </p>
          </Reveal>
        </section>

        {/* Dashboard Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Task Area */}
          <Reveal direction="up" delay={0.1} className="lg:col-span-2">
            <div className="p-8 border border-border min-h-[500px]">
              <div className="flex justify-between items-center border-b border-border pb-4 mb-8">
                <h2 className="text-xs uppercase tracking-widest text-primary">Priority Queue</h2>
                <span className="text-xs text-secondary-foreground">0/3 Completed</span>
              </div>
              
              <div className="space-y-4">
                {/* Empty State / Minimalist Task List */}
                <p className="text-sm text-secondary-foreground italic font-serif">
                  The matrix is empty. What is the one thing you must do today?
                </p>
                
                <input 
                  type="text" 
                  placeholder="Type a singular task here..." 
                  className="w-full bg-transparent border-b border-border py-4 text-lg font-serif focus:outline-none focus:border-foreground transition-colors placeholder:text-secondary-foreground/50 mt-8"
                />
              </div>
            </div>
          </Reveal>

          {/* Right Column: Widgets */}
          <div className="flex flex-col gap-8">
            
            {/* Minimalist Pomodoro Insight */}
            <Reveal direction="up" delay={0.2}>
              <div className="p-8 border border-border">
                <h2 className="text-xs uppercase tracking-widest text-primary mb-8 border-b border-border pb-4">
                  Focus Pulse
                </h2>
                <div className="text-center">
                  <span className="font-serif text-5xl tabular-nums">25:00</span>
                  <div className="mt-8">
                    <button className="text-xs uppercase tracking-widest text-background bg-foreground hover:bg-primary transition-colors px-6 py-3 w-full">
                      Initiate Block
                    </button>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Journal Prompt */}
            <Reveal direction="up" delay={0.3}>
              <div className="p-8 border border-border flex flex-col items-center text-center justify-center min-h-[220px] group cursor-pointer hover:border-foreground transition-colors">
                <span className="font-serif text-3xl text-secondary-foreground group-hover:text-foreground transition-colors">
                  Journal
                </span>
                <span className="text-primary group-hover:translate-x-2 transition-transform duration-500 mt-4">→</span>
              </div>
            </Reveal>
            
          </div>
        </section>

      </main>
    </div>
  )
}
