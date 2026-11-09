import { cn } from "@/lib/utils";

interface SpeedLinesProps {
  /** Radial burst from centre, or edge lines sweeping inward */
  variant?: "rays" | "left" | "right";
  tone?: "ink" | "primary" | "paper" | "impact";
  className?: string;
}

/** Manga speed-line overlay (SVG-free, CSS pattern based). */
export function SpeedLines({
  variant = "rays",
  tone = "ink",
  className,
}: SpeedLinesProps) {
  const toneClass =
    tone === "ink"
      ? ""
      : variant === "rays"
        ? `speed-rays-${tone}`
        : `speed-lines-${tone}`;

  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0",
        variant === "rays" && "speed-rays",
        variant === "left" && "speed-lines",
        variant === "right" && "speed-lines speed-lines-right",
        toneClass,
        className,
      )}
    />
  );
}
