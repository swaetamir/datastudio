"use client";

import { useEffect, useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { SPIRAL_STOPS } from "./spiralData";

const EYE_HEIGHT = 2;
const WALK_SPEED = 0.045; // progress units per second
const NEAR_THRESHOLD = 9; // world units

interface WalkCameraProps {
  curve: THREE.CatmullRomCurve3;
  onNearestChange: (index: number, isNear: boolean) => void;
  onActivate: (index: number | null) => void;
  activeStop: number | null;
  resetRef?: React.MutableRefObject<(() => void) | null>;
  playerProgressRef?: React.MutableRefObject<number>;
}

export function WalkCamera({
  curve,
  onNearestChange,
  onActivate,
  activeStop,
  resetRef,
  playerProgressRef,
}: WalkCameraProps) {
  const { camera } = useThree();

  const progressRef = useRef(0.04);

  // expose reset function to parent
  useEffect(() => {
    if (resetRef) {
      resetRef.current = () => {
        progressRef.current = 0.04;
      };
    }
  }, [resetRef]);
  const keys = useRef({ w: false, s: false });
  const prevNearest = useRef(-1);
  const prevIsNear = useRef(false);
  const ePending = useRef(false);

  // pre-compute 3D positions of each stop
  const stopPositions = useMemo(
    () => SPIRAL_STOPS.map((s) => curve.getPointAt(s.progress)),
    [curve]
  );

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k === "w" || k === "arrowup") keys.current.w = true;
      if (k === "s" || k === "arrowdown") keys.current.s = true;
      if (k === "e") ePending.current = true;
    };
    const up = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k === "w" || k === "arrowup") keys.current.w = false;
      if (k === "s" || k === "arrowdown") keys.current.s = false;
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  useFrame((_, delta) => {
    // advance / retreat along path
    if (keys.current.w)
      progressRef.current = Math.min(progressRef.current + WALK_SPEED * delta, 0.98);
    if (keys.current.s)
      progressRef.current = Math.max(progressRef.current - WALK_SPEED * delta, 0.02);

    const t = progressRef.current;
    if (playerProgressRef) playerProgressRef.current = t;
    const pos = curve.getPointAt(t);
    const ahead = curve.getPointAt(Math.min(t + 0.014, 0.99));

    camera.position.set(pos.x, EYE_HEIGHT, pos.z);
    camera.lookAt(ahead.x, EYE_HEIGHT, ahead.z);

    // find nearest stop
    let nearIdx = -1;
    let nearDist = Infinity;
    const camPos = new THREE.Vector3(pos.x, EYE_HEIGHT, pos.z);

    stopPositions.forEach((sp, i) => {
      const d = camPos.distanceTo(new THREE.Vector3(sp.x, EYE_HEIGHT, sp.z));
      if (d < nearDist) {
        nearDist = d;
        nearIdx = i;
      }
    });

    const isNear = nearDist < NEAR_THRESHOLD;

    if (nearIdx !== prevNearest.current || isNear !== prevIsNear.current) {
      prevNearest.current = nearIdx;
      prevIsNear.current = isNear;
      onNearestChange(isNear ? nearIdx : -1, isNear);
    }

    // E key interaction
    if (ePending.current) {
      ePending.current = false;
      if (isNear && nearIdx >= 0) {
        onActivate(activeStop === nearIdx ? null : nearIdx);
      }
    }
  });

  return null;
}
