"use client";
import { LucideProps } from "lucide-react";
import React from "react";
import OptimizedLottie from "@/components/OptimizedLottie";

interface Props extends LucideProps {
  size?: number;
  isActive?: boolean;
}

const PencilIcon: React.FC<Props> = ({ size = 60, isActive = false, className }) => {
  return (
    <OptimizedLottie
      src="/pencil.json"
      size={size}
      active={isActive}
      className={className as string | undefined}
    />
  );
};

export default PencilIcon;
