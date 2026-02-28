"use client";

import { useMemo } from "react";
import * as THREE from "three";

interface SpiralTubeProps {
  curve: THREE.CatmullRomCurve3;
}

export function SpiralTube({ curve }: SpiralTubeProps) {
  const geometry = useMemo(
    () => new THREE.TubeGeometry(curve, 600, 0.9, 8, false),
    [curve]
  );

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial
        color="#e8607a"
        emissive="#e8607a"
        emissiveIntensity={0.06}
        roughness={0.6}
        metalness={0}
      />
    </mesh>
  );
}
