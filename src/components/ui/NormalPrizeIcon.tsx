"use client";
import { LucideProps } from "lucide-react";
import React from "react";
import OptimizedLottie from "@/components/OptimizedLottie";

interface Props extends LucideProps {
  size?: number;
  isActive?: boolean;
}

const NormalPrizeIcon: React.FC<Props> = ({ size = 40, isActive = false, className }) => {
  return (
    <OptimizedLottie
      src="/normalPrize.json"
      size={size}
      active={isActive}
      className={className as string | undefined}
    />
  );
};

export default NormalPrizeIcon;
