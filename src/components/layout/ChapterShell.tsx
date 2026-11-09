"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { ChapterHandle } from "@/hooks/useChapter";
import type { ChapterMeta } from "@/types/chapter";

const GROUNDS = {
  yellow: "bg-primary text-ink",
  ink: "bg-ink text-paper",
  paper: "bg-paper text-ink",
} as const;

interface ChapterShellProps {
  chapter: ChapterMeta;
  handle: ChapterHandle;
  children: ReactNode;
  className?: string;
  /** Inner wrapper ref for choreography scoping */
  contentRef?: React.RefObject<HTMLDivElement | null>;
}

/**
 * The reusable chapter system (design.md §7 / §10.2):
 * semantic <section>, aria wiring, ground theme, active-chapter
 * observation and scroll progress — animation lives in chapters.
 */
export function ChapterShell({
  chapter,
  handle,
  children,
  className,
  contentRef,
}: ChapterShellProps) {
  return (
    <section
      id={chapter.id}
      data-chapter={chapter.index}
      data-ground={chapter.theme.ground}
      {...handle.sectionProps}
      className={cn(
        "chapter relative w-full overflow-hidden",
        GROUNDS[chapter.theme.ground],
        className,
      )}
    >
      <div ref={contentRef} className="chapter-content relative z-10">
        {children}
      </div>
    </section>
  );
}
