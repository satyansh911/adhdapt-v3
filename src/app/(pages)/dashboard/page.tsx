"use client"

import React, { useState, useEffect, useRef } from "react"
import { Reveal } from "@/components/animations/Reveal"
import { Navbar } from "@/components/ui/Navbar"
import { Target, Zap, Brain, Play, Pause, SkipForward, Smile, Meh, Frown, ListChecks, Maximize2, X } from "lucide-react"
import gsap from "gsap"

export default function DashboardPage() {
  const orbsRef = useRef<HTMLDivElement>(null);
  const [task, setTask] = useState("");
  const [subTasks, setSubTasks] = useState<{id: string, text: string, completed: boolean}[]>([]);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [vibe, setVibe] = useState<string | null>(null);

  // Soft Parallax orb animation
  useEffect(() => {
    if (!orbsRef.current) return;
    const orbs = orbsRef.current.children;
    gsap.to(orbs[0], { y: "60px", x: "-30px", ease: "sine.inOut", duration: 8, repeat: -1, yoyo: true });
    gsap.to(orbs[1], { y: "-50px", x: "40px", ease: "sine.inOut", duration: 10, repeat: -1, yoyo: true });
  }, []);

  const breakDownTask = () => {
    if (!task) return;
    // Mocking the AI breakdown for immediate UX feedback
    const suggestions = [
      { id: "1", text: "Configure project environment", completed: false },
      { id: "2", text: "Draft core logic outline", completed: false },
      { id: "3", text: "Finalize visual style tokens", completed: false }
    ];
    setSubTasks(suggestions);
  };

  const toggleSubTask = (id: string) => {
    setSubTasks(subTasks.map(st => st.id === id ? { ...st, completed: !st.completed } : st));
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground font-sans selection:bg-[#d04f99] selection:text-white pb-20">
      
      {/* Background Orbs */}
      <div ref={orbsRef} className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="orb orb-pink w-[700px] h-[700px] top-[-20%] right-[-10%] opacity-20"></div>
        <div className="orb orb-blue w-[500px] h-[500px] bottom-[-10%] left-[-5%] opacity-20"></div>
      </div>

      {/* Focus Mode Overlay */}
      {isFocusMode && (
        <div className="fixed inset-0 z-[100] bg-[#fdedc9] flex flex-col items-center justify-center p-8 animate-in fade-in zoom-in duration-300">
          <button 
            onClick={() => setIsFocusMode(false)}
            className="absolute top-10 right-10 p-4 rounded-full bg-[#111] text-white hover:scale-110 transition-transform"
          >
            <X size={24} />
          </button>
          
          <div className="text-center max-w-2xl w-full">
            <span className="text-sm font-black tracking-[0.4em] text-[#d04f99] uppercase mb-4 block">Current Focus</span>
            <h2 className="text-6xl md:text-8xl font-black text-[#111] tracking-tighter leading-none mb-12 uppercase">
              {subTasks.find(s => !s.completed)?.text || "BOSSED IT!"}
            </h2>
            
            {!subTasks.some(s => !s.completed) ? (
              <button 
                onClick={() => setIsFocusMode(false)}
                className="arcade-button text-xl"
              >
                RETURN TO NEXUS
              </button>
            ) : (
              <button 
                onClick={() => toggleSubTask(subTasks.find(s => !s.completed)!.id)}
                className="arcade-button text-xl bg-[#2D8EFF] border-[#111] shadow-[6px_6px_0px_#111]"
              >
                TASK COMPLETE
              </button>
            )}
          </div>
        </div>
      )}

      <div className="relative z-10">
        <Navbar />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-36 pb-20">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
            <Reveal direction="down">
              <div className="flex flex-col items-start gap-0 leading-none">
                <h1 className="text-7xl md:text-9xl font-black tracking-tighter text-[#111] mb-2 uppercase">
                  NEXUS<span className="text-[#d04f99]">HUB</span>
                </h1>
                <div className="flex items-center gap-3 ml-1">
                   <div className="w-3 h-3 rounded-full bg-[#d04f99] animate-pulse"></div>
                   <span className="text-xs font-black tracking-[0.3em] uppercase text-[#111]/40">System Active</span>
                </div>
              </div>
            </Reveal>

            {/* Vibe Tracker */}
            <div className="arcade-card p-6 flex items-center gap-6 border-[#111] shadow-[6px_6px_0px_#111]">
              <span className="text-xs font-black uppercase tracking-widest text-[#111]/40">Current Vibe:</span>
              <div className="flex gap-4">
                {[
                  { icon: Smile, label: "Good", color: "text-green-500" },
                  { icon: Meh, label: "Neutral", color: "text-[#FFC107]" },
                  { icon: Frown, label: "rough", color: "text-[#d04f99]" }
                ].map((v) => (
                  <button 
                    key={v.label}
                    onClick={() => setVibe(v.label)}
                    className={`p-3 rounded-xl transition-all ${vibe === v.label ? "bg-[#111] text-white scale-110 shadow-lg" : "bg-white/50 hover:bg-white text-[#111] border-2 border-[#111]/10"}`}
                  >
                    <v.icon size={22} className={vibe === v.label ? "text-white" : v.color} />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Main Interactive Zone */}
            <div className="lg:col-span-8 flex flex-col gap-10">
              
              {/* Task Hub */}
              <div className="arcade-card p-12 min-h-[500px] flex flex-col">
                <div className="flex justify-between items-center mb-12 pb-6 border-b-4 border-[#111]/5">
                  <div className="flex items-center gap-3">
                    <Target size={24} className="text-[#d04f99]" />
                    <h2 className="text-xl font-black tracking-tight uppercase">Primary Directive</h2>
                  </div>
                  <div className="px-4 py-1.5 rounded-full bg-[#111] text-white text-[10px] font-black uppercase tracking-widest">
                    {subTasks.length > 0 ? `${subTasks.filter(s=>s.completed).length} / ${subTasks.length} Complete` : "Ready"}
                  </div>
                </div>

                {!subTasks.length ? (
                  <div className="flex-grow flex flex-col justify-center max-w-xl">
                    <h3 className="text-4xl md:text-5xl font-black text-[#111] tracking-tighter leading-none mb-6">
                      What's the main quest today?
                    </h3>
                    <input 
                      type="text" 
                      value={task}
                      onChange={(e) => setTask(e.target.value)}
                      placeholder="Enter singular directive..." 
                      className="w-full bg-[#111]/5 border-4 border-transparent rounded-[32px] py-6 px-10 text-2xl font-black focus:outline-none focus:border-[#d04f99] focus:bg-white transition-all placeholder:text-[#111]/20 mb-8"
                    />
                    <button 
                      onClick={breakDownTask}
                      disabled={!task}
                      className="arcade-button w-full flex items-center justify-center gap-3 text-xl disabled:opacity-50 disabled:grayscale"
                    >
                      <Zap size={24} /> BREAK IT DOWN (AI)
                    </button>
                  </div>
                ) : (
                  <div className="flex-grow">
                    <div className="flex items-center justify-between mb-8">
                       <h3 className="text-2xl font-black uppercase text-[#d04f99] tracking-tight">{task}</h3>
                       <button onClick={() => setIsFocusMode(true)} className="flex items-center gap-2 font-black text-sm text-[#2D8EFF] hover:opacity-70 transition-opacity">
                         <Maximize2 size={16} /> ENTER FOCUS CHAMBER
                       </button>
                    </div>
                    
                    <div className="space-y-4">
                      {subTasks.map((st) => (
                        <div 
                          key={st.id} 
                          onClick={() => toggleSubTask(st.id)}
                          className={`p-6 rounded-[24px] border-4 cursor-pointer transition-all flex items-center justify-between ${st.completed ? "bg-[#111]/5 border-[#111]/10 opacity-50" : "bg-white border-[#111] shadow-[4px_4px_0px_#111] hover:translate-x-[2px]"}`}
                        >
                          <span className={`text-xl font-black ${st.completed ? "line-through" : ""}`}>{st.text}</span>
                          <div className={`w-8 h-8 rounded-lg border-4 flex items-center justify-center ${st.completed ? "bg-[#d04f99] border-[#d04f99]" : "border-[#111]"}`}>
                            {st.completed && <X size={20} className="text-white rotate-45" />}
                          </div>
                        </div>
                      ))}
                    </div>

                    <button 
                      onClick={() => {setSubTasks([]); setTask("");}}
                      className="mt-10 text-sm font-black text-[#111]/30 hover:text-[#d04f99] uppercase tracking-widest transition-colors"
                    >
                      Reset Campaign
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar Widgets */}
            <div className="lg:col-span-4 flex flex-col gap-10">
              
              {/* Arcade Radio */}
              <div className="arcade-card p-10 border-[#111] shadow-[8px_8px_0px_#111] bg-white">
                <div className="flex items-center gap-3 mb-8 pb-4 border-b-4 border-[#111]/5">
                   <Brain size={20} className="text-[#2D8EFF]" />
                   <h2 className="text-sm font-black uppercase tracking-widest">Arcade Radio</h2>
                </div>
                
                <div className="flex flex-col items-center">
                  <div className="w-full aspect-video bg-[#111] rounded-[24px] mb-8 relative overflow-hidden flex items-center justify-center p-4">
                     {/* Visualizer Mock */}
                     <div className="flex items-end gap-1 h-12">
                       {[...Array(8)].map((_, i) => (
                         <div key={i} className={`w-2 bg-[#2D8EFF] rounded-full animate-bounce`} style={{ height: isPlaying ? '100%' : '20%', animationDelay: `${i * 0.1}s`, animationDuration: `${0.5 + Math.random()}s` }}></div>
                       ))}
                     </div>
                     <span className="absolute bottom-4 left-6 text-[10px] font-black text-white/40 uppercase tracking-widest">Current: Lofi Flow v.1</span>
                  </div>

                  <div className="flex items-center gap-6">
                    <button className="p-4 rounded-2xl bg-[#111]/5 text-[#111] hover:scale-110 transition-transform">
                      <SkipForward size={24} className="rotate-180" />
                    </button>
                    <button 
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="w-16 h-16 rounded-full bg-[#111] text-white flex items-center justify-center hover:scale-110 transition-transform shadow-xl"
                    >
                      {isPlaying ? <Pause size={30} fill="white" /> : <Play size={30} fill="white" className="ml-1" />}
                    </button>
                    <button className="p-4 rounded-2xl bg-[#111]/5 text-[#111] hover:scale-110 transition-transform">
                      <SkipForward size={24} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Journal Link */}
              <div 
                className="arcade-card p-10 bg-[#FFD700] border-[#d04f99] shadow-[8px_8px_0px_#d04f99] flex flex-col items-center justify-center text-center group cursor-pointer"
                onClick={() => window.location.href = '/journal'}
              >
                <div className="w-16 h-16 rounded-2xl bg-white/30 flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform">
                  <ListChecks size={32} className="text-[#111]" />
                </div>
                <h3 className="text-2xl font-black text-[#111] leading-none mb-2">BRAIN DUMP</h3>
                <p className="text-xs font-black uppercase tracking-widest text-[#111]/40 leading-none">Log Thought Flow</p>
              </div>

            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
