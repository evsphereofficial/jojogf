import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SpeechBubbleProps {
  speaker?: string;
  children: ReactNode;
  className?: string;
  side?: "left" | "right";
}

/** Manga dialogue bubble with an ink-outlined tail. */
export function SpeechBubble({
  speaker,
  children,
  className,
  side = "left",
}: SpeechBubbleProps) {
  return (
    <div
      className={cn(
        "speech-bubble relative border-comic bg-paper px-4 py-3 shadow-comic",
        side === "right" ? "ml-auto" : "mr-auto",
        className,
      )}
    >
      {speaker && (
        <span className="mb-1 block font-sans text-label font-bold tracking-[0.18em] text-impact">
          {speaker}
        </span>
      )}
      <div className="font-sans text-body text-ink">{children}</div>
      <span
        aria-hidden="true"
        className={cn(
          "absolute -bottom-[14px] h-5 w-5 rotate-45 border-r-[3px] border-b-[3px] border-ink bg-paper",
          side === "right" ? "right-8" : "left-8",
        )}
      />
    </div>
  );
}
