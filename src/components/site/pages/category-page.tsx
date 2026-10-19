"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { LuArrowRight } from "react-icons/lu";

import { cn } from "@/lib/utils";
import { tr, withUnit } from "@/content/format";
import type { FilmCategory } from "@/content/schema";
import { categoryBySlug, navCategories, pagePath, worksIn } from "@/content/select";
import { EImage, EText, Txt } from "@/components/content/editable";
import { useSite } from "@/components/content/site-context";
import { Picture } from "@/components/media/picture";
import { CategoryBadge } from "../category-badge";
import { OtherWorks } from "../other-works";
import { EASE, NUMERALS, RED, RedLine, serif } from "../typography";
import { SelectedWorks } from "../works-grid";

export function CategoryPage({ slug }: { slug: FilmCategory }) {
  const { content, lang, editing } = useSite();
  const category = categoryBySlug(content, slug);
  if (category.visibility === "hidden" && !editing) return <Unavailable />;

  const index = content.categories.findIndex((c) => c.slug === slug);
  const selected = worksIn(content, slug, editing, "selected");
  const others = worksIn(content, slug, editing, "other");
  const total = worksIn(content, slug, false).length;

  return (
    <>
      <CategoryHeader slug={slug} index={index}>
        <p className="mt-6 text-[13px] tracking-[0.2em] text-neutral-400 uppercase tabular-nums">
          {withUnit(total, tr(content.text["work.films"], lang), lang)}
        </p>
      </CategoryHeader>

      <section className="mx-auto max-w-[1600px] px-5 pt-16 pb-24 md:px-10 md:pt-24 md:pb-36">
        <Txt k="category.selected" as="p" className="text-xs font-medium tracking-[0.28em] text-neutral-400 uppercase" />
        <RedLine className="mt-5" />
        <SelectedWorks works={selected} category={slug} className="mt-10 md:mt-12" />
        <OtherWorks works={others} category={slug} />
      </section>

      <NextCategory slug={slug} />
    </>
  );
}

/** Full-bleed cover photograph with the category's name; shared with the photography page. */
export function CategoryHeader({ slug, index, children }: { slug: string; index: number; children?: ReactNode }) {
  const { content } = useSite();
  const category = content.categories.find((c) => c.slug === slug)!;

  return (
    <header className="relative flex min-h-[78svh] items-end overflow-hidden md:min-h-[86vh]">
      {category.cover ? (
        <EImage path={["categories", `#${slug}`, "cover"]} image={category.cover} slot="cover" className="absolute inset-0">
          <motion.div
            className="absolute inset-0"
            initial={{ scale: 1.08, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 2.2, ease: EASE }}
          >
            <Picture image={category.cover} alt="" priority sizes="100vw" className="absolute inset-0" imgClassName="grayscale" />
          </motion.div>
        </EImage>
      ) : null}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/55 to-neutral-950/30" />
      <div className="relative mx-auto w-full max-w-[1600px] px-5 pt-32 pb-12 md:px-10 md:pb-16">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, delay: 0.2, ease: EASE }}>
          <div className="flex flex-wrap items-baseline gap-x-5 gap-y-3">
            <span className={cn(serif, "text-3xl italic")} style={{ color: RED }}>
              {NUMERALS[index]}
            </span>
            <EText
              path={["categories", `#${slug}`, "tagline"]}
              value={category.tagline}
              as="p"
              className="text-xs font-medium tracking-[0.28em] text-neutral-300 uppercase"
            />
            <CategoryBadge category={category} />
          </div>
          <EText
            path={["categories", `#${slug}`, "name"]}
            value={category.name}
            as="h1"
            className={cn(serif, "mt-5 block text-[clamp(3.2rem,9vw,9.5rem)] leading-[0.92] font-light")}
          />
          <EText
            path={["categories", `#${slug}`, "description"]}
            value={category.description}
            as="p"
            multiline
            className="mt-7 max-w-2xl text-[17px] leading-relaxed text-neutral-300"
          />
          {children}
        </motion.div>
      </div>
    </header>
  );
}

/** The next category, as a large link at the foot of the page. */
export function NextCategory({ slug }: { slug: string }) {
  const { content, lang, editing } = useSite();
  const list = navCategories(content, editing);
  const i = list.findIndex((c) => c.slug === slug);
  const next = list[(i + 1) % list.length];
  if (!next || next.slug === slug) return null;

  return (
    <section className="border-t border-white/10">
      <Link href={pagePath(lang, next.slug)} className="group mx-auto block max-w-[1600px] px-5 py-20 md:px-10 md:py-28">
        <Txt k="category.next" as="p" className="text-xs font-medium tracking-[0.28em] text-neutral-400 uppercase" />
        <span className="mt-5 flex items-end justify-between gap-6">
          <span className={cn(serif, "text-[clamp(2.6rem,7vw,7rem)] leading-[0.95] font-light transition-colors group-hover:text-white")}>
            {tr(next.name, lang)}
          </span>
          <LuArrowRight className="mb-3 size-8 shrink-0 transition-transform duration-500 group-hover:translate-x-2 md:size-12" />
        </span>
      </Link>
    </section>
  );
}

export function Unavailable() {
  const { lang } = useSite();
  return (
    <section className="grid min-h-[70svh] place-items-center px-5 pt-24 text-center">
      <div>
        <Txt k="category.unavailable" as="p" className={cn(serif, "text-[clamp(2rem,4vw,3.4rem)] font-light")} />
        <Link
          href={pagePath(lang)}
          className="mt-8 inline-flex min-h-11 items-center gap-2 border-b border-white/25 pb-1 text-[13px] tracking-[0.16em] text-neutral-200 uppercase hover:border-white"
        >
          <Txt k="nav.home" />
          <LuArrowRight className="size-4" />
        </Link>
      </div>
    </section>
  );
}
