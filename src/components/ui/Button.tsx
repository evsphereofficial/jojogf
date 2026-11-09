import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  className?: string;
  variant?: "solid" | "outline" | "ink";
  /** Extra semantics for icon-only buttons */
  ariaLabel?: string;
  type?: "button" | "submit";
}

const VARIANTS = {
  solid: "bg-primary text-ink hover:bg-ink hover:text-primary",
  outline: "bg-transparent text-ink hover:bg-ink hover:text-primary",
  ink: "bg-ink text-primary hover:bg-primary hover:text-ink",
} as const;

/**
 * Comic UI button — hard edges, 3px border, hard shadow that
 * presses in on hover/active (CSS transitions only, design.md §9.1).
 */
export function Button({
  children,
  onClick,
  href,
  className,
  variant = "solid",
  ariaLabel,
  type = "button",
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center gap-2 border-[3px] border-ink px-5 py-3",
    "font-sans text-label font-bold tracking-[0.18em] uppercase",
    "shadow-comic transition-all duration-150 ease-settle",
    "hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none",
    "active:translate-x-[6px] active:translate-y-[6px] active:shadow-none",
    VARIANTS[variant],
    className,
  );

  if (href) {
    const Tag: ElementType = "a";
    return (
      <Tag href={href} className={classes} aria-label={ariaLabel}>
        {children}
      </Tag>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes} aria-label={ariaLabel}>
      {children}
    </button>
  );
}
