"use client";

import { useEffect, useRef, type RefObject } from "react";
import { ScrollTrigger } from "@/lib/gsap";
import { useExperienceStore } from "@/lib/store";

export interface ChapterHandle {
  /** Attach to the chapter's <section> */
  ref: RefObject<HTMLElement | null>;
  /** 0..1 scroll progress through the chapter — write-only, no renders */
  progressRef: RefObject<number>;
  /** Props to spread onto the <section> */
  sectionProps: {
    ref: RefObject<HTMLElement | null>;
    "aria-labelledby": string;
  };
}

/**
 * Chapter wiring (design.md §10.2):
 * - IntersectionObserver sets the active chapter (navigator state)
 * - one ScrollTrigger tracks progress into a ref (zero re-renders)
 */
export function useChapter(index: number, titleId: string): ChapterHandle {
  const ref = useRef<HTMLElement | null>(null);
  const progressRef = useRef(0);
  const setActiveChapter = useExperienceStore((s) => s.setActiveChapter);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveChapter(index);
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    io.observe(el);

    const st = ScrollTrigger.create({
      trigger: el,
      start: "top bottom",
      end: "bottom top",
      onUpdate: (self) => {
        progressRef.current = self.progress;
      },
    });

    return () => {
      io.disconnect();
      st.kill();
    };
  }, [index, setActiveChapter]);

  return { ref, progressRef, sectionProps: { ref, "aria-labelledby": titleId } };
}
