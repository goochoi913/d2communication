"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

import { D2LogoAnimated } from "@/components/brand/d2-logo-animated";
import { useText } from "@/components/content/editable";
import { INTRO_SEEN_CLASS as SEEN_CLASS, INTRO_SEEN_KEY as SEEN } from "@/lib/head-scripts";

/**
 * The logo drawing itself, about a second long, the first time the homepage opens in a
 * visit. Never a loading screen: the page loads underneath, any click, key or scroll skips
 * it, and it doesn't come back for the rest of the visit.
 */
export function Intro({ onDone }: { onDone: () => void }) {
  const t = useText();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const seen = document.documentElement.classList.contains(SEEN_CLASS);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (seen || reduce) {
      onDone();
      return;
    }
    try {
      sessionStorage.setItem(SEEN, "1");
    } catch {
      // storage blocked: it just plays again next time
    }
    const skip = () => setVisible(false);
    window.addEventListener("wheel", skip, { once: true, passive: true });
    window.addEventListener("touchmove", skip, { once: true, passive: true });
    window.addEventListener("keydown", skip, { once: true });
    return () => {
      window.removeEventListener("wheel", skip);
      window.removeEventListener("touchmove", skip);
      window.removeEventListener("keydown", skip);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const finish = () => {
    document.documentElement.classList.add(SEEN_CLASS);
    onDone();
  };

  return (
    <AnimatePresence onExitComplete={finish}>
      {visible ? (
        <motion.div
          key="intro"
          data-intro
          role="button"
          tabIndex={-1}
          aria-label={t("intro.skip")}
          onClick={() => setVisible(false)}
          className="fixed inset-0 z-[60] grid cursor-pointer place-items-center bg-neutral-950 motion-reduce:hidden"
          exit={{ opacity: 0, transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] } }}
        >
          <D2LogoAnimated
            variant="draw"
            speed={2.1}
            className="w-24 md:w-28"
            onComplete={() => setTimeout(() => setVisible(false), 120)}
          />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
