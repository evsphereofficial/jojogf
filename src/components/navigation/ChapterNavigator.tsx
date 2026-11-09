"use client";

import { cn } from "@/lib/utils";
import { CHAPTERS, MINIMIZED_CHAPTERS } from "@/data/chapters";
import { scrollToTarget } from "@/lib/lenis";
import { useExperienceStore } from "@/lib/store";
import { useMotionOK, useSystemReduced } from "@/hooks/useMotionOK";

/**
 * Manga chapter navigator (design.md §10.4):
 * nine rectangular markers, active = yellow, direct navigation,
 * collapse-to-dots during emotional chapters, mobile bottom bar,
 * plus the always-available FX (motion) toggle.
 */
export function ChapterNavigator() {
  const active = useExperienceStore((s) => s.activeChapter);
  const setMotionOverride = useExperienceStore((s) => s.setMotionOverride);
  const motionOK = useMotionOK();
  const systemReduced = useSystemReduced();

  const chapter = CHAPTERS[active - 1] ?? CHAPTERS[0];
  const minimized = MINIMIZED_CHAPTERS.includes(active);
  const onDark = chapter.theme.ground === "ink";

  const handleToggle = () => {
    setMotionOverride(motionOK ? "reduced" : "auto");
  };

  return (
    <nav
      aria-label="Chapter navigation"
      className={cn(
        "fixed z-nav transition-all duration-300 ease-settle",
        /* mobile: bottom bar */
        "inset-x-0 bottom-0 border-t-[3px] px-2 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]",
        onDark ? "border-paper/30 bg-ink" : "border-ink bg-ink",
        /* desktop: right rail */
        "lg:inset-x-auto lg:top-1/2 lg:right-4 lg:bottom-auto lg:-translate-y-1/2 lg:border-[3px] lg:px-2 lg:py-3 lg:pb-2",
        "lg:shadow-[6px_6px_0_rgba(0,0,0,0.25)]",
      )}
    >
      <div className="relative flex items-center gap-2 lg:flex-col lg:gap-2.5">
        <ul
          role="list"
          className="flex flex-1 items-center justify-center gap-1 lg:flex-none lg:flex-col lg:justify-start"
        >
          {CHAPTERS.map((c) => {
            const isActive = c.index === active;
            return (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => scrollToTarget(`#${c.id}`)}
                  aria-current={isActive ? "true" : undefined}
                  aria-label={`Chapter ${c.number}: ${c.title}`}
                  className={cn(
                    "grid h-10 w-10 place-items-center transition-all duration-300 ease-settle",
                    minimized
                      ? "border-0 bg-transparent"
                      : "border-2 font-display text-base",
                    minimized
                      ? isActive
                        ? "bg-transparent"
                        : "bg-transparent hover:bg-paper/10"
                      : isActive
                        ? "border-primary bg-primary text-ink shadow-[3px_3px_0_rgba(0,0,0,0.45)]"
                        : "border-paper/25 text-paper/70 hover:border-primary hover:text-primary",
                  )}
                >
                  {minimized ? (
                    <span
                      aria-hidden="true"
                      className={cn(
                        "block rounded-full transition-all duration-300",
                        isActive
                          ? "h-3.5 w-3.5 bg-primary"
                          : "h-2 w-2 bg-paper/40",
                      )}
                    />
                  ) : (
                    c.number
                  )}
                </button>
              </li>
            );
          })}
        </ul>

        {/* FX toggle — design.md §13 user control */}
        <button
          type="button"
          onClick={handleToggle}
          disabled={systemReduced}
          aria-pressed={motionOK}
          aria-label={
            systemReduced
              ? "Motion reduced by system setting"
              : "Toggle motion effects"
          }
          title={
            systemReduced
              ? "Reduced by your system setting"
              : "Toggle motion effects"
          }
          className={cn(
            "shrink-0 border-2 px-2 py-1.5 font-sans text-[0.5625rem] font-bold tracking-[0.14em] uppercase transition-colors duration-150",
            systemReduced
              ? "cursor-not-allowed border-paper/20 text-paper/40"
              : motionOK
                ? "border-paper/40 text-paper/80 hover:border-primary hover:text-primary"
                : "border-impact bg-impact text-paper",
          )}
        >
          {systemReduced ? "SYS" : motionOK ? "FX ON" : "FX OFF"}
        </button>

        {/* Active chapter label (desktop, full mode only) */}
        {!minimized && (
          <span
            key={chapter.id}
            className={cn(
              "pointer-events-none absolute right-full mr-4 hidden whitespace-nowrap border-[3px] border-ink bg-primary px-3 py-1.5",
              "font-sans text-label font-bold tracking-[0.18em] text-ink uppercase shadow-comic",
              "lg:block",
            )}
          >
            {chapter.number} · {chapter.title}
          </span>
        )}
      </div>
    </nav>
  );
}
