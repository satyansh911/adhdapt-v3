"use client";
import { Player } from "@lottiefiles/react-lottie-player";
import { LucideProps } from "lucide-react";
import React from "react";

interface Props extends LucideProps {
  size?: number;
  isActive?: boolean;
}

const PencilIcon: React.FC<Props> = ({ size = 60 }) => {
  return (
    <Player
      autoplay
      loop
      src="/pencil.json"
      style={{ height: size, width: size }}
    />
  );
};

export default PencilIcon;