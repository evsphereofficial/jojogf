"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { setLenis } from "@/lib/lenis";
import { useMotionOK } from "@/hooks/useMotionOK";

/**
 * Lenis ↔ GSAP integration (design.md §10.1).
 * Mounted only while motion is enabled; destroyed on disable/unmount.
 * Touch scrolling stays native (Lenis default = wheel smoothing only),
 * so mobile keeps platform-native scroll behaviour.
 */
export function SmoothScroll() {
  const motionOK = useMotionOK();

  useEffect(() => {
    /* Phone perf (design.md §12): touch devices keep 100% native
       scrolling — no Lenis rAF loop, no touch interception, no
       extra main-thread work per frame. Wheel devices still get
       smoothing. */
    const coarse =
      typeof window !== "undefined" &&
      window.matchMedia("(hover: none) and (pointer: coarse)").matches;

    if (!motionOK || coarse) {
      setLenis(null);
      ScrollTrigger.refresh();
      return;
    }

    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.6,
    });
    setLenis(lenis);

    const onScroll = () => ScrollTrigger.update();
    lenis.on("scroll", onScroll);

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.off("scroll", onScroll);
      lenis.destroy();
      setLenis(null);
      requestAnimationFrame(() => ScrollTrigger.refresh());
    };
  }, [motionOK]);

  return null;
}
