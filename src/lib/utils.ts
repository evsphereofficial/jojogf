/** Tiny class-name joiner (no dependency needed). */
export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

/** Split a string into display parts for kinetic typography. */
export function splitChars(text: string): string[] {
  return Array.from(text);
}

export function splitWords(text: string): string[] {
  return text.split(/(\s+)/).filter((part) => part.length > 0);
}

/** Clamp helper for refs/progress values. */
export function clamp(value: number, min = 0, max = 1): number {
  return Math.min(max, Math.max(min, value));
}

/** Polygon points for comic star-burst badges (clip-path). */
export function starPolygon(
  points = 16,
  outer = 50,
  inner = 41,
): string {
  const pts: string[] = [];
  for (let i = 0; i < points * 2; i += 1) {
    const r = i % 2 === 0 ? outer : inner;
    const a = (Math.PI * i) / points - Math.PI / 2;
    pts.push(
      `${(50 + r * Math.cos(a)).toFixed(2)}% ${(50 + r * Math.sin(a)).toFixed(2)}%`,
    );
  }
  return pts.join(", ");
}
