"use client";
import { Player } from "@lottiefiles/react-lottie-player";
import { LucideProps } from "lucide-react";
import React from "react";

interface Props extends LucideProps {
  size?: number;
  isActive?: boolean;
}

const SearchIcon: React.FC<Props> = ({ size = 50 }) => {
  return (
    <Player
      autoplay
      loop
      src="/search.json"
      style={{ height: size, width: size }}
    />
  );
};

export default SearchIcon;