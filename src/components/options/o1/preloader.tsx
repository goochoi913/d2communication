"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

import { D2LogoAnimated } from "@/components/brand/d2-logo-animated";
import { EASE_IN_OUT } from "./shared";

/** Under 1.4 s: the logo traces itself on black, then the curtain lifts. No loading counter. */
export function Preloader({ onDone }: { onDone: () => void }) {
  const [visible, setVisible] = useState(true);
  const overlayRef = useRef<HTMLDivElement>(null);
  const onDoneRef = useRef(onDone);
  const finished = useRef(false);

  useEffect(() => {
    onDoneRef.current = onDone;
  }, [onDone]);

  const finish = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    setVisible(false);
    onDoneRef.current();
  }, []);

  useEffect(() => {
    const overlay = overlayRef.current;
    // Hold the page still (including Lenis, which listens on window) while the curtain is down.
    const block = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
    };
    overlay?.addEventListener("wheel", block, { passive: false });
    overlay?.addEventListener("touchmove", block, { passive: false });
    const safety = setTimeout(finish, 1400);
    return () => {
      clearTimeout(safety);
      overlay?.removeEventListener("wheel", block);
      overlay?.removeEventListener("touchmove", block);
    };
  }, [finish]);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          key="preloader"
          ref={overlayRef}
          aria-hidden
          className="fixed inset-0 z-[70] grid place-items-center bg-[#0a0a0a]"
          exit={{ y: "-100%", transition: { duration: 0.95, ease: EASE_IN_OUT } }}
        >
          <motion.div exit={{ opacity: 0, y: -32, transition: { duration: 0.45, ease: EASE_IN_OUT } }}>
            <D2LogoAnimated variant="draw" speed={1.6} className="w-20 md:w-24" onComplete={finish} />
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
