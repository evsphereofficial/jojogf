"use client";

import { create } from "zustand";

/**
 * Minimal global state (design.md §10.3).
 * Only the navigator + motion toggle subscribe — scroll progress
 * never enters React state (refs own it).
 */
const STORAGE_KEY = "bizarre-love:motion-override";

export type MotionOverride = "auto" | "reduced";

interface ExperienceState {
  /** 1..9 — chapter crossing the viewport centre */
  activeChapter: number;
  setActiveChapter: (index: number) => void;
  /** In-app REDUCE MOTION toggle (design.md §13) */
  motionOverride: MotionOverride;
  setMotionOverride: (value: MotionOverride) => void;
  /** Secret BIZARRE MODE window (Ch01 badge ×5 / Konami keys) */
  bizarre: boolean;
  triggerBizarre: () => void;
}

/** module-scope timer so retriggers extend, never stack */
let bizarreTimer: ReturnType<typeof setTimeout> | undefined;

export const useExperienceStore = create<ExperienceState>((set) => ({
  activeChapter: 1,
  setActiveChapter: (index) =>
    set((state) => (state.activeChapter === index ? state : { activeChapter: index })),
  motionOverride: "auto",
  setMotionOverride: (value) => {
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(STORAGE_KEY, value);
      } catch {
        /* storage unavailable — toggle still works for this session */
      }
    }
    set({ motionOverride: value });
  },
  bizarre: false,
  triggerBizarre: () => {
    if (bizarreTimer !== undefined) clearTimeout(bizarreTimer);
    set({ bizarre: true });
    bizarreTimer = setTimeout(
      () => {
        set({ bizarre: false });
        bizarreTimer = undefined;
      },
      6500,
    );
  },
}));

/** Called once after hydration to restore the persisted toggle. */
export function initMotionOverride() {
  if (typeof window === "undefined") return;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "reduced" || stored === "auto") {
      useExperienceStore.setState({ motionOverride: stored });
    }
  } catch {
    /* ignore */
  }
}

/** Imperative check for non-React code (scroll helpers, etc.). */
export function isMotionOK(): boolean {
  const { motionOverride } = useExperienceStore.getState();
  if (motionOverride === "reduced") return false;
  if (typeof window === "undefined") return true;
  return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
