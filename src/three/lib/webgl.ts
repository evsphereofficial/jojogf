"use client";

/**
 * WebGL capability probe — scenes must fall back to DOM
 * compositions when unavailable (design.md §11.5).
 * Result is cached: the probe is deterministic per page load and
 * `useSyncExternalStore` requires a stable snapshot.
 */
let cached: boolean | null = null;

export function supportsWebGL(): boolean {
  if (typeof window === "undefined") return false;
  if (cached !== null) return cached;
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl2") ??
      canvas.getContext("webgl") ??
      canvas.getContext("experimental-webgl");
    cached = !!gl;
  } catch {
    cached = false;
  }
  return cached;
}
