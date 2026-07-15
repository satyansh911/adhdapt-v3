"use client";

import { useEffect, useRef, useState } from "react";

interface RevealProps {
  children: React.ReactNode;
  /** Delay before the reveal starts, in ms. */
  delay?: number;
  className?: string;
}

/**
 * Fades + slides its children up once they scroll into view. Uses only
 * opacity/transform (compositor-friendly) so it stays smooth, and disconnects
 * the observer after the first reveal.
 */
export default function Reveal({ children, delay = 0, className = "" }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Respect reduced-motion preference.
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "none" : "translateY(32px)",
        transition: `opacity 0.6s ease ${delay}ms, transform 0.7s cubic-bezier(0.22, 0.61, 0.36, 1) ${delay}ms`,
        willChange: shown ? "auto" : "opacity, transform",
      }}
    >
      {children}
    </div>
  );
}
