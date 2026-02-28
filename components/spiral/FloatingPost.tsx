"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { StoryStop } from "./types";

const POST_HEIGHT = 2.5;

interface FloatingPostProps {
  stop: StoryStop;
  curve: THREE.CatmullRomCurve3;
  isNearest: boolean;
  isActive: boolean;
  onActivate: () => void;
}

export function FloatingPost({
  stop,
  curve,
  isNearest,
  isActive,
  onActivate,
}: FloatingPostProps) {
  const worldPos = useMemo(() => curve.getPointAt(stop.progress), [curve, stop.progress]);
  const floatRef = useRef<THREE.Group>(null!);

  // hover animation 
  useFrame(({ clock }) => {
    if (!floatRef.current) return;
    const t = clock.getElapsedTime();
    const targetY = isActive
      ? POST_HEIGHT + 1.4
      : POST_HEIGHT + 1.4 + Math.sin(t * 1.4 + stop.progress * 8) * 0.18;
    floatRef.current.position.y += (targetY - floatRef.current.position.y) * 0.08;
  });

  const canRead = stop.status !== "Placeholder";

  return (
    <group position={[worldPos.x, 0, worldPos.z]}>
      {/* stem */}
      <mesh position={[0, (POST_HEIGHT + 1.5) / 2, 0]}>
        <cylinderGeometry args={[0.04, 0.04, POST_HEIGHT + 1.5, 6]} />
        <meshStandardMaterial
          color="#e8607a"
          emissive="#e8607a"
          emissiveIntensity={0.4}
          transparent
          opacity={0.5}
        />
      </mesh>

      {/* hovering card */}
      <group ref={floatRef} position={[0, POST_HEIGHT + 1.4, 0]}>
        <Html
          center
          distanceFactor={12}
          zIndexRange={[20, 0]}
          style={{ pointerEvents: "auto" }}
        >
        <style>{`@font-face{font-family:"Tanker";src:url("/fonts/Tanker-Regular.ttf") format("truetype")}`}</style>
        <div
          onClick={canRead && !isActive ? onActivate : undefined}
          style={{
            width: isActive ? 280 : 190,
            cursor: canRead && !isActive ? "pointer" : "default",
            userSelect: "none",
            background: "rgba(73, 91, 81, 0.92)",
            border: `1px solid ${isNearest && !isActive ? "rgba(232, 96, 122, 0.55)" : "rgba(232, 96, 122, 0.25)"}`,
            borderRadius: 16,
            backdropFilter: "blur(16px)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)",
            overflow: "hidden",
            transition: "width 0.35s ease, border-color 0.2s ease",
          }}
        >
          {/* image */}
          {stop.image && (
            <div style={{
              width: "100%",
              height: isActive ? 120 : 72,
              overflow: "hidden",
              transition: "height 0.35s ease",
            }}>
              <img
                src={stop.image}
                alt={stop.title}
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
            </div>
          )}

          {/* pink accent */}
          {!stop.image && <div style={{
            height: 2,
            width: "100%",
            background: stop.status === "Published"
              ? "linear-gradient(90deg, #e8607a, #B4B7A8)"
              : stop.status === "Coming soon"
              ? "linear-gradient(90deg, #e8607a 60%, transparent)"
              : "rgba(255,255,255,0.08)",
          }} />}

          <div style={{ padding: "10px 12px" }}>
            {/* status + read time */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
              {stop.readTime && (
                <span style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", letterSpacing: "0.05em" }}>
                  {stop.readTime}
                </span>
              )}
              {stop.status !== "Placeholder" && (
                <span style={{
                  fontSize: 9,
                  fontWeight: 600,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  padding: "2px 7px",
                  borderRadius: 999,
                  background: stop.status === "Published"
                    ? "rgba(232, 96, 122, 0.18)"
                    : "rgba(255,255,255,0.08)",
                  color: stop.status === "Published" ? "#e8607a" : "rgba(255,255,255,0.4)",
                  border: `1px solid ${stop.status === "Published" ? "rgba(232,96,122,0.35)" : "rgba(255,255,255,0.1)"}`,
                }}>
                  {stop.status}
                </span>
              )}
            </div>

            {/* title */}
            <h3 style={{
              fontSize: isActive ? 16 : 13,
              fontWeight: 600,
              fontFamily: "Tanker, sans-serif",
              letterSpacing: "0.08em",
              color: "#ffffff",
              lineHeight: 1.3,
              margin: 0,
              textAlign: stop.status === "Placeholder" ? "center" : "left",
            }}>
              {stop.title}
            </h3>

            {/* collapse*/}
            {!isActive && isNearest && canRead && (
              <p style={{ marginTop: 4, fontSize: 9, color: "#e8607a", fontWeight: 500 }}>
                press E to read
              </p>
            )}

            {/* expanded box */}
            {isActive && (
              <>
                {stop.hook && (
                  <p style={{ marginTop: 8, fontSize: 11, color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>
                    {stop.hook}
                  </p>
                )}
                {stop.tags.length > 0 && (
                  <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 4 }}>
                    {stop.tags.map((tag) => (
                      <span key={tag} style={{
                        fontSize: 9,
                        padding: "2px 7px",
                        borderRadius: 999,
                        background: "rgba(232, 96, 122, 0.1)",
                        color: "rgba(232, 96, 122, 0.7)",
                        border: "1px solid rgba(232, 96, 122, 0.2)",
                      }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                {stop.status === "Published" && (stop.externalUrl || stop.slug) && (
                  <a
                    href={stop.externalUrl ?? `/${stop.slug}`}
                    target={stop.externalUrl ? "_blank" : undefined}
                    rel={stop.externalUrl ? "noopener noreferrer" : undefined}
                    style={{
                      marginTop: 12,
                      display: "block",
                      textAlign: "center",
                      fontSize: 11,
                      fontWeight: 600,
                      color: "#fff",
                      background: "linear-gradient(135deg, #e8607a, #B4B7A8)",
                      padding: "6px 0",
                      borderRadius: 8,
                      textDecoration: "none",
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    Read essay →
                  </a>
                )}
                <button
                  onClick={onActivate}
                  style={{ marginTop: 8, width: "100%", textAlign: "center", fontSize: 9, color: "rgba(255,255,255,0.25)", background: "none", border: "none", cursor: "pointer" }}
                >
                  press E to close
                </button>
              </>
            )}
          </div>
        </div>
        </Html>
      </group>
    </group>
  );
}
