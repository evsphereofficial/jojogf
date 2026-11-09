import { cn, starPolygon } from "@/lib/utils";

interface ImpactFrameProps {
  /** SFX word rendered inside the burst */
  sfx: string;
  className?: string;
}

/**
 * High-contrast impact frame (design.md §9) — used at dramatic
 * chapter transitions. Never flashes more than once per trigger;
 * fully suppressed under reduced motion via choreography gating.
 */
export function ImpactFrame({ sfx, className }: ImpactFrameProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        /* `invisible` (not just opacity-0): the full-screen layers are
           not painted until GSAP autoAlpha flips them on */
        "impact-frame pointer-events-none absolute inset-0 z-30 flex items-center justify-center invisible opacity-0",
        className,
      )}
    >
      <div className="absolute inset-0 bg-impact" />
      <div
        className="absolute inset-[-20%] bg-paper"
        style={{ clipPath: `polygon(${starPolygon(18, 52, 44)})` }}
      />
      <span className="relative font-display text-display-xl text-ink uppercase">
        {sfx}
      </span>
    </div>
  );
}
