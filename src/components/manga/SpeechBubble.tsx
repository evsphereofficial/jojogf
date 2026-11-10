import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SpeechBubbleProps {
  speaker?: string;
  children: ReactNode;
  className?: string;
  side?: "left" | "right";
  /** when provided the bubble becomes a <button> — the tap target
      for the "another take" interaction (anime.js owns its
      transform; hover feedback is shadow-only, per ownership D9) */
  onPop?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

/** Manga dialogue bubble with an ink-outlined tail. */
export function SpeechBubble({
  speaker,
  children,
  className,
  side = "left",
  onPop,
}: SpeechBubbleProps) {
  const Root = (onPop ? "button" : "div") as "button";

  return (
    <Root
      {...(onPop
        ? {
            type: "button" as const,
            onClick: onPop,
            "aria-label": "Dialogue bubble — tap for another take",
          }
        : {})}
      className={cn(
        "speech-bubble relative block w-full border-comic bg-paper px-4 py-3 text-left shadow-comic",
        side === "right" ? "ml-auto" : "mr-auto",
        onPop &&
          "cursor-pointer transition-shadow duration-150 hover:shadow-[7px_7px_0_var(--c-electric)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-impact",
        className,
      )}
    >
      {speaker && (
        <span className="mb-1 block font-sans text-label font-bold tracking-[0.18em] text-impact">
          {speaker}
        </span>
      )}
      <span className="block font-sans text-body text-ink">{children}</span>
      <span
        aria-hidden="true"
        className={cn(
          "absolute -bottom-[14px] h-5 w-5 rotate-45 border-r-[3px] border-b-[3px] border-ink bg-paper",
          side === "right" ? "right-8" : "left-8",
        )}
      />
    </Root>
  );
}
