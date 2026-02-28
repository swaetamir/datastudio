import * as THREE from "three";

// 2D helpers (kept for reference, no longer used in main scene)

export interface SpiralPoint {
  x: number;
  y: number;
}

export function archimedeanPoint(
  theta: number,
  a: number,
  b: number,
  cx: number,
  cy: number
): SpiralPoint {
  const r = a + b * theta;
  return {
    x: Math.round((cx + r * Math.cos(theta)) * 100) / 100,
    y: Math.round((cy + r * Math.sin(theta)) * 100) / 100,
  };
}

export function getStopPositions(
  stopThetas: number[],
  a: number,
  b: number,
  cx: number,
  cy: number
): SpiralPoint[] {
  return stopThetas.map((theta) => archimedeanPoint(theta, a, b, cx, cy));
}

//  3D spiral for the scene 

/**
 * Build a CatmullRomCurve3 following an Archimedean spiral on the XZ plane.
 * r = a + b * theta,  x = r*cos(theta),  z = r*sin(theta),  y = 0
 */
export function buildSpiral3DCurve(
  a: number,
  b: number,
  thetaMax: number,
  steps = 800
): THREE.CatmullRomCurve3 {
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i <= steps; i++) {
    const theta = (i / steps) * thetaMax;
    const r = a + b * theta;
    pts.push(new THREE.Vector3(r * Math.cos(theta), 0, r * Math.sin(theta)));
  }
  return new THREE.CatmullRomCurve3(pts, false, "catmullrom", 0.5);
}
