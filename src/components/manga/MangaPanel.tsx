import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MangaPanelProps {
  children: ReactNode;
  className?: string;
  /** Inner content tone — outer border is always ink */
  tone?: "paper" | "ink" | "yellow" | "impact" | "electric";
  shadow?: boolean;
  /** Graphic corner label */
  label?: string;
  as?: ElementType;
}

const TONES = {
  paper: "bg-paper text-ink",
  ink: "bg-ink text-paper",
  yellow: "bg-primary text-ink",
  impact: "bg-impact text-paper",
  electric: "bg-electric text-ink",
} as const;

/**
 * The core comic panel (neo-brutalist structure, design.md §2.3).
 * Hard edges, 3px ink border, hard offset shadow, zero radius.
 */
export function MangaPanel({
  children,
  className,
  tone = "paper",
  shadow = true,
  label,
  as: Tag = "div",
}: MangaPanelProps) {
  return (
    <Tag
      className={cn(
        "manga-panel relative border-comic",
        TONES[tone],
        shadow && "shadow-comic",
        className,
      )}
    >
      {label && (
        <span className="label-chip absolute top-2 left-2 z-10 text-[0.625rem]">
          {label}
        </span>
      )}
      {children}
    </Tag>
  );
}
