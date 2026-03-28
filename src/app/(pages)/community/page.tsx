"use client"

import React, { useState, useEffect } from "react"
import { Reveal } from "@/components/animations/Reveal"
import { Navbar } from "@/components/ui/Navbar"
import { Users, MessageSquare, Flame, Star, Zap, Target, ArrowRight } from "lucide-react"

const mockFeed = [
  { id: 1, user: "Satyansh", vibe: "Focused", activity: "Refactoring Nexus Hub", time: "2m ago", color: "text-[#2D8EFF]" },
  { id: 2, user: "Kushagra", vibe: "Hyper", activity: "Designing Arcade Radio", time: "5m ago", color: "text-[#d04f99]" },
  { id: 3, user: "Alex_Z", vibe: "Foggy", activity: "Trying to start Brain Dump", time: "12m ago", color: "text-[#FFC107]" },
  { id: 4, user: "SarahW", vibe: "Good", activity: "Crushed 3 sub-tasks!", time: "15m ago", color: "text-green-500" },
  { id: 5, user: "Neo", vibe: "Neutral", activity: "Silent Co-working", time: "20m ago", color: "text-[#111]" },
];

export default function CommunityPage() {
  const [messages, setMessages] = useState(mockFeed);
  const [input, setInput] = useState("");

  const postVibe = () => {
    if (!input) return;
    const newMessage = {
      id: Date.now(),
      user: "You",
      vibe: "Good",
      activity: input,
      time: "Just now",
      color: "text-[#d04f99]"
    };
    setMessages([newMessage, ...messages]);
    setInput("");
  };

  return (
    <div className="min-h-screen bg-background text-[#111] font-sans selection:bg-[#d04f99] selection:text-white pb-40">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-6 pt-40">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <Reveal direction="down">
             <div className="flex flex-col items-start gap-0 leading-none">
                <h1 className="text-7xl md:text-9xl font-black tracking-tighter text-[#111] mb-2 uppercase">
                  VIBE<span className="text-[#2D8EFF]">BOARD</span>
                </h1>
                <div className="flex items-center gap-3 ml-1">
                   <div className="w-3 h-3 rounded-full bg-[#2D8EFF] animate-pulse shadow-[0_0_10px_rgba(45,142,255,0.5)]"></div>
                   <span className="text-xs font-black tracking-[0.3em] uppercase text-[#111]/40">42 Players Online</span>
                </div>
             </div>
          </Reveal>

          <div className="arcade-card p-6 bg-[#111] text-white border-[#2D8EFF] shadow-[6px_6px_0px_#2D8EFF] flex items-center gap-6">
             <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Total Community Focus</span>
                <span className="text-4xl font-black tracking-tighter uppercase whitespace-nowrap">892 HOURS TODAY</span>
             </div>
             <Flame className="text-[#FFC107] w-10 h-10 animate-pulse" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Main Feed */}
          <div className="lg:col-span-8 flex flex-col gap-10">
            
            {/* Input Wrapper */}
            <div className="arcade-card p-8 bg-[#fdedc9] border-[#111] shadow-[8px_8px_0px_#111]">
               <h3 className="text-sm font-black uppercase tracking-widest text-[#111]/40 mb-6 flex items-center gap-2">
                 <MessageSquare size={16} /> Broadcast Your Vibe
               </h3>
               <div className="flex flex-col md:flex-row gap-4">
                  <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Whipping up some code..."
                    className="flex-grow bg-[#111]/5 border-4 border-transparent rounded-[24px] py-5 px-8 text-xl font-black focus:outline-none focus:border-[#2D8EFF] transition-all placeholder:text-[#111]/10"
                  />
                  <button 
                    onClick={postVibe}
                    className="arcade-button bg-[#2D8EFF] text-white flex items-center justify-center gap-2"
                  >
                    POST VIBE
                  </button>
               </div>
            </div>

            {/* The Feed */}
            <div className="flex flex-col gap-6">
              {messages.map((m) => (
                <div key={m.id} className="arcade-card p-8 bg-white border-[#111] shadow-[6px_6px_0px_#111] flex flex-col md:flex-row md:items-center justify-between group">
                   <div className="flex items-center gap-6">
                      <div className="w-16 h-16 rounded-[20px] bg-[#111]/5 flex items-center justify-center border-4 border-[#111]/10 group-hover:scale-110 transition-transform">
                         <span className="font-black text-2xl uppercase">{m.user[0]}</span>
                      </div>
                      <div>
                         <div className="flex items-center gap-3">
                            <span className="text-lg font-black uppercase tracking-tighter">{m.user}</span>
                            <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border-2 border-current ${m.color}`}>
                               {m.vibe}
                            </span>
                         </div>
                         <p className="text-xl font-bold text-[#111]/70 mt-1">{m.activity}</p>
                      </div>
                   </div>
                   <div className="mt-4 md:mt-0 text-xs font-black uppercase tracking-widest text-[#111]/20">
                      {m.time}
                   </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 flex flex-col gap-10">
            
            <div className="arcade-card p-10 bg-white border-[#111] shadow-[8px_8px_0px_#111]">
              <h3 className="text-sm font-black uppercase tracking-widest text-[#111]/40 mb-8 flex items-center gap-2">
                <Star size={16} /> Weekly Leaders
              </h3>
              <div className="space-y-6">
                {[
                  { name: "Satyansh", points: "4,2k XP" },
                  { name: "Kushagra", points: "3,8k XP" },
                  { name: "SarahW", points: "2,1k XP" }
                ].map((l, i) => (
                  <div key={i} className="flex items-center justify-between pb-4 border-b-2 border-dashed border-[#111]/10">
                     <span className="text-lg font-black uppercase tracking-tight">{l.name}</span>
                     <span className="text-sm font-black text-[#d04f99]">{l.points}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="arcade-card p-10 bg-[#FFC107] border-[#111] shadow-[8px_8px_0px_#111] flex flex-col items-center justify-center text-center">
              <Zap className="mb-4" size={40} fill="#111" />
              <h3 className="text-3xl font-black mb-4 tracking-tighter leading-none uppercase">GROUP FOCUS ROOMS</h3>
              <p className="text-sm font-black uppercase leading-relaxed text-[#111]/60 mb-8">
                Silent co-working spaces with global neurodivergent thinkers.
              </p>
              <button className="arcade-button w-full border-[#111] shadow-none bg-[#111] text-white uppercase text-xs tracking-widest">
                ENTER ROOM [LOBBY]
              </button>
            </div>

            <div className="arcade-card p-10 bg-white border-[#d04f99] shadow-[8px_8px_0px_#d04f99] cursor-pointer hover:translate-x-1 transition-all group">
               <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xl font-black tracking-tight uppercase">Community Blog</h4>
                  <ArrowRight size={20} className="text-[#d04f99] group-hover:translate-x-2 transition-transform" />
               </div>
               <p className="text-xs font-bold text-[#111]/60 uppercase leading-relaxed tracking-tight">
                  Experiences shared by our neurodiverse community. Read and relate.
               </p>
            </div>

          </div>
        </div>
      </main>
    </div>
  )
}
