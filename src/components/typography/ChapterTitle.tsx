import { cn } from "@/lib/utils";
import { MetaLabel } from "./MetaLabel";

interface ChapterTitleProps {
  number: string;
  title: string;
  subtitle: string;
  titleId: string;
  /** Ground determines ink/paper treatment */
  ground?: "yellow" | "ink" | "paper";
  className?: string;
}

/**
 * Theatrical chapter introduction (design.md §2.1) —
 * graphic number marker + oversized title + subtitle.
 * Chapters animate `.chapter-title` / `.chapter-sub` themselves.
 */
export function ChapterTitle({
  number,
  title,
  subtitle,
  titleId,
  ground = "paper",
  className,
}: ChapterTitleProps) {
  const onDark = ground === "ink";

  return (
    <header className={cn("chapter-header relative z-20", className)}>
      <div className="flex items-center gap-3">
        <span
          className={cn(
            "chapter-marker inline-flex items-center justify-center border-[3px] px-3 py-1 font-display text-2xl leading-none",
            onDark
              ? "border-paper bg-primary text-ink"
              : "border-ink bg-ink text-primary",
          )}
        >
          {number}
        </span>
        <MetaLabel className={onDark ? "text-paper/80" : "text-ink/70"}>
          Chapter {number}
        </MetaLabel>
        <span
          aria-hidden="true"
          className={cn(
            "chapter-rule hidden h-[3px] flex-1 sm:block",
            onDark ? "bg-paper/40" : "bg-ink/40",
          )}
        />
      </div>

      <h2
        id={titleId}
        className={cn(
          "chapter-title mt-4 font-display text-display-lg uppercase",
          onDark ? "text-paper" : "text-ink",
        )}
      >
        {title}
      </h2>

      <p
        className={cn(
          "chapter-sub mt-2 max-w-2xl font-sans text-body",
          onDark ? "text-paper/85" : "text-ink/80",
        )}
      >
        {subtitle}
      </p>
    </header>
  );
}
