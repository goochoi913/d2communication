"use client";

import { useSyncExternalStore } from "react";
import { useReducedMotion } from "motion/react";

const noSubscription = () => () => {};

/** False while server-rendering and hydrating, true afterwards. */
export function useIsClient() {
  return useSyncExternalStore(noSubscription, () => true, () => false);
}

/**
 * The visitor's reduced-motion preference, reported only after hydration so the first
 * client render matches the server HTML exactly (motion's own hook reads the media query
 * during render, which makes React log hydration mismatches for reduced-motion visitors).
 */
export function useReducedMotionSafe() {
  const isClient = useIsClient();
  const reduce = useReducedMotion();
  return isClient && !!reduce;
}
