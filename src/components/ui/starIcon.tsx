"use client";
import { Player } from "@lottiefiles/react-lottie-player";
import { LucideProps } from "lucide-react";
import React from "react";

interface Props extends LucideProps {
  size?: number;
  isActive?: boolean;
}

const StarIcon: React.FC<Props> = ({ size = 80 }) => {
  return (
    <Player
      autoplay
      loop
      src="/star.json"
      style={{ height: size, width: size }}
    />
  );
};

export default StarIcon;