"use client";

import type React from "react";
import OptimizedLottie from "@/components/OptimizedLottie";

interface LottieSafeWrapperProps {
  src: string;
  size?: number;
  autoplay?: boolean;
  /**
   * Kept for backwards compatibility. `loop` now maps to OptimizedLottie's
   * `active`: when true the animation loops continuously (only while on
   * screen); when false it plays once and freezes on its last frame.
   */
  loop?: boolean;
  fallbackIcon?: string;
  className?: string;
}

export const LottieSafeWrapper: React.FC<LottieSafeWrapperProps> = ({
  src,
  size = 24,
  loop = false,
  fallbackIcon = "⚡",
  className = "",
}) => {
  return (
    <OptimizedLottie
      src={src}
      size={size}
      active={loop}
      className={className}
      fallback={
        <span
          style={{ fontSize: size * 0.6 }}
          className="flex h-full w-full items-center justify-center text-muted-foreground"
        >
          {fallbackIcon}
        </span>
      }
    />
  );
};
