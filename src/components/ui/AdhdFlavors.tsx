"use client"

import React from "react"
import { Zap, Activity, Brain, ArrowRight } from "lucide-react"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogDescription
} from "@/components/ui/dialog"

const flavors = [
  {
    id: "inattentive",
    title: "Inattentive",
    icon: <Zap size={32} />,
    color: "#E91E63", // Standard Arcade Pink
    hoverColor: "#d04f99",
    description: "The daydreamers. Zoned out mid-sentence, struggling with organization and \"hidden\" tasks.",
    details: "Often misdiagnosed or missed entirely, this flavor is internal. You aren't physically running around, but your mind is.",
    signs: ["Losing essentials daily", "Time Blindness (underestimating duration)", "Task Paralysis when overwhelmed", "Deep, frequent daydreaming"]
  },
  {
    id: "hyperactive",
    title: "Hyperactive",
    icon: <Activity size={32} />,
    color: "#2D8EFF", // Sky Blue
    hoverColor: "#1C7AE5",
    description: "The kinetic engines. Physical restlessness, talking at lightspeed, chronic interrupting.",
    details: "The external engine. This presentation is about a brain that processes kinetic and verbal signals at lightspeed.",
    signs: ["Fidgeting or constant movement", "Talking excessively", "Interrupting others", "Acting purely on instinct"]
  },
  {
    id: "combined",
    title: "Combined",
    icon: <Brain size={32} />,
    color: "#111111", // Deep Charcoal
    hoverColor: "#000000",
    description: "The chaos cocktail. Blending physical restlessness with heavy mental fog at the same time.",
    details: "The most common modern diagnosis. It blends kinetic restlessness with heavy internal distractions.",
    signs: ["Simultaneous fog and physical drive", "Varying, intense hyperfocus sessions", "Need for significant environmental variety", "Emotional intensity"]
  }
]

export function AdhdFlavors() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 w-full mb-12">
      {flavors.map((flavor) => (
        <Dialog key={flavor.id}>
          <DialogTrigger asChild>
            <div 
              className="group bg-[#fdedc9] border-4 rounded-[48px] p-10 shadow-[5px_5px_0px] transition-all duration-300 cursor-pointer hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
              style={{ 
                borderColor: flavor.color,
                boxShadow: `5px 5px 0px ${flavor.color}` 
              }}
            >
              <div 
                className="w-16 h-16 rounded-[24px] flex items-center justify-center mb-8 transition-colors font-black border-2"
                style={{ 
                  backgroundColor: `${flavor.color}15`, 
                  color: flavor.color,
                  borderColor: `${flavor.color}30`
                }}
              >
                {flavor.icon}
              </div>
              <h4 className="text-4xl font-black mb-4 flex items-center justify-between group-hover:opacity-80 transition-opacity tracking-tighter">
                {flavor.title} <ArrowRight size={24} className="text-[#111]/30 group-hover:text-[#111] transition-all" />
              </h4>
              <p className="text-[#111]/70 font-bold leading-relaxed text-lg transition-colors">
                {flavor.description}
              </p>
            </div>
          </DialogTrigger>
          <DialogContent className="max-w-2xl rounded-[48px] border-4 p-12 bg-[#fdedc9] shadow-[12px_12px_0px_#111]" style={{ borderColor: flavor.color }}>
            <DialogHeader>
              <DialogTitle className="text-5xl font-black mb-6 tracking-tighter leading-none" style={{ color: flavor.color }}>
                {flavor.title.toUpperCase()}
              </DialogTitle>
              <DialogDescription className="text-xl text-[#111] font-bold leading-relaxed pb-6 border-b-4 border-[#111]/10">
                {flavor.details}
              </DialogDescription>
              <div className="mt-8">
                <h5 className="font-black text-[#111] mb-6 uppercase tracking-[0.2em] text-xs opacity-50">Diagnostic Signs:</h5>
                <ul className="grid grid-cols-1 gap-4">
                  {flavor.signs.map((sign, idx) => (
                    <li key={idx} className="flex items-center gap-4 font-black text-[#111] text-lg">
                      <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: flavor.color }}></div>
                      {sign}
                    </li>
                  ))}
                </ul>
              </div>
            </DialogHeader>
            <div className="mt-10 flex justify-end">
                <button 
                  className="px-10 py-4 rounded-[20px] bg-[#111] text-white font-black hover:scale-105 transition-all text-sm uppercase tracking-widest shadow-[6px_6px_0px] shadow-[#111]/20"
                >
                  Deep Dive
                </button>
            </div>
          </DialogContent>
        </Dialog>
      ))}
    </div>
  )
}
