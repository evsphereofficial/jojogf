"use client";

/** First focusable element — jumps past navigation to the story. */
export function SkipLink() {
  return (
    <a
      href="#main"
      className="sr-only fixed top-2 left-2 z-skip border-[3px] border-ink bg-primary px-4 py-2 font-sans text-label font-bold tracking-[0.18em] text-ink uppercase shadow-comic focus:not-sr-only focus:fixed"
    >
      Skip to story
    </a>
  );
}
