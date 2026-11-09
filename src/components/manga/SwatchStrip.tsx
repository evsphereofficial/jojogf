import { cn } from "@/lib/utils";

const SWATCHES = [
  { name: "Primary Yellow", hex: "#F4D94E" },
  { name: "Ink Black", hex: "#141414" },
  { name: "Paper Cream", hex: "#F7F1DF" },
  { name: "Impact Red", hex: "#EC3C43" },
  { name: "Electric Cyan", hex: "#16B8B1" },
] as const;

interface SwatchStripProps {
  className?: string;
  /** Show hex values (desktop hero only) */
  caption?: boolean;
}

/** The five locked swatches — a nod to the reference composition. */
export function SwatchStrip({ className, caption = false }: SwatchStripProps) {
  return (
    <div className={cn("flex items-end gap-2", className)}>
      {SWATCHES.map((s) => (
        <div key={s.hex} className="group/sw flex flex-col gap-1">
          <span
            className="block h-6 w-10 border-[3px] border-ink sm:h-7 sm:w-14"
            style={{ backgroundColor: s.hex }}
            title={s.name}
          />
          {caption && (
            <span className="hidden font-sans text-[0.5625rem] font-bold tracking-wider text-ink/70 uppercase lg:block">
              {s.hex}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
