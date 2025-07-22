"use client";
import { Player } from "@lottiefiles/react-lottie-player";
import { LucideProps } from "lucide-react";
import React, { useRef, useImperativeHandle, forwardRef } from "react";

interface Props extends LucideProps {
  size?: number;
}

const SquirrelIcon = forwardRef(({ size = 80 }: Props, ref) => {
  const playerRef = useRef<Player>(null);

  useImperativeHandle(ref, () => ({
    playAnimation: () => {
      playerRef.current?.play();
    },
  }));

  const handleClick = () => {
    playerRef.current?.play();
  };

  return (
    <div
      onClick={handleClick}
      style={{
        cursor: "pointer",
        display: "inline-block",
        height: size,
        width: size,
      }}
    >
      <Player
        ref={playerRef}
        src="/squirrel.json"
        style={{ height: size, width: size }}
      />
    </div>
  );
});

export default SquirrelIcon;