"use client";

import { useState, useCallback, useRef } from "react";
import { useAnimation } from "framer-motion";
import { SpiralPoint } from "./spiralMath";
import { WalkState } from "./types";

export function useCharacterWalk(stopPositions: SpiralPoint[]) {
  const [currentStop, setCurrentStop] = useState(0);
  const [walkState, setWalkState] = useState<WalkState>("idle");
  const controls = useAnimation();
  // track cumulative offset so each walkTo is relative to absolute position
  const currentPos = useRef<SpiralPoint>(stopPositions[0]);

  const walkTo = useCallback(
    async (targetStop: number) => {
      if (walkState === "walking") return;
      if (targetStop === currentStop) return;
      if (targetStop < 0 || targetStop >= stopPositions.length) return;

      const to = stopPositions[targetStop];
      setWalkState("walking");

      // animate to absolute SVG coordinates using x/y motion values
      await controls.start({
        x: to.x,
        y: to.y,
        transition: {
          duration: 1.4,
          ease: [0.4, 0, 0.2, 1],
        },
      });

      currentPos.current = to;
      setCurrentStop(targetStop);
      setWalkState("arrived");

      // brief arrived pause then idle
      setTimeout(() => setWalkState("idle"), 400);
    },
    [currentStop, walkState, stopPositions, controls]
  );

  const walkNext = useCallback(() => {
    walkTo(Math.min(currentStop + 1, stopPositions.length - 1));
  }, [currentStop, stopPositions.length, walkTo]);

  const walkPrev = useCallback(() => {
    walkTo(Math.max(currentStop - 1, 0));
  }, [currentStop, walkTo]);

  return {
    currentStop,
    walkState,
    controls,
    walkTo,
    walkNext,
    walkPrev,
    isFirst: currentStop === 0,
    isLast: currentStop === stopPositions.length - 1,
  };
}
