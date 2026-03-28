"use client"

import React, { useState, useEffect, useRef } from "react"
import { Reveal } from "@/components/animations/Reveal"
import { Navbar } from "@/components/ui/Navbar"
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'
import { Sparkles, History, PenTool, LayoutDashboard, Brain, Star } from "lucide-react"
import gsap from "gsap"

const moodData = [
  { name: 'Focused', value: 45, color: '#2D8EFF' },
  { name: 'Hyper', value: 25, color: '#E91E63' },
  { name: 'Foggy', value: 30, color: '#FFC107' },
];

const weeklyData = [
  { day: 'Mon', focus: 4, mood: 5 },
  { day: 'Tue', focus: 7, mood: 6 },
  { day: 'Wed', focus: 5, mood: 4 },
  { day: 'Thu', focus: 8, mood: 8 },
  { day: 'Fri', focus: 3, mood: 5 },
  { day: 'Sat', focus: 9, mood: 7 },
  { day: 'Sun', focus: 6, mood: 9 },
];

export default function JournalPage() {
  const orbsRef = useRef<HTMLDivElement>(null);
  const [view, setView] = useState<'write' | 'reflect'>('write');
  const [content, setContent] = useState("");

  useEffect(() => {
    if (!orbsRef.current) return;
    const orbs = orbsRef.current.children;
    gsap.to(orbs[0], { y: "40px", x: "30px", ease: "sine.inOut", duration: 7, repeat: -1, yoyo: true });
    gsap.to(orbs[1], { y: "50px", x: "-40px", ease: "sine.inOut", duration: 9, repeat: -1, yoyo: true });
  }, []);

  return (
    <div className="relative min-h-screen bg-background text-foreground font-sans selection:bg-[#d04f99] selection:text-white pb-32">
      
      {/* Background Orbs */}
      <div ref={orbsRef} className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="orb orb-pink w-[600px] h-[600px] top-[10%] left-[-10%] opacity-20"></div>
        <div className="orb orb-yellow w-[500px] h-[500px] bottom-[10%] right-[-5%] opacity-20"></div>
      </div>

      <div className="relative z-10">
        <Navbar />
        
        <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-36">
          
          {/* Header & Tabs */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
            <div>
              <h1 className="text-7xl md:text-9xl font-black tracking-tighter text-[#111] mb-2 uppercase">
                BRAIN<span className="text-[#d04f99]">DUMP</span>
              </h1>
              <div className="flex items-center gap-3 ml-1">
                 <div className="w-3 h-3 rounded-full bg-[#d04f99] animate-pulse"></div>
                 <span className="text-xs font-black tracking-[0.3em] uppercase text-[#111]/40 uppercase">Reflection Active</span>
              </div>
            </div>

            <div className="flex bg-[#111]/5 p-2 rounded-[24px] border-4 border-[#111]">
              <button 
                onClick={() => setView('write')}
                className={`flex items-center gap-2 px-8 py-4 rounded-[18px] font-black text-sm uppercase tracking-widest transition-all ${view === 'write' ? 'bg-[#111] text-white' : 'text-[#111]/40 hover:text-[#111]'}`}
              >
                <PenTool size={18} /> Dump
              </button>
              <button 
                onClick={() => setView('reflect')}
                className={`flex items-center gap-2 px-8 py-4 rounded-[18px] font-black text-sm uppercase tracking-widest transition-all ${view === 'reflect' ? 'bg-[#111] text-white' : 'text-[#111]/40 hover:text-[#111]'}`}
              >
                <History size={18} /> Reflect
              </button>
            </div>
          </div>

          {view === 'write' ? (
            <Reveal key="write">
                <div className="arcade-card bg-[#fdedc9] p-10 min-h-[60vh] flex flex-col border-[#d04f99] shadow-[12px_12px_0px_#d04f99]">
                  <textarea 
                    className="w-full flex-grow bg-transparent resize-none focus:outline-none font-black text-3xl md:text-4xl tracking-tight leading-tight placeholder:text-[#111]/10 text-[#111]"
                    placeholder="Drop the noise here..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  />
                  
                  <div className="mt-10 flex justify-between items-center pt-8 border-t-4 border-[#111]/5">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#111]/30">UNPROCESSED DATA FLOW</span>
                    <button className="arcade-button">SAVE TO ARCHIVE</button>
                  </div>
                </div>
            </Reveal>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              {/* Insight Stats */}
              <div className="lg:col-span-4 flex flex-col gap-10">
                <div className="arcade-card p-10 bg-white border-[#111] shadow-[8px_8px_0px_#111]">
                  <h3 className="text-xs font-black uppercase tracking-widest text-[#111]/40 mb-8">Dominant Tone</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={moodData}
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {moodData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={4} stroke="#111" />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-8 space-y-4">
                    {moodData.map((m) => (
                      <div key={m.name} className="flex items-center justify-between">
                         <div className="flex items-center gap-2">
                           <div className="w-3 h-3 rounded-full" style={{ backgroundColor: m.color }}></div>
                           <span className="text-sm font-black uppercase tracking-tight">{m.name}</span>
                         </div>
                         <span className="text-sm font-black">{m.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="arcade-card p-8 bg-[#2D8EFF] text-white border-[#111] shadow-[8px_8px_0px_#111]">
                  <Star className="mb-4" size={24} fill="white" />
                  <h3 className="text-xl font-black leading-tight mb-2 uppercase">INSIGHT:</h3>
                  <p className="text-sm font-black uppercase tracking-tight leading-relaxed text-white/80">
                    Your focus peaks during high pressure periods. Consider moving critical quests to Tuesday mornings.
                  </p>
                </div>
              </div>

              {/* Weekly Flow Graph */}
              <div className="lg:col-span-8">
                <div className="arcade-card p-10 bg-white border-[#111] shadow-[8px_8px_0px_#111] h-full">
                  <h3 className="text-xs font-black uppercase tracking-widest text-[#111]/40 mb-12">Cognitive Load (7 Days)</h3>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={weeklyData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#111" strokeOpacity={0.05} />
                        <XAxis 
                          dataKey="day" 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fill: '#111', fontWeight: '900', fontSize: 12 }} 
                        />
                        <YAxis hide />
                        <Tooltip 
                          cursor={{ fill: '#111', fillOpacity: 0.05 }}
                          contentStyle={{ backgroundColor: '#111', border: 'none', borderRadius: '12px' }}
                          itemStyle={{ color: '#fff', fontWeight: '900', textTransform: 'uppercase', fontSize: '10px' }}
                        />
                        <Bar 
                          dataKey="focus" 
                          fill="#d04f99" 
                          radius={[8, 8, 0, 0]} 
                          stroke="#111" 
                          strokeWidth={2}
                        />
                        <Bar 
                          dataKey="mood" 
                          fill="#2D8EFF" 
                          radius={[8, 8, 0, 0]} 
                          stroke="#111" 
                          strokeWidth={2}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-10 flex gap-10">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 border-2 border-[#111] bg-[#d04f99] rounded-md"></div>
                      <span className="text-xs font-black uppercase tracking-widest">Focus Level</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 border-2 border-[#111] bg-[#2D8EFF] rounded-md"></div>
                      <span className="text-xs font-black uppercase tracking-widest">Mood Vibe</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  )
}
