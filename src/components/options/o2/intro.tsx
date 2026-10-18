"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { motion } from "motion/react";

import { D2LogoAnimated } from "@/components/brand/d2-logo-animated";

type Delta = { x: number; y: number; scale: number };

/**
 * The logo assembles large on a white screen — "d2" rises from its baseline, the grey
 * folds unfold — then glides into its place in the hero while the page builds in.
 * About two seconds; scrolling is held until it lands.
 */
export function Intro({
  slotRef,
  play,
  onTravel,
  onDone,
}: {
  slotRef: RefObject<HTMLDivElement | null>;
  /** Mount the logo (after hydration); until then the white sheet simply holds the page. */
  play: boolean;
  onTravel: () => void;
  onDone: () => void;
}) {
  const logoRef = useRef<HTMLDivElement>(null);
  const [delta, setDelta] = useState<Delta | null>(null);

  useEffect(() => {
    const html = document.documentElement;
    const previous = html.style.overflow;
    html.style.overflow = "hidden";
    return () => {
      html.style.overflow = previous;
    };
  }, []);

  const travel = () => {
    const from = logoRef.current?.getBoundingClientRect();
    const to = slotRef.current?.getBoundingClientRect();
    if (!from || !to || from.width === 0) {
      onDone();
      return;
    }
    setDelta({
      x: to.left + to.width / 2 - (from.left + from.width / 2),
      y: to.top + to.height / 2 - (from.top + from.height / 2),
      scale: to.width / from.width,
    });
    onTravel();
  };

  return (
    <div data-lenis-prevent className="fixed inset-0 z-[70]">
      <motion.div
        className="absolute inset-0 bg-white"
        initial={{ opacity: 1 }}
        animate={{ opacity: delta ? 0 : 1 }}
        transition={{ duration: 0.75, delay: 0.1, ease: "easeOut" }}
      />
      <div className="absolute inset-0 grid place-items-center">
        <motion.div
          ref={logoRef}
          className="w-[min(38vw,620px)]"
          initial={false}
          animate={delta ?? { x: 0, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.65, 0, 0.35, 1] }}
          onAnimationComplete={() => {
            if (delta) onDone();
          }}
        >
          {play ? (
            <D2LogoAnimated variant="assemble" speed={1.4} delay={0.1} onComplete={travel} className="block w-full" />
          ) : null}
        </motion.div>
      </div>
    </div>
  );
}
