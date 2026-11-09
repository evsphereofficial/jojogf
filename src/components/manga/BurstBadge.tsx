import type { ReactNode } from "react";
import { cn, starPolygon } from "@/lib/utils";

interface BurstBadgeProps {
  children: ReactNode;
  className?: string;
  /** Burst fill — primary yellow by default */
  fill?: "primary" | "paper" | "impact";
  points?: number;
}

const FILLS = {
  primary: "bg-primary",
  paper: "bg-paper",
  impact: "bg-impact",
} as const;

/** Star-burst graphic badge (VOL. 06, stamps, chapter chips). */
export function BurstBadge({
  children,
  className,
  fill = "primary",
  points = 18,
}: BurstBadgeProps) {
  return (
    <span
      className={cn(
        "burst-badge relative inline-flex items-center justify-center px-6 py-4",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "absolute inset-[-14%] border-[3px] border-ink",
          FILLS[fill],
        )}
        style={{ clipPath: `polygon(${starPolygon(points, 50, 42)})` }}
      />
      <span className="relative z-10 text-ink">{children}</span>
    </span>
  );
}
