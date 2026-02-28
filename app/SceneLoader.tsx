"use client";

import dynamic from "next/dynamic";

// disable SSR from a client component
const SpiralScene = dynamic(
  () =>
    import("@/components/spiral/SpiralScene").then((m) => ({
      default: m.SpiralScene,
    })),
  { ssr: false }
);

export default function SceneLoader() {
  return <SpiralScene />;
}
