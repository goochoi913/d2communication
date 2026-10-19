"use client";

import { useEffect, useRef } from "react";
import { animate, useInView, useReducedMotion } from "motion/react";

/** "50+" → { n: 50, prefix: "", suffix: "+" }; anything without a number is shown as written. */
function split(value: string) {
  const m = value.match(/^(\D*?)(\d+)([\s\S]*)$/);
  return m ? { prefix: m[1], n: Number(m[2]), suffix: m[3] } : null;
}

/** Counts the number in `value` up from zero the first time it scrolls into view. */
export function CountUp({ value, duration = 1.8, className }: { value: string; duration?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const parts = split(value);

  // Server HTML carries the real number; once hydrated, start from zero until visible.
  useEffect(() => {
    if (!reduce && parts && ref.current && !inView) ref.current.textContent = `${parts.prefix}0${parts.suffix}`;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el || !inView || !parts) return;
    if (reduce) {
      el.textContent = value;
      return;
    }
    const controls = animate(0, parts.n, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => (el.textContent = `${parts.prefix}${Math.round(v)}${parts.suffix}`),
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, value, duration, reduce]);

  return (
    <span ref={ref} className={className}>
      {value}
    </span>
  );
}
