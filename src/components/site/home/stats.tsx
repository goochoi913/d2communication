"use client";

import { cn } from "@/lib/utils";
import { EAdd, EItem, EPlain, EText } from "@/components/content/editable";
import { useSite } from "@/components/content/site-context";
import { CountUp } from "@/components/motion/count-up";
import { Reveal } from "@/components/motion/reveal";
import { tr } from "@/content/format";
import { serif } from "../typography";

/** The numbers: 50+ documentaries, years in broadcasting… */
export function Stats() {
  const { content, lang } = useSite();
  const stats = content.stats;
  const statIds = stats.map((s) => s.id);

  return (
    <section className="relative border-t border-white/10 bg-neutral-950">
      <div className="mx-auto grid max-w-[1600px] grid-cols-2 px-5 md:grid-cols-4 md:px-10">
        {stats.map((s, i) => (
          <EItem key={s.id} kind="stat" listPath={["stats"]} id={s.id} scopeIds={statIds} label={tr(s.label, lang) || s.value}>
            <Reveal
              delay={i * 0.08}
              className={cn(
                "h-full border-white/10 py-12 md:px-8 md:py-20",
                i > 0 && "md:border-l",
                i % 2 === 1 && "border-l pl-5 md:pl-8",
                i >= 2 && "border-t md:border-t-0",
              )}
            >
              <EPlain
                path={["stats", `#${s.id}`, "value"]}
                value={s.value}
                className={cn(serif, "block text-[clamp(3.2rem,6vw,6.2rem)] leading-none font-light tabular-nums")}
              >
                {(v) => <CountUp value={v} />}
              </EPlain>
              <EText
                path={["stats", `#${s.id}`, "label"]}
                value={s.label}
                as="p"
                className="mt-4 text-xs leading-relaxed tracking-[0.22em] text-neutral-400 uppercase md:text-[13px]"
              />
            </Reveal>
          </EItem>
        ))}
        <EAdd kind="stat" listPath={["stats"]} variant="tile" className="col-span-2 my-6 md:col-span-4" />
      </div>
    </section>
  );
}
