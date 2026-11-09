import { cn } from "@/lib/utils";

interface HalftoneLayerProps {
  /** Dot color variant */
  tone?: "ink" | "primary" | "paper" | "impact" | "electric";
  density?: "default" | "dense" | "coarse";
  fade?: boolean;
  className?: string;
}

/** Full-area halftone field (procedural, design.md §9). */
export function HalftoneLayer({
  tone = "ink",
  density = "default",
  fade = false,
  className,
}: HalftoneLayerProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "halftone pointer-events-none absolute inset-0",
        tone !== "ink" && `halftone-${tone}`,
        density === "dense" && "halftone-dense",
        density === "coarse" && "halftone-coarse",
        fade && "halftone-fade",
        className,
      )}
    />
  );
}
