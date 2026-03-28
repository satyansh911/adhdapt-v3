"use client"

import React from "react"
import Link from "next/link"
import { SignInButton, SignUpButton, UserButton, SignedIn, SignedOut } from "@clerk/nextjs"
import { Sparkles, LayoutGrid } from "lucide-react"

export function Navbar() {
  return (
    <header className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 flex items-center justify-between px-8 py-4 sgf-nav w-[90%] max-w-6xl transition-all duration-300">
      
      {/* Left: Arcade Branding & Links */}
      <div className="flex items-center gap-10">
        <Link href="/" className="group flex flex-col items-start gap-0 leading-none">
          <div className="flex items-center gap-2">
            <LayoutGrid className="w-6 h-6 text-[#2D8EFF]" />
            <h1 className="text-3xl font-black tracking-tighter text-[#111]">
              ADHD<span className="text-[#E91E63]">APT</span>
            </h1>
          </div>
          <span className="text-[10px] font-black tracking-[0.4em] uppercase text-[#111]/40 ml-[28px] mt-0.5">ARCADE</span>
        </Link>
        
        <nav className="hidden lg:flex items-center gap-8 font-bold text-[15px] tracking-tight">
          <Link href="/" className="text-[#2D8EFF] flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2D8EFF]"></span>
            Home
          </Link>
          <Link href="/dashboard" className="text-[#666] hover:text-[#d04f99] transition-colors">Nexus</Link>
          <Link href="/journal" className="text-[#666] hover:text-[#d04f99] transition-colors">Journal</Link>
          <Link href="/community" className="text-[#666] hover:text-[#2D8EFF] transition-colors">Board</Link>
          <Link href="/about" className="text-[#666] hover:text-[#FFC107] transition-colors">Archive</Link>
          <Link href="/mySpace/game" className="text-[#666] hover:text-[#d04f99] transition-colors flex items-center gap-1.5 ml-2">
            <span className="px-1.5 py-0.5 rounded-md bg-[#d04f99]/10 text-[#d04f99] text-[10px] uppercase font-black">Play</span>
            Arcade
          </Link>
        </nav>
      </div>

      {/* Right: Auth & Focus Mode */}
      <div className="flex items-center space-x-6">
        
        <Link href="/tools/timer" className="text-[15px] font-black flex items-center gap-2 hidden md:flex text-[#111] hover:text-[#FFC107] transition-colors">
          <Sparkles className="w-5 h-5 text-[#FFC107]" /> 
          FOCUS MODE
        </Link>
        
        <div className="h-8 w-px bg-[#111]/10 hidden md:block"></div>

        <SignedOut>
          <div className="flex items-center gap-4">
            <SignInButton mode="modal">
              <button className="text-[15px] font-black text-[#666] hover:text-[#111] transition-colors cursor-pointer">
                LOG IN
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="px-8 py-3 bg-[#E91E63] text-white rounded-full font-black text-sm shadow-[4px_4px_0px_#111] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all border-2 border-[#111]">
                SIGN UP
              </button>
            </SignUpButton>
          </div>
        </SignedOut>

        <SignedIn>
          <UserButton afterSignOutUrl="/" appearance={{
            elements: {
              avatarBox: "w-10 h-10 rounded-full border-4 border-[#111] shadow-[4px_4px_0px_#111] hover:scale-110 transition-transform"
            }
          }} />
        </SignedIn>
      </div>
    </header>
  )
}
