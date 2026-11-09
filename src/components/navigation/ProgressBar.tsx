"use client";

import { useEffect, useRef } from "react";
import { ScrollTrigger } from "@/lib/gsap";

/**
 * Overall reading progress — transform-only, zero React state
 * (design.md §10.5 / §14). Ink rail on any ground, yellow fill.
 */
export function ProgressBar() {
  const fillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const st = ScrollTrigger.create({
      trigger: document.documentElement,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        if (fillRef.current) {
          fillRef.current.style.transform = `scaleX(${self.progress})`;
        }
      },
    });
    return () => st.kill();
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-nav h-[6px] bg-ink"
    >
      <div
        ref={fillRef}
        className="h-full w-full origin-left scale-x-0 bg-primary"
      />
    </div>
  );
}
