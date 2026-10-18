"use client";

import { useEffect, type ReactNode } from "react";
import Lenis, { type LenisOptions } from "lenis";
import "lenis/dist/lenis.css";

/**
 * Inertial wheel scrolling (Lenis). Touch scrolling stays native, so phones keep their
 * own physics, and nothing runs when the visitor prefers reduced motion.
 */
export function SmoothScroll({ children, options }: { children: ReactNode; options?: LenisOptions }) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ autoRaf: true, anchors: true, duration: 1.1, ...options });
    window.scrollTo(0, 0);
    return () => lenis.destroy();
  }, [options]);

  return <>{children}</>;
}
