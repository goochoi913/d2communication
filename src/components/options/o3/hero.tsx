"use client";

import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { LuArrowRight } from "react-icons/lu";

import { cn } from "@/lib/utils";
import { Still } from "@/components/media/still";
import { company, copy, publicCategories, videosIn } from "@/data/site";
import { EASE, serif } from "./shared";

const STATEMENT = copy.firstPerson.split(" ");

/**
 * Pinned hero (280vh of scroll):
 *   0–0.2   title and category bar leave, the camera keeps dollying in
 *   0.16–0.42 the frame fades towards black
 *   0.3–0.78 the introduction reveals word by word, then the signature
 */
export function Hero({ ready }: { ready: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const scale = useTransform(p, [0, 1], [1.04, 1.24]);
  const titleOpacity = useTransform(p, [0, 0.18], [1, 0]);
  const titleY = useTransform(p, [0, 0.18], [0, -90]);
  const barOpacity = useTransform(p, [0, 0.08], [1, 0]);
  const barY = useTransform(p, [0, 0.08], [0, 48]);
  const shade = useTransform(p, [0.14, 0.4], [0, 0.82]);
  const statementOpacity = useTransform(p, [0.22, 0.3], [0, 1]);
  const signOpacity = useTransform(p, [0.78, 0.86], [0, 1]);
  const signY = useTransform(p, [0.78, 0.86], [16, 0]);

  return (
    <section id="top" ref={ref} className="relative h-[280vh]">
      <div className="sticky top-0 h-svh overflow-hidden">
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: ready ? 1 : 0 }}
          transition={{ duration: 1.3, ease: "easeOut" }}
        >
          <motion.div className="absolute inset-0" style={{ scale }}>
            <Still
              src="/images/hero/frozen-river-redline-2560.webp"
              alt="Black-and-white photograph of a film crew on a frozen Siberian river; a red fishing net is the only colour"
              priority
              className="size-full object-cover object-[50%_64%]"
            />
          </motion.div>
        </motion.div>

        {/* Darken the sky so white type reads cleanly — the fix for the original's contrast. */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[64%] bg-gradient-to-b from-black/65 via-black/30 to-transparent" />
        <motion.div className="pointer-events-none absolute inset-0 bg-neutral-950" style={{ opacity: shade }} />

        <motion.div style={{ opacity: titleOpacity, y: titleY }} className="absolute inset-x-0 top-[13vh] px-6 text-center">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={ready ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.2, delay: 0.2, ease: EASE }}
            className="text-[11px] font-medium tracking-[0.36em] text-white/75 uppercase [text-shadow:0_1px_12px_rgba(0,0,0,0.5)]"
          >
            {company.founder.name} <span className="mx-2 text-white/40">—</span> Television Director & Producer
          </motion.p>
          <h1
            className={cn(
              serif,
              "mt-6 text-[clamp(3.4rem,7vw,7.6rem)] leading-[0.96] font-light tracking-[-0.01em] text-white [text-shadow:0_2px_30px_rgba(0,0,0,0.35)]",
            )}
          >
            <RiseLine ready={ready} delay={0.35}>
              I go where
            </RiseLine>
            <RiseLine ready={ready} delay={0.5}>
              <em className="font-normal italic">the story</em> is.
            </RiseLine>
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={ready ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.2, delay: 0.85, ease: EASE }}
            className="mx-auto mt-7 max-w-[34rem] text-[17px] leading-relaxed text-white/85 [text-shadow:0_1px_16px_rgba(0,0,0,0.55)]"
          >
            Fifty documentaries and films for broadcasters, companies and the stage — from the Joseon archives to the
            Siberian winter.
          </motion.p>
        </motion.div>

        <motion.div style={{ opacity: statementOpacity }} className="absolute inset-0 grid place-items-center px-6">
          <div className="max-w-[64rem] text-center">
            <p className={cn(serif, "text-[clamp(1.75rem,2.9vw,3rem)] leading-[1.28] font-light text-white")}>
              {STATEMENT.map((word, i) => {
                const start = 0.3 + (i / STATEMENT.length) * 0.46;
                return (
                  <Word key={i} progress={p} range={[start, start + 0.46 / STATEMENT.length + 0.02]}>
                    {word}
                  </Word>
                );
              })}
            </p>
            <motion.p
              style={{ opacity: signOpacity, y: signY }}
              className="mt-10 text-[11px] tracking-[0.36em] text-neutral-400 uppercase"
            >
              <span className={cn(serif, "mr-3 text-xl tracking-normal text-white normal-case italic")}>
                {company.founder.name}
              </span>
              <span lang="ko" className="tracking-[0.12em]">
                {company.founder.nameKo}
              </span>
            </motion.p>
          </div>
        </motion.div>

        {/* The original's four links at the bottom, kept as a homage — now as a clear index of the work. */}
        <motion.nav
          aria-label="Work"
          style={{ opacity: barOpacity, y: barY }}
          className="absolute inset-x-0 bottom-0 px-6 pb-6 md:px-10 md:pb-8"
        >
          <motion.ul
            initial={{ opacity: 0, y: 24 }}
            animate={ready ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.2, delay: 1.0, ease: EASE }}
            className="mx-auto grid max-w-[1600px] grid-cols-2 border-t border-neutral-950/20 md:grid-cols-4"
          >
            {publicCategories.map((c, i) => {
              const count = c.slug === "photography" ? null : videosIn(c.slug).length;
              return (
                <li key={c.slug} className={cn("border-neutral-950/15", i > 0 && "md:border-l")}>
                  <a
                    href={`#${c.slug}`}
                    className="group flex items-end justify-between gap-4 px-1 pt-5 pb-2 text-neutral-950 transition-colors md:px-6"
                  >
                    <span>
                      <span className="block text-[10px] font-medium tracking-[0.3em] text-neutral-600 uppercase tabular-nums">
                        {String(i + 1).padStart(2, "0")} · {count ? `${count} films` : "Stills"}
                      </span>
                      <span className={cn(serif, "mt-1 block text-[clamp(1.5rem,2.1vw,2.2rem)] leading-tight")}>{c.name}</span>
                    </span>
                    <LuArrowRight className="mb-2 size-5 shrink-0 -translate-x-1 opacity-50 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
                  </a>
                </li>
              );
            })}
          </motion.ul>
        </motion.nav>
      </div>
    </section>
  );
}

function RiseLine({ children, ready, delay }: { children: ReactNode; ready: boolean; delay: number }) {
  return (
    <span className="block overflow-hidden pb-[0.08em]">
      <motion.span
        className="block"
        initial={{ y: "105%" }}
        animate={ready ? { y: "0%" } : {}}
        transition={{ duration: 1.3, delay, ease: EASE }}
      >
        {children}
      </motion.span>
    </span>
  );
}

function Word({ children, progress, range }: { children: ReactNode; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.14, 1]);
  return (
    <motion.span style={{ opacity }} className="inline">
      {children}{" "}
    </motion.span>
  );
}
