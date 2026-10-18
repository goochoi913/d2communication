"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { LuArrowRight, LuPlay } from "react-icons/lu";

import { cn } from "@/lib/utils";
import { Still } from "@/components/media/still";
import { useVideoPlayer } from "@/components/media/video-player";
import { company, copy, videos } from "@/data/site";
import { EASE, Kicker, Label, frame, serif } from "./shared";

/** The cover story: the frozen-river photograph and the film it came from. */
export function LeadStory() {
  const video = videos.find((v) => v.id === "ice-road")!;
  const { open } = useVideoPlayer();
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const drift = useTransform(scrollYProgress, [0, 1], ["0%", "9%"]);

  const rise = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 1.1, delay, ease: EASE },
  });

  return (
    <section ref={ref} aria-labelledby="lead-title" className={cn(frame, "pt-10 md:pt-12")}>
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
        <figure className="lg:col-span-8">
          <motion.button
            type="button"
            onClick={() => open(video)}
            aria-label={`Play ${video.title}`}
            className="group relative block aspect-[16/10] w-full cursor-pointer overflow-hidden bg-(--o5-plate)"
            initial={reduce ? false : { clipPath: "inset(0% 100% 0% 0%)" }}
            animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
            transition={{ duration: 1.6, delay: 0.25, ease: EASE }}
          >
            <motion.div
              className="absolute inset-[-6%_0]"
              style={{ y: reduce ? 0 : drift }}
              initial={reduce ? false : { scale: 1.12 }}
              animate={{ scale: 1 }}
              transition={{ duration: 2.4, delay: 0.25, ease: EASE }}
            >
              <Still
                src="/images/hero/frozen-river-color-2560.webp"
                alt="A film crew with snowmobiles and a tripod on a frozen river beside a Siberian village"
                priority
                sizes="(min-width: 1024px) 62vw, 100vw"
                className="size-full object-cover object-[50%_70%]"
              />
            </motion.div>
            <span className="absolute bottom-5 left-5 inline-flex items-center gap-2.5 bg-(--o5-paper) py-2 pr-4 pl-2.5 text-[11px] font-semibold tracking-[0.14em] text-(--o5-ink) uppercase shadow-sm transition-colors duration-300 group-hover:bg-(--o5-ink) group-hover:text-(--o5-paper)">
              <LuPlay className="size-3.5 fill-current" />
              Watch the film · {video.runtime}
            </span>
          </motion.button>
          <motion.figcaption
            {...rise(1.2)}
            className="mt-3.5 flex gap-3 border-b border-(--o5-rule) pb-3.5 text-[13px] leading-snug text-(--o5-muted)"
          >
            <span className="shrink-0 text-[11px] font-semibold tracking-[0.14em] text-(--o5-red) uppercase">Fig. 1</span>
            <span>
              On location for <em className={cn(serif, "text-[14px] text-(--o5-ink)")}>{video.title}</em> ({video.client},{" "}
              {video.year}). {video.description} Photograph: {company.founder.name}.
            </span>
          </motion.figcaption>
        </figure>

        <div className="flex flex-col lg:col-span-4 lg:border-l lg:border-(--o5-rule) lg:pl-8">
          <motion.div {...rise(0.45)} className="flex items-center gap-3">
            <Kicker>Feature</Kicker>
            <span className="h-px flex-1 bg-(--o5-rule)" />
            <Label>The director&rsquo;s issue</Label>
          </motion.div>
          <motion.h2
            id="lead-title"
            {...rise(0.55)}
            className={cn(
              serif,
              "mt-6 text-[clamp(2.4rem,3.55vw,3.2rem)] leading-[1.02] font-medium tracking-[-0.022em] text-balance",
            )}
          >
            Fifty documentaries, and the craft of telling true stories
          </motion.h2>
          <motion.p
            {...rise(0.7)}
            className={cn(serif, "mt-6 text-[1.32rem] leading-[1.4] font-light text-(--o5-ink)/80 italic")}
          >
            {copy.intro}
          </motion.p>
          <motion.p
            {...rise(0.85)}
            className="mt-7 border-t border-(--o5-rule) pt-4 text-[11px] font-medium tracking-[0.14em] text-(--o5-muted) uppercase"
          >
            By <span className="text-(--o5-ink)">{company.founder.name}</span>, {company.founder.role}
          </motion.p>

          <motion.div {...rise(1)} className="mt-auto pt-10">
            <button
              type="button"
              onClick={() => open(video)}
              className="group flex w-full cursor-pointer items-end justify-between gap-6 border-t-[3px] border-(--o5-ink) pt-4 text-left"
            >
              <span>
                <span className="text-[11px] font-semibold tracking-[0.14em] text-(--o5-red) uppercase">
                  Watch the film
                </span>
                <span className={cn(serif, "mt-1 block text-[1.55rem] leading-tight font-medium")}>{video.title}</span>
                <span className="mt-1.5 block text-[12px] text-(--o5-muted)">
                  {video.client} · {video.year} · {video.runtime}
                </span>
              </span>
              <LuArrowRight className="mb-1 size-6 shrink-0 transition-transform duration-300 group-hover:translate-x-1.5" />
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
