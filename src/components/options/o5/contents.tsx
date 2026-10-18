"use client";

import { LuArrowDownRight } from "react-icons/lu";

import { cn } from "@/lib/utils";
import { Reveal } from "@/components/motion/reveal";
import { publicCategories, videos, videosIn } from "@/data/site";
import { DoubleRule, Kicker, Label, ROMAN, frame, serif } from "./shared";
import { plates } from "./stills";

/** "In this issue": the four sections, read like a magazine's contents page. */
export function Contents() {
  return (
    <section aria-labelledby="contents-title" className={cn(frame, "mt-24 md:mt-28")}>
      <DoubleRule />
      <div className="flex flex-wrap items-baseline justify-between gap-4 py-4">
        <h2 id="contents-title">
          <Kicker>In this issue</Kicker>
        </h2>
        <Label>
          {publicCategories.length} sections · {videos.length} films · {plates.length} plates
        </Label>
      </div>
      <ol className="grid border-t border-(--o5-rule) sm:grid-cols-2 lg:grid-cols-4">
        {publicCategories.map((c, i) => {
          const count = c.slug === "photography" ? null : videosIn(c.slug).length;
          return (
            <li
              key={c.slug}
              className={cn(
                "border-(--o5-rule)",
                i > 0 && "border-t sm:border-t-0",
                i % 2 === 1 && "sm:border-l",
                i >= 2 && "sm:border-t lg:border-t-0",
                i === 2 && "lg:border-l",
              )}
            >
              <Reveal delay={i * 0.08} y={16} className="h-full">
                <a
                  href={`#${c.slug}`}
                  className={cn(
                    "group flex h-full flex-col py-7 sm:px-7 lg:min-h-[17rem]",
                    i === 0 && "sm:pl-0",
                    i === 2 && "sm:pl-0 lg:pl-7",
                    i === publicCategories.length - 1 && "lg:pr-0",
                  )}
                >
                  <span className="flex items-start justify-between">
                    <span className="flex items-baseline gap-2.5">
                      <span
                        className={cn(
                          serif,
                          "text-[4.2rem] leading-[0.8] font-light tracking-[-0.03em] text-(--o5-ink) tabular-nums",
                        )}
                      >
                        {String(count ?? plates.length).padStart(2, "0")}
                      </span>
                      <span className="text-[11px] font-medium tracking-[0.14em] text-(--o5-muted) uppercase">
                        {count ? "films" : "plates"}
                      </span>
                    </span>
                    <LuArrowDownRight className="size-5 text-(--o5-muted) transition-all duration-300 group-hover:translate-x-0.5 group-hover:translate-y-0.5 group-hover:text-(--o5-red)" />
                  </span>
                  <span className="mt-7 text-[11px] font-semibold tracking-[0.16em] text-(--o5-red) uppercase">
                    Section {ROMAN[i]}
                  </span>
                  <span
                    className={cn(
                      serif,
                      "mt-1.5 text-[1.75rem] leading-[1.1] font-medium tracking-[-0.01em] decoration-1 underline-offset-[6px] group-hover:underline",
                    )}
                  >
                    {c.name}
                  </span>
                  <span className={cn(serif, "mt-2.5 text-[1.05rem] leading-snug text-(--o5-ink)/70 italic")}>
                    {c.tagline}
                  </span>
                  <span className="mt-auto pt-6 text-[11px] leading-relaxed font-medium tracking-[0.14em] text-(--o5-muted) uppercase">
                    {c.subGenres.join(" · ")}
                  </span>
                </a>
              </Reveal>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
