"use client";

import { useMemo, useState } from "react";
import { LuChevronDown } from "react-icons/lu";

import { cn } from "@/lib/utils";
import { tr } from "@/content/format";
import type { Work } from "@/content/schema";
import { EAdd, Txt, useText } from "@/components/content/editable";
import { useSite } from "@/components/content/site-context";
import { WorkCard } from "./work-card";
import { serif } from "./typography";

const COLLAPSED = 8;

/**
 * Everything beyond the selected works, kept compact so a category can grow to dozens of
 * films without crowding the page: small cards, a filter by genre, and a "Show all".
 */
export function OtherWorks({ works, category }: { works: Work[]; category: Work["category"] }) {
  const { lang, editing } = useSite();
  const t = useText();
  const [genre, setGenre] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);

  const genres = useMemo(() => {
    const names = new Set(works.map((w) => tr(w.subGenre, lang)).filter(Boolean));
    return [...names];
  }, [works, lang]);

  if (!works.length && !editing) return null;

  const filtered = genre ? works.filter((w) => tr(w.subGenre, lang) === genre) : works;
  const showAll = expanded || editing || filtered.length <= COLLAPSED;
  const shown = showAll ? filtered : filtered.slice(0, COLLAPSED);
  const ids = filtered.map((w) => w.id);

  return (
    <section className="mt-24 border-t border-white/10 pt-12 md:mt-32">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <h3 className={cn(serif, "flex items-baseline gap-4 text-[clamp(2rem,3.4vw,3rem)] leading-none font-light")}>
          <Txt k="work.other" />
          <span className="font-sans text-sm tracking-[0.2em] text-neutral-500 tabular-nums">{works.length}</span>
        </h3>
        {genres.length > 1 ? (
          <div className="-mx-1 flex max-w-full gap-1.5 overflow-x-auto px-1 pb-1 [scrollbar-width:none]">
            {[null, ...genres].map((g) => (
              <button
                key={g ?? "all"}
                type="button"
                onClick={() => setGenre(g)}
                aria-pressed={genre === g}
                className={cn(
                  "h-10 shrink-0 rounded-full border px-4 text-[13px] whitespace-nowrap transition-colors",
                  genre === g
                    ? "border-white bg-white text-neutral-950"
                    : "border-white/15 text-neutral-300 hover:border-white/40 hover:text-white",
                )}
              >
                {g ?? t("work.filterAll")}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-4">
        {shown.map((w) => (
          <WorkCard key={w.id} work={w} variant="compact" scopeIds={ids} />
        ))}
        <EAdd kind="work" listPath={["works"]} preset={{ category, placement: "other" }} variant="tile" />
      </div>

      {!showAll || (expanded && filtered.length > COLLAPSED) ? (
        <div className="mt-12 flex justify-center">
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="inline-flex h-12 items-center gap-2.5 rounded-full border border-white/20 px-6 text-[13px] tracking-[0.14em] text-neutral-200 uppercase transition-colors hover:border-white hover:text-white"
          >
            {expanded ? t("work.showLess") : `${t("work.showAll")} · ${filtered.length}`}
            <LuChevronDown className={cn("size-4 transition-transform", expanded && "rotate-180")} />
          </button>
        </div>
      ) : null}
    </section>
  );
}
