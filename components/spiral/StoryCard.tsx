"use client";

import { motion } from "framer-motion";
import { StoryStop } from "./types";

interface StoryCardProps {
  stop: StoryStop;
  isActive: boolean;
  isNext: boolean;
  onWalk: () => void;
}

export function StoryCard({ stop, isActive, isNext, onWalk }: StoryCardProps) {
  const scale = isActive ? 1 : isNext ? 0.9 : 0.72;
  const opacity = isActive ? 1 : isNext ? 0.9 : 0.45;
  const width = isActive ? 200 : isNext ? 160 : 120;

  return (
    <motion.div
      animate={{ scale, opacity }}
      transition={{ type: "spring", stiffness: 220, damping: 28 }}
      style={{
        width,
        cursor: isNext ? "pointer" : "default",
        pointerEvents: isNext || isActive ? "auto" : "none",
      }}
      onClick={isNext ? onWalk : undefined}
      className="rounded-2xl bg-white/92 backdrop-blur-sm p-3 shadow-xl"
    >
      {/* header row */}
      <div className="flex items-center justify-between gap-2">
        {stop.readTime && (
          <span className="text-[10px] text-neutral-400 shrink-0">
            {stop.readTime}
          </span>
        )}
        {stop.status !== "Placeholder" && (
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full shrink-0 ${
              stop.status === "Published"
                ? "bg-green-100 text-green-700"
                : "bg-neutral-100 text-neutral-500"
            }`}
          >
            {stop.status}
          </span>
        )}
      </div>

      {/* title */}
      <h3
        className={`font-semibold text-neutral-900 leading-tight mt-1 ${
          isActive ? "text-sm" : "text-[11px]"
        }`}
      >
        {stop.title}
      </h3>

      {/* active: full card content */}
      {isActive && stop.hook && (
        <>
          <p className="mt-1.5 text-[11px] text-neutral-600 leading-relaxed">
            {stop.hook}
          </p>

          {stop.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {stop.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[9px] bg-neutral-100 rounded-full px-2 py-0.5 text-neutral-500"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {stop.status === "Published" && stop.slug && (
            <a
              href={`/${stop.slug}`}
              className="mt-3 block text-center text-[11px] font-semibold text-indigo-600 hover:text-indigo-500 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              Read story →
            </a>
          )}

          {stop.status === "Coming soon" && (
            <p className="mt-3 text-center text-[10px] text-neutral-400">
              Coming soon
            </p>
          )}
        </>
      )}

      {/* next: walk-here CTA */}
      {isNext && !isActive && (
        <button
          className="mt-2 w-full rounded-lg bg-pink-500 hover:bg-pink-400 transition-colors py-1 text-[10px] font-semibold text-white"
          onClick={onWalk}
        >
          Walk here →
        </button>
      )}
    </motion.div>
  );
}
