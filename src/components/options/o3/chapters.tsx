"use client";

import { LuArrowRight } from "react-icons/lu";

import { cn } from "@/lib/utils";
import { Reveal } from "@/components/motion/reveal";
import { categories, videosIn, type Category } from "@/data/site";
import { Eyebrow, FilmCard, RedLine, serif } from "./shared";

const NUMERALS = ["I", "II", "III", "IV"];

export function Chapters() {
  const chapters = categories.filter((c) => c.visibility === "public" && c.slug !== "photography");
  return (
    <div className="border-t border-white/10">
      <header className="mx-auto max-w-[1600px] px-6 pt-28 md:px-10 md:pt-40">
        <Reveal>
          <Eyebrow>The work</Eyebrow>
          <h2 className={cn(serif, "mt-5 max-w-4xl text-[clamp(2.6rem,5vw,5.4rem)] leading-[1.02] font-light")}>
            Three kinds of film. <em className="italic">One standard</em> — the one I learned in broadcast.
          </h2>
        </Reveal>
      </header>
      {chapters.map((c, i) => (
        <Chapter key={c.slug} category={c} index={i} />
      ))}
    </div>
  );
}

function Chapter({ category, index }: { category: Category; index: number }) {
  // "Ice Road" already has the featured section to itself.
  const list = videosIn(category.slug as Exclude<Category["slug"], "photography">).filter((v) => v.id !== "ice-road");
  const lead = list.find((v) => v.featured) ?? list[0];
  const rest = list.filter((v) => v !== lead);
  const flip = index % 2 === 1;

  return (
    <section id={category.slug} className="scroll-mt-20 py-24 md:py-32">
      <div className="mx-auto max-w-[1600px] px-6 md:px-10">
        <div className="grid items-end gap-8 md:grid-cols-12">
          <Reveal className="md:col-span-7">
            <div className="flex items-baseline gap-5">
              <span className={cn(serif, "text-3xl text-[#e5484d] italic")}>{NUMERALS[index]}</span>
              <Eyebrow>{category.tagline}</Eyebrow>
            </div>
            <h3 className={cn(serif, "mt-4 text-[clamp(3rem,6.2vw,6.8rem)] leading-[0.95] font-light")}>
              {category.name}
            </h3>
          </Reveal>
          <Reveal delay={0.1} className="md:col-span-4 md:col-start-9">
            <p className="text-[15px] leading-relaxed text-neutral-400">{category.description}</p>
            <a
              href={`#${category.slug}`}
              className="group mt-6 inline-flex items-center gap-3 border-b border-white/25 pb-1 text-[13px] tracking-[0.18em] text-neutral-100 uppercase transition-colors hover:border-white"
            >
              All {videosIn(category.slug as Exclude<Category["slug"], "photography">).length} films
              <LuArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </Reveal>
        </div>

        <RedLine className="mt-12" />

        <div className="mt-12 grid gap-x-8 gap-y-14 md:grid-cols-12">
          <Reveal className={cn("md:col-span-7", flip && "md:order-2 md:col-start-6")}>
            <FilmCard video={lead} size="lg" />
          </Reveal>
          <div className={cn("grid content-start gap-12 md:col-span-5", flip && "md:order-1")}>
            {rest.slice(0, 2).map((v, i) => (
              <Reveal key={v.id} delay={0.08 * (i + 1)}>
                <FilmCard video={v} />
              </Reveal>
            ))}
          </div>
        </div>

        {rest.length > 2 ? (
          <div className="mt-16 grid gap-x-8 gap-y-14 border-t border-white/10 pt-14 sm:grid-cols-2 lg:grid-cols-3">
            {rest.slice(2, 5).map((v, i) => (
              <Reveal key={v.id} delay={0.06 * i}>
                <FilmCard video={v} />
              </Reveal>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
