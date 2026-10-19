"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
import { LuArrowRight } from "react-icons/lu";

import { cn } from "@/lib/utils";
import { categoryBySlug, pagePath } from "@/content/select";
import { EAdd, EText, Txt, useVisible } from "@/components/content/editable";
import { useSite } from "@/components/content/site-context";
import { Reveal } from "@/components/motion/reveal";
import { CategoryBadge } from "../category-badge";
import { PhotoCard } from "../photo-card";
import { NUMERALS, RED, RedLine, serif } from "../typography";

const STRIP = 12;

/**
 * A contact strip of photographs. On desktop it drifts sideways as the page scrolls past;
 * on phones it's a row you swipe through.
 */
export function PhotoStrip({ numeral }: { numeral: number }) {
  const { content, lang, editing } = useSite();
  const category = categoryBySlug(content, "photography");
  const photos = useVisible(content.photos).slice(0, STRIP);
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x = useTransform(scrollYProgress, [0, 1], ["4%", "-30%"]);

  if (category.visibility !== "public" && !editing) return null;
  const ids = photos.map((p) => p.id);

  const strip = photos.map((photo) => (
    <PhotoCard
      key={photo.id}
      photo={photo}
      set={photos}
      scopeIds={ids}
      sizes="(min-width: 768px) 40vw, 75vw"
      className="shrink-0 snap-start"
      frameClassName={cn(
        "relative h-[52svh] md:h-[58vh]",
        photo.image.height > photo.image.width ? "aspect-[4/5]" : "aspect-[3/2]",
      )}
    />
  ));

  return (
    <section id="photography" ref={ref} className="scroll-mt-20 overflow-hidden border-t border-white/10 py-20 md:py-32">
      <div className="mx-auto grid max-w-[1600px] items-end gap-6 px-5 md:grid-cols-12 md:gap-8 md:px-10">
        <Reveal className="md:col-span-7">
          <div className="flex items-baseline gap-5">
            <span className={cn(serif, "text-3xl italic")} style={{ color: RED }}>
              {NUMERALS[numeral]}
            </span>
            <EText
              path={["categories", "#photography", "tagline"]}
              value={category.tagline}
              as="p"
              className="text-xs font-medium tracking-[0.28em] text-neutral-400 uppercase"
            />
            <CategoryBadge category={category} />
          </div>
          <EText
            path={["categories", "#photography", "name"]}
            value={category.name}
            as="h3"
            className={cn(serif, "mt-4 block text-[clamp(2.8rem,6.2vw,6.8rem)] leading-[0.95] font-light")}
          />
        </Reveal>
        <Reveal delay={0.1} className="md:col-span-4 md:col-start-9">
          <EText
            path={["categories", "#photography", "description"]}
            value={category.description}
            as="p"
            multiline
            className="text-base leading-relaxed text-neutral-400"
          />
          <Link
            href={pagePath(lang, "photography")}
            className="group mt-6 inline-flex min-h-11 items-center gap-3 border-b border-white/25 pb-1 text-[13px] tracking-[0.16em] text-neutral-100 uppercase transition-colors hover:border-white"
          >
            <Txt k="photography.all" />
            <LuArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </Reveal>
      </div>
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <RedLine className="mt-10 md:mt-12" />
      </div>

      {/* Phones: swipe. Desktop: scroll-linked drift. */}
      <div className="mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-pl-5 px-5 pb-2 [scrollbar-width:none] md:hidden">
        {strip}
        <EAdd kind="photo" listPath={["photos"]} preset={{ group: "portfolio" }} variant="tile" className="h-[52svh] w-48 shrink-0" />
      </div>
      <motion.div style={{ x }} className="mt-14 hidden w-max gap-8 pl-10 md:flex">
        {strip}
        <EAdd kind="photo" listPath={["photos"]} preset={{ group: "portfolio" }} variant="tile" className="h-[58vh] w-64 shrink-0" />
      </motion.div>
    </section>
  );
}
