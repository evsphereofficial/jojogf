"use client";

import { useEffect, useState, type RefObject } from "react";

/**
 * Viewport proximity for selective heavy mounting (design.md §11.1).
 * `rootMargin` generously pre-loads scenes before they are needed;
 * returns false on the server and unmounts far-off scenes entirely.
 */
export function useInViewport(
  ref: RefObject<HTMLElement | null>,
  rootMargin = "50% 0px 50% 0px",
): boolean {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) setInView(entry.isIntersecting);
      },
      { rootMargin, threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, rootMargin]);

  return inView;
}
