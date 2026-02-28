"use client";

import { useMemo, useState, useCallback, useEffect, useRef, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { ListView } from "./ListView";
import { SpiralMinimap } from "./SpiralMinimap";

import { buildSpiral3DCurve } from "./spiralMath";
import { SPIRAL_3D_CONFIG, SPIRAL_STOPS } from "./spiralData";
import { SpiralTube } from "./SpiralTube";
import { FloatingPost } from "./FloatingPost";
import { WalkCamera } from "./WalkCamera";

export function SpiralScene() {
  const { a, b, thetaMax } = SPIRAL_3D_CONFIG;
  const curve = useMemo(() => buildSpiral3DCurve(a, b, thetaMax), [a, b, thetaMax]);

  // shared game state: driven by WalkCamera → HUD + FloatingPosts
  const [nearestStop, setNearestStop] = useState(-1);
  const [activeStop, setActiveStop] = useState<number | null>(null);
  const [showListView, setShowListView] = useState(false);
  const resetCameraRef = useRef<(() => void) | null>(null);
  const playerProgressRef = useRef(0.04);

  // lock scroll while the spiral scene is mounted
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  // auto-open list view when player reaches the end stop (index 4)
  useEffect(() => {
    const endIndex = SPIRAL_STOPS.findIndex((s) => s.id === "end");
    if (nearestStop === endIndex) {
      setShowListView(true);
    }
  }, [nearestStop]);

  const handleNearestChange = useCallback((index: number, _isNear: boolean) => {
    setNearestStop(index);
  }, []);

  const handleActivate = useCallback((index: number | null) => {
    setActiveStop(index);
  }, []);

  const nearestStopData = nearestStop >= 0 ? SPIRAL_STOPS[nearestStop] : null;
  const showEPrompt =
    nearestStop >= 0 &&
    nearestStopData?.status !== "Placeholder" &&
    activeStop !== nearestStop;

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      {/* 3D Canvas */}
      <Canvas
        camera={{ fov: 72, near: 0.1, far: 400, position: [1, 2, 1] }}
        gl={{ antialias: true }}
      >
        <color attach="background" args={["#495B51"]} />
        <fog attach="fog" args={["#3a4d43", 18, 130]} />

        {/* lighting */}
        <ambientLight intensity={0.25} />
        <directionalLight color="#ffffff" intensity={2.5} position={[15, 25, 10]} />
        <pointLight color="#e8607a" intensity={3} distance={35} position={[0, 6, 0]} />
        <pointLight color="#B4B7A8" intensity={1.2} distance={60} position={[20, 8, 20]} />
        <pointLight color="#e8607a" intensity={1.5} distance={40} position={[-20, 5, -20]} />


        {/* ground plane */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
          <planeGeometry args={[300, 300]} />
          <meshStandardMaterial color="#495B51" roughness={1} />
        </mesh>

        <Suspense fallback={null}>
          <SpiralTube curve={curve} />

          {SPIRAL_STOPS.map((stop, i) => (
            <FloatingPost
              key={stop.id}
              stop={stop}
              curve={curve}
              isNearest={nearestStop === i}
              isActive={activeStop === i}
              onActivate={() => handleActivate(activeStop === i ? null : i)}
            />
          ))}
        </Suspense>

        <WalkCamera
          curve={curve}
          onNearestChange={handleNearestChange}
          onActivate={handleActivate}
          activeStop={activeStop}
          resetRef={resetCameraRef}
          playerProgressRef={playerProgressRef}
        />
      </Canvas>

      {/* HUD overlay */}

      {/* list view overlay */}
      {showListView && <ListView onClose={() => setShowListView(false)} />}

      {/* bottom-left: spiral minimap */}
      <SpiralMinimap playerProgressRef={playerProgressRef} />

      {/* top-left wordmark */}
      <div
        style={{
          position: "absolute",
          top: 24,
          left: 28,
          pointerEvents: "none",
        }}
      >
        <p
          style={{
            color: "rgba(255,255,255,0.9)",
            fontSize: 16,
            fontFamily: "Tanker, sans-serif",
            letterSpacing: "0.08em",
          }}
        >
          Data Studio: THE SPIRAL
        </p>
      </div>

      {/* top-right: controls */}
      <div style={{ position: "absolute", top: 24, right: 28, display: "flex", flexDirection: "column", gap: 8 }}>
        <button
          onClick={() => setShowListView(true)}
          style={{
            background: "rgba(232, 96, 122, 0.12)",
            border: "1px solid rgba(232, 96, 122, 0.35)",
            borderRadius: 8,
            color: "rgba(232, 96, 122, 0.85)",
            fontSize: 11,
            padding: "6px 14px",
            cursor: "pointer",
            letterSpacing: "0.08em",
            fontFamily: "Tanker, sans-serif",
            backdropFilter: "blur(8px)",
          }}
        >
          ALL STORIES
        </button>
        <button
          onClick={() => resetCameraRef.current?.()}
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: 8,
            color: "rgba(255,255,255,0.45)",
            fontSize: 11,
            padding: "6px 14px",
            cursor: "pointer",
            letterSpacing: "0.06em",
            fontFamily: "inherit",
            backdropFilter: "blur(8px)",
          }}
        >
          ↩ back to start
        </button>
      </div>

      {/* center-top: "press E" prompt */}
      {showEPrompt && (
        <div
          key={nearestStop}
          style={{
            position: "absolute",
            top: 32,
            left: "50%",
            transform: "translateX(-50%)",
            pointerEvents: "none",
            animation: "hudFadeIn 0.3s ease forwards",
          }}
        >
          <div
            style={{
              background: "rgba(232, 96, 122, 0.18)",
              border: "1px solid rgba(232, 96, 122, 0.5)",
              borderRadius: 999,
              padding: "6px 18px",
              color: "#f4a0aa",
              fontSize: 11,
              fontFamily: "var(--font-geist-sans, sans-serif)",
              letterSpacing: "0.05em",
              backdropFilter: "blur(8px)",
              whiteSpace: "nowrap",
            }}
          >
            E — read {nearestStopData?.title}
          </div>
        </div>
      )}

      {/* bottom-center: stop dots + key hints */}
      <div
        style={{
          position: "absolute",
          bottom: 28,
          left: "50%",
          transform: "translateX(-50%)",
          pointerEvents: "none",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 10,
        }}
      >
        {/* stop progress dots */}
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {SPIRAL_STOPS.map((_, i) => (
            <div
              key={i}
              style={{
                width: i === nearestStop ? 18 : 6,
                height: 6,
                borderRadius: 999,
                background:
                  i === nearestStop ? "#e8607a" : "rgba(255,255,255,0.25)",
                transition: "all 0.35s ease",
              }}
            />
          ))}
        </div>

        {/* key hints */}
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          {(
            [
              ["W / ↑", "forward"],
              ["S / ↓", "back"],
              ["E", "read"],
            ] as const
          ).map(([key, label]) => (
            <span
              key={key}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                color: "rgba(255,255,255,0.4)",
                fontSize: 10,
                fontFamily: "var(--font-geist-mono, monospace)",
                letterSpacing: "0.05em",
              }}
            >
              <kbd
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.18)",
                  borderRadius: 4,
                  padding: "1px 7px",
                  fontSize: 10,
                  color: "rgba(255,255,255,0.65)",
                }}
              >
                {key}
              </kbd>
              {label}
            </span>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes hudFadeIn {
          from { opacity: 0; transform: translateX(-50%) translateY(-6px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0px); }
        }
      `}</style>
    </div>
  );
}
