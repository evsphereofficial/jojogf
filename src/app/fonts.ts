import { Anton, Playfair_Display, Space_Grotesk } from "next/font/google";

/* Display — heavy condensed impact type (design.md §4.1) */
export const anton = Anton({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-anton",
  fallback: ["Impact", "Haettenschweiler", "Arial Narrow", "sans-serif"],
});

/* Interface + body — clean, highly legible grotesk */
export const grotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-grotesk",
  fallback: ["system-ui", "sans-serif"],
});

/* Manga accent — dramatic italic emphasis words only */
export const playfair = Playfair_Display({
  subsets: ["latin"],
  style: "italic",
  /* only the 400 italic accent is used — trimming 700/900 saves
     two font downloads on phones (design.md §11.4 budgets) */
  weight: "400",
  display: "swap",
  variable: "--font-playfair",
  fallback: ["Georgia", "serif"],
});

export const fontVariables = `${anton.variable} ${grotesk.variable} ${playfair.variable}`;
