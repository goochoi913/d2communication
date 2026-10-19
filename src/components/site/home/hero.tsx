"use client";

import { useRef, type ReactNode } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { LuArrowRight } from "react-icons/lu";

import { cn } from "@/lib/utils";
import { tr, withUnit } from "@/content/format";
import { navCategories, pagePath, worksIn } from "@/content/select";
import { EImage, Txt } from "@/components/content/editable";
import { parseRich, RichLine } from "@/components/content/rich-text";
import { useSite } from "@/components/content/site-context";
import { LoopVideo } from "@/components/media/loop-video";
import { Picture } from "@/components/media/picture";
import { EASE, serif } from "../typography";

/**
 * The frozen river, pinned while the page scrolls (240vh; less on phones):
 *   0–0.18   the title and category bar leave while the camera keeps dollying in
 *   0.14–0.4 the frame fades towards black
 *   0.28–0.8 the first-person statement appears word by word, then the signature
 */
export function Hero({ ready }: { ready: boolean }) {
  const { content, lang, editing } = useSite();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const scale = useTransform(p, [0, 1], [1.04, 1.22]);
  const titleOpacity = useTransform(p, [0, 0.18], [1, 0]);
  const titleY = useTransform(p, [0, 0.18], [0, -80]);
  const barOpacity = useTransform(p, [0, 0.08], [1, 0]);
  const barY = useTransform(p, [0, 0.08], [0, 40]);
  const shade = useTransform(p, [0.14, 0.4], [0, 0.84]);
  const statementOpacity = useTransform(p, [0.22, 0.3], [0, 1]);
  const signOpacity = useTransform(p, [0.8, 0.88], [0, 1]);
  const signY = useTransform(p, [0.8, 0.88], [16, 0]);

  const hero = content.images.hero;
  const statement = tr(content.text["statement.text"], lang);
  const words = statement.split(/\s+/).filter(Boolean);
  const titleLines = parseRich(tr(content.text["hero.title"], lang));

  // In edit mode everything sits still and visible, so every line can be clicked and edited.
  const still = editing;

  return (
    <section id="top" ref={ref} className={cn("relative", still ? "" : "h-[200svh] md:h-[240vh]")}>
      <div className={cn("top-0 overflow-hidden", still ? "relative h-svh" : "sticky h-svh")}>
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: ready ? 1 : 0 }}
          transition={{ duration: 1.3, ease: "easeOut" }}
        >
          <motion.div className="absolute inset-0" style={still ? undefined : { scale }}>
            <EImage path={["images", "hero"]} image={hero} slot="hero" className="absolute inset-0">
              <Picture
                image={hero}
                alt={tr(content.text["hero.eyebrow"], lang)}
                priority
                className="absolute inset-0"
                imgClassName={hero.treatment ? undefined : "grayscale"}
              />
              {content.settings.heroLoop ? (
                <LoopVideo loop={content.settings.heroLoop} active={ready && !editing} className="grayscale" />
              ) : null}
            </EImage>
          </motion.div>
        </motion.div>

        {/* Darken the sky so white type reads cleanly — the fix for the original's contrast. */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[66%] bg-gradient-to-b from-black/70 via-black/30 to-transparent" />
        {still ? null : <motion.div className="pointer-events-none absolute inset-0 bg-neutral-950" style={{ opacity: shade }} />}

        <motion.div
          style={still ? undefined : { opacity: titleOpacity, y: titleY }}
          className="absolute inset-x-0 top-[15svh] px-5 text-center md:top-[13vh]"
        >
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={ready ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.2, delay: 0.2, ease: EASE }}
          >
            <Txt
              k="hero.eyebrow"
              as="p"
              className="text-[11px] font-medium tracking-[0.3em] text-white/80 uppercase [text-shadow:0_1px_12px_rgba(0,0,0,0.5)] md:text-xs md:tracking-[0.34em]"
            />
          </motion.div>
          {editing ? (
            <Txt
              k="hero.title"
              as="h1"
              multiline
              rich
              className={cn(serif, "mt-6 text-[clamp(3rem,7vw,7.6rem)] leading-[0.98] font-light text-white")}
            />
          ) : (
            <h1
              className={cn(
                serif,
                "mt-5 text-[clamp(2.9rem,7vw,7.6rem)] leading-[0.98] font-light tracking-[-0.01em] text-white [text-shadow:0_2px_30px_rgba(0,0,0,0.35)] md:mt-6",
              )}
            >
              {titleLines.map((segments, i) => (
                <RiseLine key={i} ready={ready} delay={0.35 + i * 0.15}>
                  <RichLine segments={segments} />
                </RiseLine>
              ))}
            </h1>
          )}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={ready ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.2, delay: 0.85, ease: EASE }}
          >
            <Txt
              k="hero.sub"
              as="p"
              multiline
              className="mx-auto mt-6 max-w-[34rem] text-base leading-relaxed text-white/85 [text-shadow:0_1px_16px_rgba(0,0,0,0.55)] md:mt-7 md:text-[17px]"
            />
          </motion.div>
        </motion.div>

        {still ? null : (
          <motion.div style={{ opacity: statementOpacity }} className="pointer-events-none absolute inset-0 grid place-items-center px-6">
            <div className="max-w-[62rem] text-center">
              <p className={cn(serif, "text-[clamp(1.6rem,2.9vw,3rem)] leading-[1.3] font-light text-white")}>
                {words.map((word, i) => {
                  const start = 0.3 + (i / words.length) * 0.46;
                  return (
                    <Word key={i} progress={p} range={[start, start + 0.46 / words.length + 0.02]}>
                      {word}
                    </Word>
                  );
                })}
              </p>
              <motion.p style={{ opacity: signOpacity, y: signY }} className="mt-10 text-xs tracking-[0.3em] text-neutral-400 uppercase">
                <span className={cn(serif, "mr-3 text-xl tracking-normal text-white normal-case italic")}>
                  {tr(content.text["person.name"], lang)}
                </span>
                <span lang={lang === "ko" ? "en" : "ko"} className="tracking-[0.12em]">
                  {tr(content.text["person.nameAlt"], lang)}
                </span>
              </motion.p>
            </div>
          </motion.div>
        )}

        <CategoryBar ready={ready} style={still ? undefined : { opacity: barOpacity, y: barY }} />
      </div>

      {still ? (
        <div className="border-t border-white/10 bg-neutral-950 px-6 py-20 text-center">
          <Txt
            k="statement.text"
            as="p"
            multiline
            className={cn(serif, "mx-auto max-w-[62rem] text-[clamp(1.6rem,2.9vw,3rem)] leading-[1.3] font-light text-white")}
          />
          <p className="mt-8 text-xs tracking-[0.3em] text-neutral-400 uppercase">
            <Txt k="person.name" className={cn(serif, "mr-3 text-xl tracking-normal text-white normal-case italic")} />
            <Txt k="person.nameAlt" className="tracking-[0.12em]" />
          </p>
        </div>
      ) : null}
    </section>
  );
}

