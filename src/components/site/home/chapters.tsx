"use client";

import Link from "next/link";
import { LuArrowRight } from "react-icons/lu";

import { cn } from "@/lib/utils";
import { tr, withUnit } from "@/content/format";
import type { Category, FilmCategory } from "@/content/schema";
import { featuredWork, navCategories, pagePath, worksIn } from "@/content/select";
import { EText, Txt } from "@/components/content/editable";
import { useSite } from "@/components/content/site-context";
import { Reveal } from "@/components/motion/reveal";
import { CategoryBadge } from "../category-badge";
import { NUMERALS, RED, RedLine, serif } from "../typography";
import { SelectedWorks } from "../works-grid";

/** "The work": one chapter per film category, each with its selected works and a link to the full list. */
export function Chapters() {
  const { content, editing } = useSite();
  const chapters = navCategories(content, editing).filter((c) => c.slug !== "photography");

  return (
    <div className="border-t border-white/10">
      <header className="mx-auto max-w-[1600px] px-5 pt-24 md:px-10 md:pt-40">
        <Reveal>
          <Txt k="work.eyebrow" as="p" className="text-xs font-medium tracking-[0.28em] text-neutral-400 uppercase" />
          <Txt
            k="work.title"
            as="h2"
            rich
            multiline
            className={cn(serif, "mt-5 max-w-4xl text-[clamp(2.4rem,5vw,5.4rem)] leading-[1.03] font-light")}
          />
        </Reveal>
      </header>
      {chapters.map((c, i) => (
        <Chapter key={c.slug} category={c} index={i} />
      ))}
    </div>
  );
}

function Chapter({ category, index }: { category: Category; index: number }) {
  const { content, lang, editing } = useSite();
  const slug = category.slug as FilmCategory;
  const featuredId = featuredWork(content)?.id;
  // The featured film already has the big block above, so the chapter starts with the next one.
  const selected = worksIn(content, slug, editing, "selected").filter((w) => w.id !== featuredId);
  const total = worksIn(content, slug, false).length;
  const flip = index % 2 === 1;

  return (
    <section id={slug} className="scroll-mt-20 py-20 md:py-32">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <div className="grid items-end gap-6 md:grid-cols-12 md:gap-8">
          <Reveal className="md:col-span-7">
            <div className="flex items-baseline gap-5">
              <span className={cn(serif, "text-3xl italic")} style={{ color: RED }}>
                {NUMERALS[index]}
              </span>
              <EText
                path={["categories", `#${slug}`, "tagline"]}
                value={category.tagline}
                as="p"
                className="text-xs font-medium tracking-[0.28em] text-neutral-400 uppercase"
              />
              <CategoryBadge category={category} />
            </div>
            <EText
              path={["categories", `#${slug}`, "name"]}
              value={category.name}
              as="h3"
              className={cn(serif, "mt-4 block text-[clamp(2.8rem,6.2vw,6.8rem)] leading-[0.95] font-light")}
            />
          </Reveal>
          <Reveal delay={0.1} className="md:col-span-4 md:col-start-9">
            <EText
              path={["categories", `#${slug}`, "description"]}
              value={category.description}
              as="p"
              multiline
              className="text-base leading-relaxed text-neutral-400"
            />
            <Link
              href={pagePath(lang, slug)}
              className="group mt-6 inline-flex min-h-11 items-center gap-3 border-b border-white/25 pb-1 text-[13px] tracking-[0.16em] text-neutral-100 uppercase transition-colors hover:border-white"
            >
              <Txt k="work.all" />
              <span className="text-neutral-500 tabular-nums">· {withUnit(total, tr(content.text["work.films"], lang), lang)}</span>
              <LuArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>

        <RedLine className="mt-10 md:mt-12" />

        <SelectedWorks works={selected} category={slug} flip={flip} className="mt-10 md:mt-12" />
      </div>
    </section>
  );
}
