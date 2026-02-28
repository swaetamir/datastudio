"use client";

import { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";

// 1 face of CSS 3D box
function Face({
  w,
  h,
  transform,
  color,
}: {
  w: number;
  h: number;
  transform: string;
  color: string;
}) {
  return (
    <div
      style={{
        position: "absolute",
        width: w,
        height: h,
        background: color,
        transform,
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
      }}
    />
  );
}

// A CSS 3D box built from 5 visible faces
function Box({
  w,
  h,
  d,
  front,
  top,
  side,
  style,
}: {
  w: number;
  h: number;
  d: number;
  front: string;
  top: string;
  side: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        position: "absolute",
        width: w,
        height: h,
        transformStyle: "preserve-3d",
        ...style,
      }}
    >
      {/* Front */}
      <Face w={w} h={h} color={front} transform={`translateZ(${d / 2}px)`} />
      {/* Back */}
      <Face
        w={w}
        h={h}
        color={side}
        transform={`rotateY(180deg) translateZ(${d / 2}px)`}
      />
      {/* Right */}
      <Face
        w={d}
        h={h}
        color={side}
        transform={`rotateY(90deg) translateZ(${w - d / 2}px)`}
      />
      {/* Left */}
      <Face
        w={d}
        h={h}
        color={side}
        transform={`rotateY(-90deg) translateZ(${d / 2}px)`}
      />
      {/* Top */}
      <Face
        w={w}
        h={d}
        color={top}
        transform={`rotateX(90deg) translateZ(${d / 2}px)`}
      />
    </div>
  );
}

interface CharacterProps {
  walking: boolean;
}

export function Character({ walking }: CharacterProps) {
  const leftLegCtrl = useAnimation();
  const rightLegCtrl = useAnimation();
  const leftArmCtrl = useAnimation();
  const rightArmCtrl = useAnimation();

  useEffect(() => {
    if (walking) {
      leftLegCtrl.start({
        rotateX: [0, -28, 28, -20, 20, 0],
        transition: { duration: 1.4, times: [0, 0.2, 0.4, 0.6, 0.8, 1] },
      });
      rightLegCtrl.start({
        rotateX: [0, 28, -28, 20, -20, 0],
        transition: { duration: 1.4, times: [0, 0.2, 0.4, 0.6, 0.8, 1] },
      });
      leftArmCtrl.start({
        rotateX: [0, 20, -20, 15, -15, 0],
        transition: { duration: 1.4, times: [0, 0.2, 0.4, 0.6, 0.8, 1] },
      });
      rightArmCtrl.start({
        rotateX: [0, -20, 20, -15, 15, 0],
        transition: { duration: 1.4, times: [0, 0.2, 0.4, 0.6, 0.8, 1] },
      });
    }
  }, [walking, leftLegCtrl, rightLegCtrl, leftArmCtrl, rightArmCtrl]);

  // Color palette
  const skin = "#f8d7da";
  const shirt = "#ffffff";
  const shirtSide = "#dde4f0";
  const shirtTop = "#eef2fa";
  const pants = "#c8e6c9";
  const pantsSide = "#a5d6a7";
  const pantsTop = "#b9e4bb";
  const headSide = "#f0c8cc";
  const headTop = "#fce8ea";

  return (
    // Total character height ≈ 24 (head) + 24 (body) + 20 (legs) = 68px
    // Offset so the character's feet sit at the origin
    <div
      style={{
        position: "relative",
        width: 32,
        height: 68,
        transformStyle: "preserve-3d",
        // Center the character on the spiral point
        marginLeft: -16,
        marginTop: -68,
      }}
    >
      {/* Head */}
      <Box
        w={24}
        h={24}
        d={24}
        front={skin}
        top={headTop}
        side={headSide}
        style={{ top: 0, left: 4 }}
      />

      {/* Body */}
      <Box
        w={16}
        h={24}
        d={10}
        front={shirt}
        top={shirtTop}
        side={shirtSide}
        style={{ top: 26, left: 8 }}
      />

      {/* Left arm */}
      <motion.div
        animate={leftArmCtrl}
        style={{
          position: "absolute",
          top: 26,
          left: 0,
          transformStyle: "preserve-3d",
          transformOrigin: "50% 0%",
        }}
      >
        <Box
          w={8}
          h={20}
          d={8}
          front={skin}
          top={headTop}
          side={headSide}
        />
      </motion.div>

      {/* Right arm */}
      <motion.div
        animate={rightArmCtrl}
        style={{
          position: "absolute",
          top: 26,
          left: 24,
          transformStyle: "preserve-3d",
          transformOrigin: "50% 0%",
        }}
      >
        <Box
          w={8}
          h={20}
          d={8}
          front={skin}
          top={headTop}
          side={headSide}
        />
      </motion.div>

      {/* Left leg */}
      <motion.div
        animate={leftLegCtrl}
        style={{
          position: "absolute",
          top: 52,
          left: 8,
          transformStyle: "preserve-3d",
          transformOrigin: "50% 0%",
        }}
      >
        <Box
          w={8}
          h={20}
          d={8}
          front={pants}
          top={pantsTop}
          side={pantsSide}
        />
      </motion.div>

      {/* Right leg */}
      <motion.div
        animate={rightLegCtrl}
        style={{
          position: "absolute",
          top: 52,
          left: 16,
          transformStyle: "preserve-3d",
          transformOrigin: "50% 0%",
        }}
      >
        <Box
          w={8}
          h={20}
          d={8}
          front={pants}
          top={pantsTop}
          side={pantsSide}
        />
      </motion.div>
    </div>
  );
}
