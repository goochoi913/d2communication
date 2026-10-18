"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

import { cn } from "@/lib/utils";
import { D2LogoAnimated } from "@/components/brand/d2-logo-animated";
import { company } from "@/data/site";
import { Label, cond, useHydrated } from "./shared";

/** Card timings in ms: the logo card, the line card, then the fade to the reel. */
const CARD_TWO_AT = 1450;
const FINISH_AT = 2900;

/**
 * Opening titles: two credit cards on black, then a cut to the reel. Any click, key, wheel
 * or touch skips straight to the picture (and the gesture never scrolls the page under it).
 */
export function TitleSequence({ onDone }: { onDone: () => void }) {
  const [card, setCard] = useState<0 | 1>(0);
  // The animated logo picks its markup from the motion preference, so mount it after hydration.
  const hydrated = useHydrated();
  const done = useRef(false);

  useEffect(() => {
    const finish = () => {
      if (done.current) return;
      done.current = true;
      onDone();
    };
    const timers = [setTimeout(() => setCard(1), CARD_TWO_AT), setTimeout(finish, FINISH_AT)];

    // Swallow the gesture so the page stays at the top, then skip.
    const swallow = (e: Event) => {
      e.preventDefault();
      e.stopImmediatePropagation();
      finish();
    };
    const opts = { capture: true, passive: false } as const;
    window.addEventListener("wheel", swallow, opts);
    window.addEventListener("touchmove", swallow, opts);
    window.addEventListener("pointerdown", finish, { capture: true });
    window.addEventListener("keydown", finish, { capture: true });
    return () => {
      timers.forEach(clearTimeout);
      window.removeEventListener("wheel", swallow, opts);
      window.removeEventListener("touchmove", swallow, opts);
      window.removeEventListener("pointerdown", finish, { capture: true });
      window.removeEventListener("keydown", finish, { capture: true });
    };
  }, [onDone]);

  return (
    <motion.div
      className="fixed inset-0 z-[70] grid cursor-pointer place-items-center bg-black"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] } }}
      aria-label="Opening titles"
      role="presentation"
    >
      <AnimatePresence mode="wait">
        {card === 0 ? (
          <motion.div
            key="presents"
            className="flex flex-col items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.6 } }}
            exit={{ opacity: 0, filter: "blur(6px)", transition: { duration: 0.35 } }}
          >
            {hydrated ? (
              <D2LogoAnimated variant="assemble" speed={1.5} className="w-[72px]" />
            ) : (
              <span className="block aspect-[636/506] w-[72px]" />
            )}
            <motion.p
              initial={{ opacity: 0, letterSpacing: "0.32em" }}
              animate={{
                opacity: 1,
                letterSpacing: "0.5em",
                transition: { delay: 0.35, duration: 1.6, ease: "easeOut" },
              }}
              className={cn(cond, "mt-9 pl-[0.5em] text-[19px] font-medium text-[#ededed] uppercase")}
            >
              {company.name}
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.7, duration: 0.8 } }}
              className={cn(cond, "mt-3 pl-[0.6em] text-[13px] tracking-[0.6em] text-[#8a8a8a] uppercase")}
            >
              Presents
            </motion.p>
          </motion.div>
        ) : (
          <motion.div
            key="line"
            className={cn(cond, "text-center leading-[0.95] font-semibold text-[#ededed] uppercase")}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{
              opacity: 1,
              scale: 1,
              transition: { opacity: { duration: 0.5 }, scale: { duration: 1.8, ease: [0.22, 1, 0.36, 1] } },
            }}
            exit={{ opacity: 0, transition: { duration: 0.5 } }}
          >
            <p className="text-[clamp(2.4rem,5vw,4.6rem)] tracking-[0.06em]">Fifty documentaries.</p>
            <p className="mt-2 text-[clamp(2.4rem,5vw,4.6rem)] tracking-[0.06em] text-[#8a8a8a]">One director.</p>
          </motion.div>
        )}
      </AnimatePresence>

      <Label className="absolute right-8 bottom-8 text-[#5f5f5f]">Click or scroll to skip</Label>
      <Label className="absolute bottom-8 left-8 text-[#5f5f5f]">Programme start · 10:00:00:00</Label>
    </motion.div>
  );
}
