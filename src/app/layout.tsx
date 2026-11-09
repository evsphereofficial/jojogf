import type { Metadata, Viewport } from "next";
import { fontVariables } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "BIZARRE LOVE — OUR BIZARRE ADVENTURE (VOL. 06)",
  description:
    "SIX MONTHS. ONE STORY. An interactive cinematic manga anniversary experience — nine chapters, TO BE CONTINUED...",
  applicationName: "BIZARRE LOVE",
  keywords: [
    "BIZARRE LOVE",
    "OUR BIZARRE ADVENTURE",
    "VOL. 06",
    "anniversary",
    "manga",
  ],
};

export const viewport: Viewport = {
  themeColor: "#F4D94E",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${fontVariables} antialiased`}>
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
