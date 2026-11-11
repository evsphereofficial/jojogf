"use client";

import { useMemo } from "react";
import { useMotionOK } from "@/hooks/useMotionOK";
import { cn } from "@/lib/utils";

interface FloatingHeartsProps {
  /** how many ambient hearts */
  count?: number;
  /** base glyph size in px (randomised ±30% per heart) */
  size?: number;
  /** any CSS colour expression for the glyphs */
  color?: string;
  /** ms for one full rise-and-fade cycle (randomised ±25%) */
  duration?: number;
  /** absolute-positioned ancestor must be `relative` + `overflow-hidden` */
  className?: string;
}

/**
 * Ambient rising hearts (romantic pass, design.md D19).
 *
 * Pure CSS: each heart is a `.bit-heart` with a `heart-rise`
 * animation whose duration/delay/horizontal drift come from inline
 * custom properties — zero JS per frame, composites on the GPU.
 * Gated by `useMotionOK` (renders nothing under reduced motion, so
 * no orphaned animations). Random values are generated once via
 * `useMemo` from a seeded PRNG, so SSR markup and hydration match.
 */

/** deterministic PRNG (mulberry32) — stable across server/client */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function FloatingHearts({
  count = 7,
  size = 18,
  color = "var(--c-impact)",
  duration = 7000,
  className,
}: FloatingHeartsProps) {
  const motionOK = useMotionOK();

  const hearts = useMemo(() => {
    const rand = mulberry32(0xc0ffee);
    return Array.from({ length: count }, (_, i) => ({
      key: i,
      left: `${(6 + rand() * 88).toFixed(2)}%`,
      delay: `${(-rand() * duration).toFixed(0)}ms`,
      dur: `${Math.round(duration * (0.75 + rand() * 0.5))}ms`,
      px: `${Math.round(size * (0.7 + rand() * 0.6))}px`,
      drift: `${(rand() * 40 - 20).toFixed(1)}px`,
      opacity: (0.55 + rand() * 0.4).toFixed(2),
    }));
  }, [count, size, duration]);

  if (!motionOK) return null;

  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      {hearts.map((h) => (
        <span
          key={h.key}
          className="bit-heart heart-rise"
          style={{
            left: h.left,
            bottom: "-4%",
            width: h.px,
            height: h.px,
            opacity: h.opacity,
            ["--hsize" as string]: h.px,
            ["--heart-color" as string]: color,
            ["--h-dur" as string]: h.dur,
            ["--h-delay" as string]: h.delay,
            ["--h-drift" as string]: h.drift,
          }}
        />
      ))}
    </div>
  );
}
