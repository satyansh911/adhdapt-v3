"use client";
import { Player } from "@lottiefiles/react-lottie-player";
import { LucideProps } from "lucide-react";
import React from "react";

interface Props extends LucideProps {
  size?: number;
  isActive?: boolean;
}

const FireIcon: React.FC<Props> = ({ size = 15 }) => {
  return (
    <Player
      autoplay
      loop
      src="/fire.json"
      style={{ height: size, width: size }}
    />
  );
};

export default FireIcon;