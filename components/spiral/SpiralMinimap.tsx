"use client";

import { useEffect, useRef } from "react";
import { SPIRAL_3D_CONFIG, SPIRAL_STOPS } from "./spiralData";

const { a, b, thetaMax } = SPIRAL_3D_CONFIG;
const STEPS = 200;

// pre-generate spiral points in world XZ space (same math as 3D curve)
const spiralPts: [number, number][] = [];
for (let i = 0; i <= STEPS; i++) {
  const theta = (i / STEPS) * thetaMax;
  const r = a + b * theta;
  spiralPts.push([r * Math.cos(theta), r * Math.sin(theta)]);
}

// approximate world XZ position at a progress value 0..1
function worldAtProgress(progress: number): [number, number] {
  const idx = Math.min(progress * STEPS, STEPS - 1);
  const i = Math.floor(idx);
  const frac = idx - i;
  const next = Math.min(i + 1, STEPS);
  return [
    spiralPts[i][0] + (spiralPts[next][0] - spiralPts[i][0]) * frac,
    spiralPts[i][1] + (spiralPts[next][1] - spiralPts[i][1]) * frac,
  ];
}

// bounds: max radius of the spiral
const maxR = a + b * thetaMax;
const VIEW = maxR + 6;

// build SVG path string once
const pathData = spiralPts
  .map((pt, i) => `${i === 0 ? "M" : "L"}${pt[0].toFixed(1)},${pt[1].toFixed(1)}`)
  .join(" ");

interface SpiralMinimapProps {
  playerProgressRef: React.MutableRefObject<number>;
}

export function SpiralMinimap({ playerProgressRef }: SpiralMinimapProps) {
  const dotRef = useRef<SVGCircleElement>(null);
  const glowRef = useRef<SVGCircleElement>(null);

  // animate player dot position via rAF — no React re-renders
  useEffect(() => {
    let rafId: number;
    const update = () => {
      const [wx, wz] = worldAtProgress(playerProgressRef.current);
      if (dotRef.current) {
        dotRef.current.setAttribute("cx", wx.toFixed(2));
        dotRef.current.setAttribute("cy", wz.toFixed(2));
      }
      if (glowRef.current) {
        glowRef.current.setAttribute("cx", wx.toFixed(2));
        glowRef.current.setAttribute("cy", wz.toFixed(2));
      }
      rafId = requestAnimationFrame(update);
    };
    rafId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(rafId);
  }, [playerProgressRef]);

  return (
    <div
      style={{
        position: "absolute",
        bottom: 28,
        left: 28,
        width: 130,
        height: 130,
        borderRadius: 14,
        background: "rgba(73, 91, 81, 0.75)",
        border: "1px solid rgba(232, 96, 122, 0.2)",
        backdropFilter: "blur(10px)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox={`${-VIEW} ${-VIEW} ${VIEW * 2} ${VIEW * 2}`}
        style={{ display: "block" }}
      >
        <defs>
          <filter id="mm-glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* spiral path */}
        <path
          d={pathData}
          fill="none"
          stroke="rgba(232, 96, 122, 0.3)"
          strokeWidth={4.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* stop dots */}
        {SPIRAL_STOPS.map((stop) => {
          const [wx, wz] = worldAtProgress(stop.progress);
          const isPublished = stop.status === "Published";
          return (
            <circle
              key={stop.id}
              cx={wx}
              cy={wz}
              r={isPublished ? 3.5 : 2}
              fill={isPublished ? "#e8607a" : "rgba(255,255,255,0.18)"}
            />
          );
        })}

        {/* player dot — glow ring */}
        <circle
          ref={glowRef}
          cx={0}
          cy={0}
          r={6}
          fill="rgba(255,255,255,0.15)"
          filter="url(#mm-glow)"
        />

        {/* player dot — solid core */}
        <circle
          ref={dotRef}
          cx={0}
          cy={0}
          r={3.5}
          fill="#ffffff"
        />
      </svg>
    </div>
  );
}
