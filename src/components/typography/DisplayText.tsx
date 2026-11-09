import type { ElementType } from "react";
import { cn, splitChars, splitWords } from "@/lib/utils";

interface DisplayTextProps {
  text: string;
  as?: ElementType;
  /** Kinetic split — targets GSAP `.split-part` (design.md §4.3) */
  split?: "none" | "chars" | "words";
  className?: string;
  id?: string;
}

/**
 * Oversized display typography with optional character/word split.
 * Split parts are aria-hidden with an aria-label on the parent so
 * screen readers announce the original string exactly once.
 */
export function DisplayText({
  text,
  as: Tag = "span",
  split = "none",
  className,
  id,
}: DisplayTextProps) {
  if (split === "none") {
    return (
      <Tag id={id} className={className}>
        {text}
      </Tag>
    );
  }

  const parts = split === "chars" ? splitChars(text) : splitWords(text);

  return (
    <Tag id={id} className={cn("split-text", className)} aria-label={text}>
      {parts.map((part, i) => (
        <span key={i} className="split-part inline-block" aria-hidden="true">
          {/^\s+$/.test(part) ? "\u00A0" : part}
        </span>
      ))}
    </Tag>
  );
}
