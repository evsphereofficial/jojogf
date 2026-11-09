"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { gsap } from "@/lib/gsap";
import { useMotionOK } from "@/hooks/useMotionOK";

interface MagneticButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  ariaLabel?: string;
  /** Max pull distance in px */
  strength?: number;
}

/**
 * Pointer-magnetic button (design.md §7 interactions).
 * GSAP owns the transform (quickTo, data-via-ref — zero renders);
 * CSS owns the border/shadow hover states.
 */
export function MagneticButton({
  children,
  onClick,
  className,
  ariaLabel,
  strength = 14,
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const motionOK = useMotionOK();

  useEffect(() => {
    const el = ref.current;
    if (!el || !motionOK) return;

    const xTo = gsap.quickTo(el, "x", { duration: 0.4, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.4, ease: "power3.out" });

    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const dx = e.clientX - (rect.left + rect.width / 2);
      const dy = e.clientY - (rect.top + rect.height / 2);
      const dist = Math.hypot(dx, dy);
      const radius = Math.max(rect.width, rect.height) * 0.9;
      if (dist > radius) {
        xTo(0);
        yTo(0);
        return;
      }
      xTo((dx / radius) * strength);
      yTo((dy / radius) * strength);
    };

    const onLeave = () => {
      xTo(0);
      yTo(0);
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      gsap.set(el, { x: 0, y: 0 });
    };
  }, [motionOK, strength]);

  return (
    <button
      ref={ref}
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={cn(
        "magnetic-btn inline-flex items-center gap-3 border-[5px] border-ink bg-ink px-7 py-4",
        "font-sans text-label font-bold tracking-[0.18em] text-primary uppercase shadow-comic-lg",
        "transition-colors duration-150 ease-settle hover:bg-impact hover:text-paper",
        "active:bg-impact active:text-paper",
        className,
      )}
    >
      {children}
    </button>
  );
}
