"use client";
import { LucideProps } from "lucide-react";
import React from "react";
import OptimizedLottie from "@/components/OptimizedLottie";

interface Props extends LucideProps {
  size?: number;
  isActive?: boolean;
}

const ScienceIcon: React.FC<Props> = ({ size = 80, isActive = false, className }) => {
  return (
    <OptimizedLottie
      src="/science.json"
      size={size}
      active={isActive}
      className={className as string | undefined}
    />
  );
};

export default ScienceIcon;
