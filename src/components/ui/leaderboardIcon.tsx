"use client";
import { Player } from "@lottiefiles/react-lottie-player";
import { LucideProps } from "lucide-react";
import React from "react";

interface Props extends LucideProps {
  size?: number;       // Optional size in pixels
  isActive?: boolean;  // Optional active state
}

const LeaderboardIcon: React.FC<Props> = ({ size = 30}) => {
  return (
    <Player
      autoplay
      loop
      src="/leaderboard.json"
      style={{
        height: `${size}px`,
        width: `${size}px`,
      }}
    />
  );
};

export default LeaderboardIcon;
