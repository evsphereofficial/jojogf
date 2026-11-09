import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MetaLabelProps {
  children: ReactNode;
  className?: string;
  /** Renders as <p> when it reads like a sentence */
  as?: "span" | "p";
}

/** Uppercase tracked interface label — metadata, kickers, chips. */
export function MetaLabel({ children, className, as: Tag = "span" }: MetaLabelProps) {
  return (
    <Tag
      className={cn(
        "font-sans text-label font-bold uppercase tracking-[0.18em]",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
