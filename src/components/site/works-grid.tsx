"use client";

import { cn } from "@/lib/utils";
import type { Work } from "@/content/schema";
import { EAdd } from "@/components/content/editable";
import { Reveal } from "@/components/motion/reveal";
import { WorkCard } from "./work-card";

/**
 * The 5–6 works shown up front in a category. The first is the lead, set larger; the
 * next two stack beside it and the rest follow in rows of three. Any count lays out
 * cleanly, so adding or removing a work can't break the page. `flip` mirrors the layout.
 */
export function SelectedWorks({
  works,
  category,
  flip = false,
  className,
}: {
  works: Work[];
  category: Work["category"];
  flip?: boolean;
  className?: string;
}) {
  const ids = works.map((w) => w.id);
  const [lead, ...rest] = works;
  const side = rest.slice(0, 2);
  const below = rest.slice(2);
  const add = (
    <EAdd
      kind="work"
      listPath={["works"]}
      preset={{ category, placement: "selected" }}
      afterId={works.at(-1)?.id}
      variant="tile"
    />
  );

  if (!lead) return <div className={className}>{add}</div>;

  return (
    <div className={className}>
      <div className="grid gap-x-8 gap-y-14 md:grid-cols-12">
        <Reveal className={cn(side.length ? "md:col-span-8" : "md:col-span-12", flip && side.length && "md:order-2")}>
          <WorkCard work={lead} variant="lead" scopeIds={ids} />
        </Reveal>
        {side.length ? (
          <div className={cn("grid content-start gap-12 md:col-span-4", flip && "md:order-1")}>
            {side.map((w, i) => (
              <Reveal key={w.id} delay={0.08 * (i + 1)}>
                <WorkCard work={w} scopeIds={ids} />
              </Reveal>
            ))}
          </div>
        ) : null}
      </div>
      {below.length ? (
        <div
          className={cn(
            "mt-14 grid gap-x-8 gap-y-14 border-t border-white/10 pt-14",
            below.length === 1 ? "md:grid-cols-2" : below.length === 2 ? "md:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3",
          )}
        >
          {below.map((w, i) => (
            <Reveal key={w.id} delay={0.06 * (i % 3)}>
              <WorkCard work={w} scopeIds={ids} />
            </Reveal>
          ))}
        </div>
      ) : null}
      <div className="mt-10 empty:hidden">{add}</div>
    </div>
  );
}
