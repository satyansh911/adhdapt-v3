"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

interface RevealProps {
  children: React.ReactNode;
  width?: "w-fit" | "w-full";
  direction?: "up" | "down" | "left" | "right" | "none";
  delay?: number;
  duration?: number;
  className?: string;
}

export const Reveal = ({ 
  children, 
  width = "w-full", 
  direction = "up",
  delay = 0,
  duration = 0.8,
  className = ""
}: RevealProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;

    let yOffset = 0;
    let xOffset = 0;

    switch(direction) {
      case "up": yOffset = 40; break;
      case "down": yOffset = -40; break;
      case "left": xOffset = 40; break;
      case "right": xOffset = -40; break;
      case "none": break;
    }

    gsap.fromTo(containerRef.current,
      {
        y: yOffset,
        x: xOffset,
        opacity: 0
      },
      {
        y: 0,
        x: 0,
        opacity: 1,
        duration: duration,
        delay: delay,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%", // Trigger when the top of the element hits 85% of the viewport height
          toggleActions: "play none none reverse",
        }
      }
    );
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className={`${width} ${className} opacity-0`}>
      {children}
    </div>
  );
};
