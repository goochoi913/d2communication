"use client";

import { useEffect, useRef, useSyncExternalStore, type ReactNode, type SyntheticEvent } from "react";
import { motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";
import styles from "./o4.module.css";

export const EASE = [0.22, 1, 0.36, 1] as const;
export const EASE_IN_OUT = [0.7, 0, 0.2, 1] as const;
export const RED = "#CC0606";

/** Condensed display face (Barlow Condensed) for titles and credits. */
export const cond = "[font-family:var(--font-o4-cond)]";
/** Monospace (JetBrains Mono) for timecodes, slates and metadata. */
export const mono = "[font-family:var(--font-o4-mono)]";

const subscribeNever = () => () => {};

/** False on the server and during hydration, true once the client has taken over. */
export function useHydrated() {
  return useSyncExternalStore(
    subscribeNever,
    () => true,
    () => false,
  );
}

/**
 * The visitor's reduced-motion preference, applied only after hydration so the server HTML
 * and the first client render always match.
 */
export function useReducedMotionSafe() {
  const reduce = useReducedMotion();
  return useHydrated() && !!reduce;
}

/**
 * Fades and lifts its children in the first time they scroll into view. Same initial state on
 * the server and the client; with reduced motion the change is instant.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 28,
  duration = 0.9,
  amount = 0.25,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  duration?: number;
  amount?: number;
}) {
  const reduce = useReducedMotionSafe();
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={reduce ? { duration: 0 } : { duration, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/** Hide an image that fails to load, so a missing still reads as an empty frame. */
export function hideBroken(e: SyntheticEvent<HTMLImageElement>) {
  e.currentTarget.style.visibility = "hidden";
}

/** Small monospaced label, the kind printed on a slate or a monitor. */
export function Label({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn(mono, "text-[11px] leading-none tracking-[0.22em] text-[#8a8a8a] uppercase", className)}>
      {children}
    </p>
  );
}

/** The tally light: a red dot that breathes while "recording". */
export function RecDot({ className }: { className?: string }) {
  const reduce = useReducedMotionSafe();
  return (
    <motion.span
      aria-hidden
      className={cn("inline-block size-2 rounded-full", className)}
      style={{ backgroundColor: RED, boxShadow: `0 0 12px ${RED}` }}
      animate={reduce ? undefined : { opacity: [1, 0.25, 1] }}
      transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Broadcast timecode (HH:MM:SS:FF) running from 10:00:00:00 — the conventional start of
 * programme on a broadcast master — at 25 fps. Updates the DOM directly, once per frame.
 */
export function Timecode({
  className,
  fps = 25,
  startHours = 10,
}: {
  className?: string;
  fps?: number;
  startHours?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotionSafe();

  useEffect(() => {
    if (reduce) return;
    let raf = 0;
    let last = -1;
    const t0 = performance.now();
    const tick = (now: number) => {
      const frames = Math.floor(((now - t0) / 1000) * fps);
      if (frames !== last && ref.current) {
        last = frames;
        const s = Math.floor(frames / fps);
        ref.current.textContent = `${pad(startHours + Math.floor(s / 3600))}:${pad(Math.floor(s / 60) % 60)}:${pad(s % 60)}:${pad(frames % fps)}`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [fps, startHours, reduce]);

  return (
    <span ref={ref} className={cn(mono, "tabular-nums", className)}>
      {`${pad(startHours)}:00:00:00`}
    </span>
  );
}

/** Fixed, full-screen film grain over the whole page. */
export function Grain({ opacity = 0.06 }: { opacity?: number }) {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[45] overflow-hidden" style={{ opacity }}>
      <div className={styles.grain} />
    </div>
  );
}

/** Thin viewfinder corner marks around a frame. */
export function FrameGuides({ className, inset = 24 }: { className?: string; inset?: number }) {
  const corner = "absolute size-6 border-white/35";
  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0", className)} style={{ padding: inset }}>
      <div className="relative size-full">
        <span className={cn(corner, "top-0 left-0 border-t border-l")} />
        <span className={cn(corner, "top-0 right-0 border-t border-r")} />
        <span className={cn(corner, "bottom-0 left-0 border-b border-l")} />
        <span className={cn(corner, "right-0 bottom-0 border-r border-b")} />
      </div>
    </div>
  );
}
