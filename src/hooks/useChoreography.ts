"use client";

import { useEffect, useRef, type DependencyList, type RefObject } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useMotionOK } from "./useMotionOK";

export interface ChoreographyApi {
  /** Scoped root element (the chapter/section) */
  root: HTMLElement;
  /** Scoped selector — safe across media-query re-runs */
  q: (selector: string) => HTMLElement[];
  /** Responsive timeline groups — auto-reverted on cleanup */
  mm: gsap.MatchMedia;
}

/**
 * Chapter animation lifecycle (design.md §9.5):
 * - creates a gsap.context + matchMedia scope ONLY when motion is on
 * - reverts everything on unmount or when motion is toggled off
 * - base CSS (final states) is what reduced-motion users see
 *
 * `fn` may return a cleanup function (imperative listeners etc.) —
 * it runs before context revert. It is intentionally not a
 * dependency; pass explicit `deps` for anything it closes over.
 */
export function useChoreography(
  rootRef: RefObject<HTMLElement | null>,
  fn: (api: ChoreographyApi) => void | (() => void),
  deps: DependencyList = [],
) {
  const motionOK = useMotionOK();
  const fnRef = useRef(fn);

  /* Keep the latest callback without re-running the timeline effect */
  useEffect(() => {
    fnRef.current = fn;
  }, [fn]);

  useEffect(() => {
    if (!motionOK) {
      ScrollTrigger.refresh();
      return;
    }
    const root = rootRef.current;
    if (!root) return;

    const mm = gsap.matchMedia();
    const q = gsap.utils.selector(root);
    let cleanup: void | (() => void);
    const ctx = gsap.context(() => {
      cleanup = fnRef.current({ root, q, mm });
    }, root);

    return () => {
      if (typeof cleanup === "function") cleanup();
      mm.revert();
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [motionOK, rootRef, ...deps]);
}
