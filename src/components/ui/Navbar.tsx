"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { SignInButton, SignUpButton, UserButton, SignedIn, SignedOut } from "@clerk/nextjs"

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur-[2px] transition-all duration-300">
      <div className="w-full max-w-6xl mx-auto flex h-20 items-center justify-between px-6 border-b border-border">
        
        {/* Left: Minimal Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 bg-foreground rounded-full flex items-center justify-center group-hover:bg-primary transition-colors duration-500">
            <div className="w-2 h-2 bg-background rounded-full" />
          </div>
          <span className="font-serif text-2xl tracking-wide text-foreground group-hover:text-primary transition-colors duration-500">
            ADHDapt
          </span>
        </Link>

        {/* Center: Spaced Editorial Navigation */}
        <nav className="hidden md:flex items-center space-x-12">
          <Link 
            href="/" 
            className="text-xs uppercase tracking-widest font-medium text-secondary-foreground hover:text-primary transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[1px] auto after:bg-primary after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-500 after:origin-left"
          >
            Home
          </Link>
          <Link 
            href="/dashboard" 
            className="text-xs uppercase tracking-widest font-medium text-secondary-foreground hover:text-primary transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[1px] auto after:bg-primary after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-500 after:origin-left"
          >
            Dashboard
          </Link>
          <Link 
            href="/journal" 
            className="text-xs uppercase tracking-widest font-medium text-secondary-foreground hover:text-primary transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[1px] auto after:bg-primary after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-500 after:origin-left"
          >
            Journal
          </Link>
        </nav>

        {/* Right: Auth Buttons */}
        <div className="flex items-center space-x-6">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="hidden sm:block text-xs uppercase tracking-widest font-medium text-foreground hover:text-primary transition-colors cursor-pointer">
                Sign In
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button variant="outline" size="sm" className="rounded-none border-foreground text-foreground hover:bg-foreground hover:text-background transition-colors duration-500">
                Get Started
              </Button>
            </SignUpButton>
          </SignedOut>

          <SignedIn>
            <UserButton afterSignOutUrl="/" appearance={{
              elements: {
                avatarBox: "w-8 h-8 rounded-full border border-border"
              }
            }} />
          </SignedIn>
        </div>
      </div>
    </header>
  )
}
