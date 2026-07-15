"use client";
import { LucideProps } from "lucide-react";
import React from "react";
import OptimizedLottie from "@/components/OptimizedLottie";

interface Props extends LucideProps {
  size?: number;
  isActive?: boolean;
}

const FocusFlowIcon: React.FC<Props> = ({ size = 40, isActive = false, className }) => {
  return (
    <OptimizedLottie
      src="/focusFlow.json"
      size={size}
      active={isActive}
      className={className as string | undefined}
    />
  );
};

export default FocusFlowIcon;
