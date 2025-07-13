"use client";
import { Player } from "@lottiefiles/react-lottie-player";
import { LucideProps } from "lucide-react";
import React from "react";

interface Props extends LucideProps {
  size?: number;       // Optional size in pixels
  isActive?: boolean;  // Optional active state
}

const Badge1Icon: React.FC<Props> = ({ size = 40}) => {
  return (
    <Player
      autoplay
      loop
      src="/badge1.json"
      style={{ height: `${size}px`, width: `${size}px` }}
    />
  );
};

export default Badge1Icon;
