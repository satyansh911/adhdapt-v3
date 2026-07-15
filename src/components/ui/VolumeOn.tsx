"use client";
import { LucideProps } from "lucide-react";
import React from "react";
import OptimizedLottie from "@/components/OptimizedLottie";

interface Props extends LucideProps {
  size?: number;
  isActive?: boolean;
}

const VolumeOnIcon: React.FC<Props> = ({ size = 30, isActive = false, className }) => {
  return (
    <OptimizedLottie
      src="/volumeon.json"
      size={size}
      active={isActive}
      className={className as string | undefined}
    />
  );
};

export default VolumeOnIcon;
