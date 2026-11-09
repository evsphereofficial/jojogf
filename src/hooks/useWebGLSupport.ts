"use client";

import { useSyncExternalStore } from "react";
import { supportsWebGL } from "@/three/lib/webgl";

const subscribe = () => () => {};

/**
 * Client-only WebGL capability without hydration mismatch:
 * server snapshot is always `false`, the client snapshot is the
 * cached probe (design.md §11.5).
 */
export function useWebGLSupport(): boolean {
  return useSyncExternalStore(subscribe, supportsWebGL, () => false);
}
