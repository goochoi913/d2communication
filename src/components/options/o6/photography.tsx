"use client";

import { motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";
import { Still } from "@/components/media/still";
import { categoryBySlug, photos, smallPoster } from "@/data/site";
import { EASE, Mono, SectionHeader, Umd, tileBase, tileIn } from "./shared";

type Frame = { src: string; alt: string; caption: string; span: string };

/** Production stills: the photographs, plus covers from the film categories. */
const FRAMES: Frame[] = [
  {
    src: "/images/hero/frozen-river-redline-1600.webp",
    alt: "Black-and-white frozen river with a single red fishing net",
    caption: "Frozen river · selective colour",
    span: "col-span-2 aspect-[16/10] lg:col-span-6 lg:row-span-2 lg:aspect-auto",
  },
  ...photos.map((p) => ({
    src: smallPoster(p.src),
    alt: p.alt,
    caption: p.caption,
    span: "col-span-2 aspect-[16/10] sm:col-span-1 lg:col-span-3 lg:aspect-auto",
  })),
  ...(["promo", "performance"] as const).map((slug) => {
    const c = categoryBySlug(slug);
    return {
      src: smallPoster(c.cover),
      alt: `Production still — ${c.name}`,
      caption: c.name,
      span: "col-span-2 aspect-[16/10] sm:col-span-1 lg:col-span-3 lg:aspect-auto",
    };
  }),
];

export function Photography() {
  const category = categoryBySlug("photography");
  const reduce = useReducedMotion();

  return (
    <section id="photography" className="mx-auto max-w-[1600px] scroll-mt-16 px-2.5">
      <SectionHeader
        index="05"
        label="Photography"
        title={
          <>
            Stills from the field, <span className="text-neutral-400">by the same eye.</span>
          </>
        }
        aside={<p className="max-w-sm pb-1 text-[15px] leading-relaxed text-neutral-500">{category.description}</p>}
      />

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={{ show: { transition: { staggerChildren: 0.07 } } }}
        className="grid grid-cols-2 gap-2.5 lg:auto-rows-[clamp(170px,13.4vw,232px)] lg:grid-cols-12"
      >
        {FRAMES.map((f, i) => (
          <motion.figure key={f.src} variants={tileIn} className={cn(tileBase, "group bg-neutral-800", f.span)}>
            <motion.div
              className="absolute inset-0"
              whileHover={reduce ? undefined : { scale: 1.04 }}
              transition={{ duration: 1.1, ease: EASE }}
            >
              <Still
                src={f.src}
                alt={f.alt}
                sizes={i === 0 ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 25vw, 50vw"}
                className="size-full object-cover"
              />
            </motion.div>
            <figcaption className="pointer-events-none absolute inset-x-3 bottom-3 flex items-center justify-between gap-3">
              <Umd>{f.caption}</Umd>
              <Mono className="rounded-[7px] bg-black/55 px-2 py-[5px] text-white/70 backdrop-blur-md">
                {String(i + 1).padStart(2, "0")}
              </Mono>
            </figcaption>
          </motion.figure>
        ))}
      </motion.div>
    </section>
  );
}
