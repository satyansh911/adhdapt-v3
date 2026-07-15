"use client";
import { LucideProps } from "lucide-react";
import React from "react";
import OptimizedLottie from "@/components/OptimizedLottie";

interface Props extends LucideProps {
  size?: number;
  isActive?: boolean;
}

const ArcadeIcon: React.FC<Props> = ({ size = 120, isActive = false, className }) => {
  return (
    <OptimizedLottie
      src="/Arcade.json"
      size={size}
      active={isActive}
      className={className as string | undefined}
    />
  );
};

export default ArcadeIcon;