/** The original mockup's four links, kept as an index of the work at the foot of the photograph. */
function CategoryBar({ ready, style }: { ready: boolean; style?: Record<string, MotionValue<number>> }) {
  const { content, lang, editing } = useSite();
  const categories = navCategories(content, editing);
  // Dark type on a light foreground (the snow), light type when the photo ends dark.
  const light = content.images.hero.bottomTone === "dark";

  return (
    <motion.nav aria-label="Work" style={style} className="absolute inset-x-0 bottom-0 px-5 pb-5 md:px-10 md:pb-8">
      <motion.ul
        initial={{ opacity: 0, y: 24 }}
        animate={ready ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1.2, delay: 1.0, ease: EASE }}
        className={cn(
          "mx-auto grid max-w-[1600px] grid-cols-2 border-t md:grid-cols-4",
          light ? "border-white/25 text-white" : "border-neutral-950/20 text-neutral-950",
        )}
      >
        {categories.map((c, i) => {
          const count = c.slug === "photography" ? null : worksIn(content, c.slug, false).length;
          return (
            <li
              key={c.slug}
              className={cn(light ? "border-white/20" : "border-neutral-950/15", i > 0 && "md:border-l", i % 2 === 1 && "border-l")}
            >
              <Link
                href={pagePath(lang, c.slug)}
                className="group flex min-h-16 items-end justify-between gap-3 px-2 pt-4 pb-1.5 md:px-6 md:pt-5 md:pb-2"
              >
                <span className="min-w-0">
                  <span
                    className={cn(
                      "block text-[10px] font-semibold tracking-[0.24em] uppercase tabular-nums md:text-[11px]",
                      light ? "text-white/70" : "text-neutral-700",
                    )}
                  >
                    {String(i + 1).padStart(2, "0")} ·{" "}
                    {count === null ? tr(content.text["work.stills"], lang) : withUnit(count, tr(content.text["work.films"], lang), lang)}
                  </span>
                  <span className={cn(serif, "mt-1 block text-[1.35rem] leading-tight md:text-[clamp(1.5rem,2.1vw,2.2rem)]")}>
                    {tr(c.name, lang)}
                  </span>
                </span>
                <LuArrowRight className="mb-1.5 hidden size-5 shrink-0 -translate-x-1 opacity-50 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 sm:block" />
              </Link>
            </li>
          );
        })}
      </motion.ul>
    </motion.nav>
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
