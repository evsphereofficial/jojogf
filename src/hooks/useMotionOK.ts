"use client";

import { useEffect, useState } from "react";
import { useExperienceStore } from "@/lib/store";

/** OS-level `prefers-reduced-motion` signal (system cannot be overridden). */
export function useSystemReduced(): boolean {
  const [systemReduced, setSystemReduced] = useState<boolean>(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false,
  );

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setSystemReduced(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return systemReduced;
}

/**
 * Effective motion switch: OS `prefers-reduced-motion` AND the
 * in-app toggle (design.md §13). When false, no GSAP/Anime/Lenis
 * contexts are created — base CSS shows final, readable states.
 */
export function useMotionOK(): boolean {
  const motionOverride = useExperienceStore((s) => s.motionOverride);
  const systemReduced = useSystemReduced();
  return !systemReduced && motionOverride !== "reduced";
}
