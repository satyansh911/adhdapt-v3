"use client"

import React, { useState, useEffect, useRef } from "react"
import { Reveal } from "@/components/animations/Reveal"
import { Navbar } from "@/components/ui/Navbar"
import gsap from "gsap"

export default function FocusTimerPage() {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const orbsRef = useRef<HTMLDivElement>(null);

  // Soft Parallax orb animation
  useEffect(() => {
    if (!orbsRef.current) return;
    const orbs = orbsRef.current.children;
    gsap.to(orbs[0], { y: "80px", x: "-60px", ease: "sine.inOut", duration: 8, repeat: -1, yoyo: true });
    gsap.to(orbs[1], { y: "-70px", x: "80px", ease: "sine.inOut", duration: 10, repeat: -1, yoyo: true });
  }, []);

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
    <div className="relative min-h-screen bg-background text-foreground font-sans selection:bg-[#E91E63] selection:text-white flex flex-col">
      
      {/* GSAP Parallax Bokeh Orbs Background */}
      <div ref={orbsRef} className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="orb orb-yellow w-[800px] h-[800px] top-[-30%] left-[-20%] opacity-30"></div>
        <div className="orb orb-pink w-[600px] h-[600px] bottom-[-20%] right-[-10%] opacity-20"></div>
      </div>

      <div className="relative z-10 flex flex-col flex-grow">
        <Navbar />
        
        <main className="flex-grow flex flex-col items-center justify-center p-4 sm:p-6 w-full pt-24">
          
          <Reveal direction="up" duration={1.2} className="w-full max-w-4xl relative">
            <div className="flex flex-col items-center text-center py-20 px-4 sm:px-12 sgf-card">
              
              {/* Context */}
              <div className="mb-8">
                <h1 className="text-base font-[900] uppercase tracking-[0.2em] text-[#E91E63] mb-4">
                  Focus Session
                </h1>
                <p className="font-sans font-medium text-xl text-[#666]">
                  Twenty-five minutes. You against the world. 
                </p>
              </div>

              {/* The Timer Wrapper (Massive Squircle) */}
              <div className="relative w-[300px] h-[300px] sm:w-[450px] sm:h-[450px] bg-white rounded-[60px] sm:rounded-[80px] shadow-[0_30px_60px_rgba(0,0,0,0.05),inset_0_-10px_20px_rgba(0,0,0,0.02)] flex items-center justify-center mb-12 transform transition-transform hover:scale-[1.02] duration-500 overflow-hidden">
                 
                 {/* Progress Indicator (Simulated with background gradient) */}
                 <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#FFC107]/20 to-transparent transition-all duration-1000" style={{ height: `${((25 * 60 - timeLeft) / (25 * 60)) * 100}%` }}></div>

                 {/* The Digits */}
                <div className="relative z-10 tabular-nums font-[900] text-[5rem] sm:text-[8rem] tracking-tighter text-[#111] drop-shadow-sm">
                  {formatTime(timeLeft)}
                </div>
              </div>

              {/* Controls */}
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center max-w-md mx-auto">
                <button 
                  onClick={resetTimer}
                  className="w-full sm:w-auto text-sm font-bold uppercase tracking-widest text-[#666] hover:text-[#111] transition-colors py-4 px-8 bg-white border border-gray-200 rounded-full shadow-sm hover:shadow-md"
                >
                  Reset
                </button>
                
                <button 
                  onClick={toggleTimer}
                  className={`w-full sm:w-auto text-base font-[900] uppercase tracking-widest transition-all px-12 py-4 rounded-full
                    ${isActive 
                      ? "text-white bg-[#111] hover:bg-[#333] hover:scale-105 shadow-[0_10px_20px_rgba(0,0,0,0.1)]" 
                      : "sgf-button shadow-[0_15px_30px_rgba(233,30,99,0.3)]"
                    }
                  `}
                >
                  {isActive ? "Pause" : "Start Flow"}
                </button>
              </div>

            </div>
          </Reveal>
          
        </main>
      </div>
    </div>
  )
}
