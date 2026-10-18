"use client";

import { LuArrowDownRight } from "react-icons/lu";

import { cn } from "@/lib/utils";
import { Still } from "@/components/media/still";
import { Reveal } from "@/components/motion/reveal";
import { publicCategories, videosIn, type Category } from "@/data/site";
import { Label, Rise, container, foldBlock, redBlock, wide } from "./shared";

export function Categories() {
  return (
    <section id="work" className="scroll-mt-20 pb-28 md:pb-36">
      <div className={container}>
        <div className="mb-14 grid grid-cols-12 items-end gap-6">
          <div className="col-span-12 md:col-span-8">
            <Label>The work</Label>
            <h2 className={cn(wide, "mt-6 text-[clamp(2.2rem,4vw,4.2rem)] leading-[0.9] font-black tracking-[-0.01em] uppercase")}>
              <Rise>Four kinds of film.</Rise>
              <Rise delay={0.08}>One standard.</Rise>
            </h2>
          </div>
          <Reveal className="col-span-12 md:col-span-4" delay={0.1}>
            <p className="text-[15px] leading-relaxed text-neutral-600">
              Documentaries for national broadcasters, films for companies and institutions, and the stage recorded
              with broadcast discipline — each with its own body of work.
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {publicCategories.map((c, i) => (
            <Reveal key={c.slug} delay={i * 0.08}>
              <CategoryTile category={c} index={i} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function CategoryTile({ category, index }: { category: Category; index: number }) {
  const summary = category.slug === "photography" ? "Stills & series" : `${videosIn(category.slug).length} films`;
  const right = index % 2 === 1;

  return (
    <a href={`#${category.slug}`} className="group block">
      <div className="relative">
        <div style={redBlock} className="flex h-24 flex-col justify-between px-5 py-4 text-white">
          <span className="text-[11px] font-semibold tracking-[0.24em] text-white/75 tabular-nums">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className={cn(wide, "text-[clamp(14px,1.25vw,19px)] leading-none font-extrabold whitespace-nowrap uppercase")}>
            {category.name}
          </span>
        </div>
        <div className="relative aspect-[4/5] overflow-hidden bg-neutral-200">
          <Still
            src={category.cover}
            alt={category.title}
            sizes="(min-width: 1024px) 25vw, 50vw"
            className="size-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
          />
        </div>
        {/* The grey tab hangs below like the logo's tails, and unfolds downwards on hover. */}
        <div
          style={foldBlock(22)}
          className={cn(
            "absolute top-full z-10 h-16 w-[74%] overflow-hidden transition-[height] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:h-56 group-focus-visible:h-56",
            right ? "right-0 rounded-br-[30px]" : "left-0",
          )}
        >
          <div className="flex h-16 items-center justify-between px-5 pt-1">
            <span className="text-[11px] font-bold tracking-[0.2em] uppercase tabular-nums">{summary}</span>
            <LuArrowDownRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
          </div>
          <ul className="space-y-2 px-5 pb-6 text-[13px] text-neutral-900">
            {category.subGenres.map((g) => (
              <li key={g} className="flex items-center gap-2.5">
                <span aria-hidden className="size-1.5 bg-neutral-900" />
                {g}
              </li>
            ))}
          </ul>
        </div>
      </div>
      {/* Clears the folded tab; the unfolded tab lies over this line only while hovered. The full
          one-sentence description leads the category's own section below. */}
      <p className="mt-16 pt-5 pr-2 text-[15px] leading-snug font-medium text-neutral-900">{category.tagline}.</p>
    </a>
  );
}
