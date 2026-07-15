"use client";
import { LucideProps } from "lucide-react";
import React from "react";
import OptimizedLottie from "@/components/OptimizedLottie";

interface Props extends LucideProps {
  size?: number;
  isActive?: boolean;
}

const EngageIcon: React.FC<Props> = ({ size = 80, isActive = false, className }) => {
  return (
    <OptimizedLottie
      src="/engaging.json"
      size={size}
      active={isActive}
      className={className as string | undefined}
    />
  );
};

export default EngageIcon;
