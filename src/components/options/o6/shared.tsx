"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { motion, useReducedMotion, type Variants } from "motion/react";

import { cn } from "@/lib/utils";

export const EASE = [0.22, 1, 0.36, 1] as const;
export const TALLY = "#CC0606";

/** Small monitor-style label (Geist Mono, uppercase). */
export const mono = "[font-family:var(--font-o6-mono)] text-[10.5px] leading-none font-medium tracking-[0.12em] uppercase";

export const tileBase =
  "relative overflow-hidden rounded-[16px] outline-none focus-visible:ring-2 focus-visible:ring-[#CC0606] focus-visible:ring-offset-2 focus-visible:ring-offset-[#e5e5e5]";

/** Entrance used by every tile in a staggered grid. */
export const tileIn: Variants = {
  hidden: { opacity: 0, scale: 0.96, y: 14 },
  show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
};

export function Mono({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn(mono, className)}>{children}</span>;
}

/** Tally light: red when the source is live (or hovered), grey otherwise. */
export function Tally({ live = false, pulse = false, className }: { live?: boolean; pulse?: boolean; className?: string }) {
  return (
    <motion.span
      aria-hidden
      className={cn(
        "inline-block size-[7px] shrink-0 rounded-full transition-colors duration-300",
        live ? "bg-[#CC0606] shadow-[0_0_0_3px_rgba(204,6,6,0.22)]" : "bg-[#6C6F6F]",
        className,
      )}
      animate={pulse ? { opacity: [1, 0.35, 1] } : undefined}
      transition={pulse ? { duration: 1.6, repeat: Infinity, ease: "easeInOut" } : undefined}
    />
  );
}

/** Under-monitor label chip, as on a multiview wall. */
export function Umd({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-[7px] bg-black/55 px-2 py-[5px] text-white backdrop-blur-md",
        mono,
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Running SMPTE-style timecode (HH:MM:SS:FF) since the page opened. */
export function Timecode({ fps = 25, className }: { fps?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (reduce) return;
    const start = performance.now();
    let raf = 0;
    let last = -1;
    const tick = (now: number) => {
      const t = (now - start) / 1000;
      const frame = Math.floor(t * fps);
      if (frame !== last && ref.current) {
        last = frame;
        const ff = frame % fps;
        const s = Math.floor(t) % 60;
        const m = Math.floor(t / 60) % 60;
        const h = Math.floor(t / 3600);
        ref.current.textContent = [h, m, s, ff].map((n) => String(n).padStart(2, "0")).join(":");
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [fps, reduce]);
  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      00:00:00:00
    </span>
  );
}

/** Local time at the studio, so international clients know when we're awake. */
export function SeoulClock({ className }: { className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const format = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Seoul",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    const update = () => {
      if (ref.current) ref.current.textContent = format.format(new Date());
    };
    update();
    const id = window.setInterval(update, 10_000);
    return () => window.clearInterval(id);
  }, []);
  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      --:--
    </span>
  );
}

export function SectionHeader({
  index,
  label,
  title,
  aside,
  id,
  className,
}: {
  index: string;
  label: string;
  title: ReactNode;
  aside?: ReactNode;
  id?: string;
  className?: string;
}) {
  return (
    <div
      id={id}
      className={cn("flex scroll-mt-20 flex-wrap items-end justify-between gap-x-10 gap-y-6 px-1.5 pt-28 pb-7 md:pt-36", className)}
    >
      <div className="max-w-4xl">
        <Mono className="text-neutral-500">
          {index} <span className="text-neutral-400">—</span> {label}
        </Mono>
        <h2 className="mt-4 text-[clamp(2.25rem,3.6vw,3.75rem)] leading-[1] font-semibold tracking-[-0.045em] text-balance text-neutral-950">
          {title}
        </h2>
      </div>
      {aside}
    </div>
  );
}

// ── Work filter shared by the nav, the camera tiles and the work grid ────────────────

export type WorkFilter = "all" | "broadcast" | "promo" | "performance";
const FILTERS: WorkFilter[] = ["all", "broadcast", "promo", "performance"];

type FilterContext = { filter: WorkFilter; setFilter: (f: WorkFilter) => void };
const Ctx = createContext<FilterContext | null>(null);

function subscribeHash(onChange: () => void) {
  window.addEventListener("hashchange", onChange);
  return () => window.removeEventListener("hashchange", onChange);
}

/**
 * The work grid's filter. A deep link such as #promo opens on that category (the same idea
 * as the final site's /promo URLs); after that, clicks in the nav, tiles or tabs decide.
 */
export function FilterProvider({ children }: { children: ReactNode }) {
  const hash = useSyncExternalStore(
    subscribeHash,
    () => window.location.hash.slice(1),
    () => "",
  );
  const [picked, setPicked] = useState<WorkFilter | null>(null);
  const fromHash = FILTERS.includes(hash as WorkFilter) ? (hash as WorkFilter) : null;
  const filter = picked ?? fromHash ?? "all";
  const value = useMemo(() => ({ filter, setFilter: setPicked }), [filter]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useWorkFilter() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useWorkFilter must be used inside <FilterProvider>");
  return ctx;
}
