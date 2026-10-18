"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

import { cn } from "@/lib/utils";
import { Still } from "@/components/media/still";
import { Reveal } from "@/components/motion/reveal";
import { categoryBySlug, photos } from "@/data/site";
import { Eyebrow, RedLine, serif } from "./shared";

/** A contact-strip of stills that drifts sideways as the page scrolls past. */
export function Photography() {
  const category = categoryBySlug("photography");
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x = useTransform(scrollYProgress, [0, 1], ["4%", "-28%"]);

  return (
    <section id="photography" ref={ref} className="scroll-mt-20 overflow-hidden border-t border-white/10 py-24 md:py-32">
      <div className="mx-auto grid max-w-[1600px] items-end gap-8 px-6 md:grid-cols-12 md:px-10">
        <Reveal className="md:col-span-7">
          <div className="flex items-baseline gap-5">
            <span className={cn(serif, "text-3xl text-[#e5484d] italic")}>IV</span>
            <Eyebrow>{category.tagline}</Eyebrow>
          </div>
          <h3 className={cn(serif, "mt-4 text-[clamp(3rem,6.2vw,6.8rem)] leading-[0.95] font-light")}>{category.name}</h3>
        </Reveal>
        <Reveal delay={0.1} className="md:col-span-4 md:col-start-9">
          <p className="text-[15px] leading-relaxed text-neutral-400">{category.description}</p>
        </Reveal>
      </div>
      <div className="mx-auto max-w-[1600px] px-6 md:px-10">
        <RedLine className="mt-12" />
      </div>

      <motion.div style={{ x }} className="mt-14 flex w-max gap-5 pl-6 md:gap-8 md:pl-10">
        {photos.map((photo) => (
          <figure key={photo.src} className="shrink-0">
            <div
              className={cn(
                "overflow-hidden bg-neutral-900",
                photo.orientation === "portrait" ? "aspect-[4/5] h-[46vh] md:h-[58vh]" : "aspect-[3/2] h-[46vh] md:h-[58vh]",
              )}
            >
              <Still
                src={photo.src}
                alt={photo.alt}
                sizes="60vw"
                className="size-full object-cover grayscale transition-[filter] duration-1000 hover:grayscale-0"
              />
            </div>
            <figcaption className="mt-3 text-[11px] tracking-[0.24em] text-neutral-500 uppercase">{photo.caption}</figcaption>
          </figure>
        ))}
      </motion.div>
    </section>
  );
}
