"use client";
import { Player } from "@lottiefiles/react-lottie-player";
import { LucideProps } from "lucide-react";
import React from "react";

interface Props extends LucideProps {
  size?: number;
  isActive?: boolean;
}

const ArrowIcon: React.FC<Props> = ({ size = 30 }) => {
  return (
    <Player
      autoplay
      loop
      src="/arrow.json"
      style={{ height: size, width: size, transform: "rotate(180deg)" }}
    />
  );
};

export default ArrowIcon;