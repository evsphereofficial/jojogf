import { cn } from "@/lib/utils";

type ArtVariant = "blocks" | "burst" | "dots" | "portrait" | "scene" | "strip";

interface PlaceholderArtProps {
  variant: ArtVariant;
  className?: string;
  /** Accessible description — decorative art passes "" */
  alt?: string;
}

/**
 * Original procedural panel art (design.md §15 — zero downloads,
 * no copyrighted material). Each variant is a flat graphic
 * composition in the locked palette.
 */
export function PlaceholderArt({ variant, className, alt = "" }: PlaceholderArtProps) {
  return (
    <svg
      viewBox="0 0 400 300"
      preserveAspectRatio="xMidYMid slice"
      className={cn("block h-full w-full", className)}
      role={alt ? "img" : "presentation"}
      aria-label={alt || undefined}
      aria-hidden={alt ? undefined : true}
    >
      {variant === "blocks" && (
        <>
          <rect width="400" height="300" fill="#F7F1DF" />
          <rect x="0" y="0" width="240" height="170" fill="#F4D94E" />
          <rect x="240" y="170" width="160" height="130" fill="#141414" />
          <circle cx="300" cy="80" r="52" fill="#EC3C43" />
          <rect
            x="24"
            y="196"
            width="180"
            height="80"
            fill="#F7F1DF"
            stroke="#141414"
            strokeWidth="6"
          />
          <path d="M0 300 L400 190 L400 300 Z" fill="#16B8B1" opacity="0.9" />
        </>
      )}

      {variant === "burst" && (
        <>
          <rect width="400" height="300" fill="#141414" />
          <polygon
            points="200,20 232,110 320,80 258,148 340,200 248,196 260,288 200,224 140,288 152,196 60,200 142,148 80,80 168,110"
            fill="#F4D94E"
          />
          <circle cx="200" cy="154" r="58" fill="#EC3C43" />
          <circle cx="200" cy="154" r="30" fill="#141414" />
        </>
      )}

      {variant === "dots" && (
        <>
          <rect width="400" height="300" fill="#F4D94E" />
          <circle cx="200" cy="150" r="96" fill="#141414" />
          <circle cx="200" cy="150" r="60" fill="#F7F1DF" />
          <g fill="#141414">
            {Array.from({ length: 40 }).map((_, i) => (
              <circle
                key={i}
                cx={(i * 37) % 400}
                cy={(i * 71) % 300}
                r={i % 3 === 0 ? 6 : 3}
              />
            ))}
          </g>
          <rect x="0" y="252" width="400" height="48" fill="#16B8B1" />
        </>
      )}

      {variant === "portrait" && (
        <>
          <rect width="400" height="300" fill="#F7F1DF" />
          <circle cx="200" cy="132" r="110" fill="#16B8B1" />
          <circle cx="200" cy="120" r="64" fill="#F4D94E" stroke="#141414" strokeWidth="7" />
          <path
            d="M96 300 Q110 196 200 196 Q290 196 304 300 Z"
            fill="#141414"
          />
          <path d="M148 108 L182 96 M218 96 L252 108" stroke="#141414" strokeWidth="9" />
          <path d="M180 156 Q200 172 220 156" stroke="#141414" strokeWidth="7" fill="none" />
        </>
      )}

      {variant === "scene" && (
        <>
          <rect width="400" height="300" fill="#F7F1DF" />
          <circle cx="316" cy="74" r="46" fill="#EC3C43" />
          <rect x="0" y="196" width="400" height="104" fill="#F4D94E" />
          <path
            d="M0 196 L400 196"
            stroke="#141414"
            strokeWidth="7"
          />
          <path d="M40 196 L40 300 M140 196 L120 300 M260 196 L280 300 M360 196 L360 300" stroke="#141414" strokeWidth="5" />
          <g stroke="#141414" strokeWidth="4">
            {Array.from({ length: 9 }).map((_, i) => (
              <line key={i} x1={-40 + i * 18} y1={30 + i * 6} x2={90 + i * 14} y2={70 + i * 8} />
            ))}
          </g>
          <rect x="34" y="40" width="150" height="86" fill="#141414" />
          <rect x="46" y="52" width="126" height="62" fill="#16B8B1" />
        </>
      )}

      {variant === "strip" && (
        <>
          <rect width="400" height="300" fill="#141414" />
          <rect x="0" y="30" width="400" height="54" fill="#F4D94E" />
          <rect x="0" y="120" width="400" height="54" fill="#EC3C43" />
          <rect x="0" y="210" width="400" height="54" fill="#F7F1DF" />
          <rect x="300" y="0" width="60" height="300" fill="#16B8B1" opacity="0.85" />
        </>
      )}
    </svg>
  );
}
