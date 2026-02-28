"use client";

import { SpiralPoint } from "./spiralMath";
import { StoryStop } from "./types";
import { StoryCard } from "./StoryCard";

const SVG_HALF = 300; // half of the 600×600 viewBox

interface SpiralStopProps {
  stop: StoryStop;
  position: SpiralPoint;
  isActive: boolean;
  isNext: boolean;
  onWalk: () => void;
  stageTiltDeg: number;
}

export function SpiralStop({
  stop,
  position,
  isActive,
  isNext,
  onWalk,
  stageTiltDeg,
}: SpiralStopProps) {
  return (
    <div
      style={{
        position: "absolute",
        // pre-compute offset as one number to avoid SSR/client calc() string mismatch
        left: `calc(50% + ${(position.x - SVG_HALF).toFixed(2)}px)`,
        top: `calc(50% + ${(position.y - SVG_HALF).toFixed(2)}px)`,
        // center on the point, lift above the floor, counter-rotate to face viewer
        transform: `translateX(-50%) translateY(-100%) rotateX(${-stageTiltDeg}deg) translateZ(30px)`,
        transformStyle: "preserve-3d",
        transformOrigin: "50% 100%",
        zIndex: isActive ? 20 : isNext ? 15 : 10,
      }}
    >
      <StoryCard
        stop={stop}
        isActive={isActive}
        isNext={isNext}
        onWalk={onWalk}
      />
    </div>
  );
}
