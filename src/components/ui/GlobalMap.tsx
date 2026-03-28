"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Globe, Users, Info, Activity } from "lucide-react"

// Realistic high-fidelity simplified world map paths
const mapPaths = [
  { 
    id: "na", 
    name: "North America", 
    d: "M 150 150 L 170 140 L 200 135 L 240 140 L 260 160 L 250 180 L 230 200 L 240 230 L 220 260 L 190 270 L 170 250 L 160 220 L 150 190 Z", 
    color: "#2D8EFF",
    stats: "6.1% Prevalence" 
  },
  { 
    id: "sa", 
    name: "South America", 
    d: "M 230 280 L 260 290 L 290 320 L 270 380 L 250 420 L 230 400 L 220 350 L 225 300 Z", 
    color: "#1C7AE5",
    stats: "5.2% Prevalence" 
  },
  { 
    id: "eu", 
    name: "Europe", 
    d: "M 450 180 L 480 170 L 520 175 L 530 200 L 510 230 L 470 235 L 445 210 Z", 
    color: "#2D8EFF",
    stats: "4.8% Prevalence" 
  },
  { 
    id: "af", 
    name: "Africa", 
    d: "M 460 250 L 520 260 L 550 300 L 530 380 L 490 410 L 460 380 L 440 320 L 450 270 Z", 
    color: "#1C7AE5",
    stats: "5.9% Prevalence" 
  },
  { 
    id: "as", 
    name: "Asia", 
    d: "M 540 160 L 600 150 L 700 165 L 780 190 L 800 240 L 780 320 L 700 340 L 620 330 L 580 300 L 560 220 Z", 
    color: "#2D8EFF",
    stats: "5.4% Prevalence" 
  },
  { 
    id: "oc", 
    name: "Oceania", 
    d: "M 720 360 L 780 370 L 810 400 L 780 430 L 730 420 L 710 380 Z", 
    color: "#1C7AE5",
    stats: "6.3% Prevalence" 
  },
  { 
    id: "gr", 
    name: "Greenland", 
    d: "M 280 110 L 330 115 L 340 140 L 310 155 L 290 140 Z", 
    color: "#BDE3FF",
    stats: "N/A" 
  }
]

// ADHD Data Points (Dopamine Orbs)
const dataPoints = [
  { id: 1, x: 210, y: 190, region: "North America", count: "18.2M", detail: "Highest adult diagnosis growth in 2024." },
  { id: 2, x: 260, y: 350, region: "South America", count: "12.4M", detail: "Rising awareness in metropolitan areas." },
  { id: 3, x: 490, y: 205, region: "Europe", count: "21.6M", detail: "Strong neurodiversity workplace initiatives." },
  { id: 4, x: 500, y: 330, region: "Africa", count: "15.8M", detail: "Improving access to diagnostic tools." },
  { id: 5, x: 680, y: 240, region: "Asia", count: "42.1M", detail: "Massive shift in mental health perception." },
  { id: 6, x: 760, y: 395, region: "Oceania", count: "3.2M", detail: "Leadership in digital management tools." },
]

export function GlobalMap() {
  const [hoveredPoint, setHoveredPoint] = useState<typeof dataPoints[0] | null>(null)

  return (
    <div className="relative w-full bg-white border-4 border-[#111] rounded-[48px] p-8 md:p-12 shadow-[16px_16px_0px_#111] overflow-hidden min-h-[600px] flex flex-col md:flex-row items-center gap-12">
      
      {/* Background Grid */}
      <div className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(#111 1px, transparent 1px), linear-gradient(90deg, #111 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>

      {/* Info Section */}
      <div className="relative z-10 w-full md:w-1/3 flex flex-col items-start text-left">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#2D8EFF]/10 flex items-center justify-center text-[#2D8EFF]">
            <Globe size={28} />
          </div>
          <span className="font-black tracking-widest text-[#111] text-sm uppercase">Global Atlas (V2.0)</span>
        </div>
        
        <h2 className="text-5xl md:text-7xl font-display font-black leading-[0.9] text-[#111] mb-6 tracking-tighter">
          GLOBAL<br />PREVALENCE
        </h2>
        
        <p className="text-[#666] text-lg font-medium leading-relaxed mb-8">
          ADHD crossses all borders. Over <span className="text-[#2D8EFF] font-black">366M+ adults</span> globally use various &quot;Design for the Glitch&quot; strategies to thrive.
        </p>

        <div className="flex flex-col gap-4 w-full">
          <div className="p-5 rounded-[24px] bg-[#111] text-white flex items-center gap-4">
            <Users className="text-[#2D8EFF]" />
            <div>
              <div className="text-xs font-bold text-white/50 uppercase tracking-widest">Global Status</div>
              <div className="text-2xl font-black">5.4% Prevalence</div>
            </div>
          </div>
          
          <div className="bg-[#2D8EFF]/10 border-2 border-[#2D8EFF]/20 rounded-[24px] p-5 flex items-center gap-3">
            <Info size={20} className="text-[#2D8EFF]" />
            <p className="text-sm font-bold text-[#2D8EFF]/80 leading-tight">Hover over an orb for regional insights.</p>
          </div>
        </div>
      </div>

      {/* Realistic Map Canvas */}
      <div className="relative z-10 w-full md:w-2/3 h-[400px] md:h-[550px] flex items-center justify-center">
        <svg viewBox="0 0 1000 500" className="w-full h-full drop-shadow-2xl">
          {/* Continent Shadows */}
          {mapPaths.map((path) => (
            <path
              key={`${path.id}-shadow`}
              d={path.d}
              fill="#111"
              opacity="0.05"
              transform="translate(6, 6)"
            />
          ))}

          {/* Continents */}
          {mapPaths.map((path) => (
            <motion.path
              key={path.id}
              d={path.d}
              fill={path.color}
              stroke="white"
              strokeWidth="2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.2 }}
              whileHover={{ opacity: 0.4, transition: { duration: 0.2 } }}
              className="transition-opacity"
            />
          ))}

          {/* Markers */}
          {dataPoints.map((point) => (
            <g 
              key={point.id} 
              onMouseEnter={() => setHoveredPoint(point)}
              onMouseLeave={() => setHoveredPoint(null)}
              className="cursor-pointer"
            >
              <circle cx={point.x} cy={point.y} r="14" fill="#E91E63" className="animate-ping opacity-10" />
              <circle cx={point.x} cy={point.y} r="8" fill="#E91E63" />
              <circle cx={point.x} cy={point.y} r="12" fill="none" stroke="#E91E63" strokeWidth="2" opacity="0.5" />
            </g>
          ))}
        </svg>

        {/* Floating Tooltip */}
        <AnimatePresence>
          {hoveredPoint && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              className="absolute z-50 p-6 bg-white border-4 border-[#111] rounded-[32px] shadow-[8px_8px_0px_#111] min-w-[260px] pointer-events-none"
              style={{ 
                left: `${(hoveredPoint.x / 1000) * 100}%`, 
                top: `${(hoveredPoint.y / 500) * 100}%`,
                transform: 'translate(-50%, -120%)'
              }}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-[#E91E63]/10 flex items-center justify-center text-[#E91E63]">
                  <Activity size={20} />
                </div>
                <h4 className="font-black text-2xl text-[#111]">{hoveredPoint.region}</h4>
              </div>
              <div className="text-4xl font-black text-[#E91E63] mb-1">{hoveredPoint.count}</div>
              <p className="text-[#666] font-bold text-base leading-tight">{hoveredPoint.detail}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Decorative blobs */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#E91E63]/5 rounded-full blur-[80px]"></div>
    </div>
  )
}
