"use client"

import React, { useState, useEffect } from "react"
import { Reveal } from "@/components/animations/Reveal"
import { Navbar } from "@/components/ui/Navbar"

export default function FocusTimerPage() {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(25 * 60);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 flex flex-col">
      <Navbar />
      
      <main className="flex-grow flex flex-col items-center justify-center p-6">
        
        <Reveal direction="up" duration={1} className="w-full max-w-2xl">
          <div className="flex flex-col items-center text-center space-y-16">
            
            {/* Context */}
            <div>
              <h1 className="text-xs uppercase tracking-[0.3em] text-primary mb-4">Focus Protocol</h1>
              <p className="font-serif text-2xl md:text-3xl text-secondary-foreground italic">
                Twenty-five minutes of absolute singularity.
              </p>
            </div>

            {/* The Timer */}
            <div className="tabular-nums font-serif text-[15vw] md:text-[8rem] leading-none tracking-tight">
              {formatTime(timeLeft)}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-8 w-full justify-center border-t border-border pt-16">
              <button 
                onClick={resetTimer}
                className="text-xs uppercase tracking-widest text-secondary-foreground hover:text-foreground transition-colors"
              >
                Reset Pattern
              </button>
              
              <button 
                onClick={toggleTimer}
                className="text-xs uppercase tracking-widest text-background bg-foreground hover:bg-primary transition-colors px-12 py-4"
              >
                {isActive ? "Pause State" : "Initiate Block"}
              </button>
            </div>

          </div>
        </Reveal>

      </main>
    </div>
  )
}
