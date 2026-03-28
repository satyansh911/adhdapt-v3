/* eslint-disable react/no-unescaped-entities */
"use client"

import React from "react"
import { Reveal } from "@/components/animations/Reveal"
import { Navbar } from "@/components/ui/Navbar"
import { BookOpen, Zap, Brain, Shield, Info, ArrowRight, User, Github, Twitter } from "lucide-react"

const categories = [
  {
    title: "THE THREE FLAVORS",
    icon: <BookOpen className="text-[#d04f99]" />,
    items: [
      { name: "Inattentive", desc: "The 'internal' presentation. Cognitive fog, daydreaming, and high distractibility without physical restlessness." },
      { name: "Hyperactive", desc: "The 'kinetic' presentation. High physical energy, verbal impulsivity, and constant motion." },
      { name: "Combined", desc: "The 'chaos' cocktail. Blending mental fog with physical drive. The most common modern diagnosis." }
    ]
  },
  {
    title: "STRATEGIC POWER-UPS",
    icon: <Zap className="text-[#FFC107]" />,
    items: [
      { name: "Time Boxing", desc: "Using high-contrast timers to turn an abstract hour into a visible, manageable colorful block." },
      { name: "Body Doubling", desc: "Working in the presence of others (online or in-person) to increase accountability baseline." },
      { name: "Dopamine Stacking", desc: "Pairing a 'boring' task with a pleasurable stimulus (like lofi beats or a fidget tool)." }
    ]
  }
];

const developers = [
  {
    name: "Satyansh Singh",
    role: "Architect & Dev",
    bio: "Focused on building the 'Nexus' engine. Satyansh designs systems that handle cognitive edge-cases and reduce executive friction.",
    color: "bg-[#2D8EFF]"
  },
  {
    name: "Kushagra Saxena",
    role: "Design Director",
    bio: "The visual soul of ADHDapt. Kushagra champions the 'Retro Arcade' aesthetic to make productivity feel like play.",
    color: "bg-[#d04f99]"
  }
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-[#111] font-sans selection:bg-[#d04f99] selection:text-white pb-40">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-6 pt-40">
        
        {/* Hero Section */}
        <section className="mb-32">
          <Reveal direction="down">
             <div className="flex flex-col items-center text-center">
                <span className="text-xs font-black tracking-[0.5em] uppercase text-[#111]/30 mb-6 flex items-center gap-4">
                  <div className="w-12 h-1 bg-[#111]/10 rounded-full" />
                  The Archive
                  <div className="w-12 h-1 bg-[#111]/10 rounded-full" />
                </span>
                <h1 className="text-7xl md:text-[10rem] font-black tracking-tighter leading-none mb-10 uppercase">
                  ADHD<span className="text-[#d04f99]">LOGS</span>
                </h1>
                <p className="text-xl md:text-2xl font-bold max-w-3xl leading-relaxed text-[#111]/70">
                  ADHD is not a deficit of attention—it is an inability to regulate it. 
                  A Ferrari engine with bicycle brakes. We build the brakes.
                </p>
             </div>
          </Reveal>
        </section>

        {/* Knowledge Bento */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-40">
          
          <div className="lg:col-span-8 flex flex-col gap-10">
            {categories.map((cat, i) => (
              <div key={i} className="arcade-card p-12 bg-white border-[#111] shadow-[12px_12px_0px_#111]">
                <div className="flex items-center gap-4 mb-10 pb-6 border-b-4 border-[#111]/5">
                  {cat.icon}
                  <h2 className="text-2xl font-black tracking-tighter uppercase">{cat.title}</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                   {cat.items.map((item, j) => (
                     <div key={j} className="flex flex-col">
                        <h3 className="text-lg font-black text-[#d04f99] mb-3 uppercase tracking-tight">{item.name}</h3>
                        <p className="text-sm font-bold leading-relaxed text-[#111]/60">
                          {item.desc}
                        </p>
                     </div>
                   ))}
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-4 flex flex-col gap-10">
            <div className="arcade-card p-10 bg-[#fdedc9] border-[#111] shadow-[10px_10px_0px_#111]">
              <div className="flex items-center justify-between mb-8">
                <Shield size={32} className="text-[#111]" />
                <span className="text-[10px] font-black uppercase tracking-widest text-[#111]/40">Warning: Shame Loop</span>
              </div>
              <h3 className="text-3xl font-black mb-4 tracking-tighter leading-none">NO MORE SHAME SPIRALS.</h3>
              <p className="text-sm font-black uppercase leading-relaxed text-[#111]/60">
                Most apps punish you for missing a day. ADHDapt welcomes you back with open arms and zero red dots.
              </p>
            </div>

            <div className="arcade-card p-10 bg-[#111] text-white border-[#d04f99] shadow-[10px_10px_0px_#d04f99]">
              <Info size={32} className="text-[#d04f99] mb-6" />
              <h3 className="text-2xl font-black mb-4 tracking-tight uppercase">THE MISSION</h3>
              <p className="text-sm font-bold leading-relaxed text-white/70">
                To turn the ADHD brain from a source of frustration into a high-energy playground. 
                We don't fix people; we fix tools.
              </p>
            </div>
          </div>
        </div>

        {/* Developer Section */}
        <section className="mb-40">
          <div className="flex items-center gap-6 mb-16">
            <h2 className="text-4xl font-black tracking-tighter uppercase">MEET THE DEVS</h2>
            <div className="h-2 flex-grow bg-[#111]/5 rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {developers.map((dev, i) => (
              <div key={i} className={`arcade-card p-12 bg-white border-[#111] shadow-[10px_10px_0px_#111] group`}>
                <div className="flex items-start justify-between mb-8">
                   <div className={`w-20 h-20 rounded-[24px] ${dev.color} flex items-center justify-center text-white border-4 border-[#111]`}>
                      <User size={40} />
                   </div>
                   <div className="flex gap-4">
                     <Github className="text-[#111]/20 hover:text-[#111] transition-colors cursor-pointer" />
                     <Twitter className="text-[#111]/20 hover:text-[#111] transition-colors cursor-pointer" />
                   </div>
                </div>
                <h3 className="text-4xl font-black tracking-tighter mb-2 uppercase">{dev.name}</h3>
                <p className="text-xs font-black uppercase tracking-[0.4em] text-[#d04f99] mb-8">{dev.role}</p>
                <p className="text-lg font-bold leading-relaxed text-[#111]/70">
                  {dev.bio}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Call to action footer */}
        <section className="arcade-card bg-[#fdedc9] p-20 flex flex-col items-center text-center border-[#d04f99] shadow-[16px_16px_0px_#d04f99]">
           <Brain size={64} className="mb-8 text-[#d04f99]" />
           <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase mb-8">Ready to enter the playground?</h2>
           <button 
             onClick={() => window.location.href = '/dashboard'}
             className="arcade-button text-2xl flex items-center gap-4"
           >
              GO TO DASHBOARD <ArrowRight size={28} />
           </button>
        </section>

      </main>
    </div>
  )
}
