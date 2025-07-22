"use client";
import { Player } from "@lottiefiles/react-lottie-player";
import { LucideProps } from "lucide-react";
import React from "react";

interface Props extends LucideProps {
  size?: number;
  isActive?: boolean;
}

const Star1Icon: React.FC<Props> = ({ size = 40 }) => {
  return (
    <Player
      autoplay
      loop
      src="/star1.json"
      style={{ height: size, width: size }}
    />
  );
};

export default Star1Icon;