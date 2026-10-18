"use client";

import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { CountUp } from "@/components/motion/count-up";
import { company, copy, stats } from "@/data/site";
import { Label, Reveal, cond } from "./shared";

const craftsSentence = copy.crafts
  .map((c, i) => (i === 0 || c === "VFX" ? c : c.toLowerCase()))
  .join(", ")
  .replace(/, ([^,]*)$/, " and $1");

/** Who we are, in one sentence and one slate — the information printed on a clapperboard. */
export function Slate() {
  const films = stats[0];
  const fields: { label: string; value: ReactNode }[] = [
    { label: "Production", value: company.name },
    { label: "Director / Producer", value: company.founder.name },
    {
      label: films.label,
      value: <CountUp value={films.value} suffix={films.suffix} className="tabular-nums" />,
    },
    { label: "Subjects", value: "History · Science · Technology" },
    { label: "Also", value: "Brand films · Performance" },
    { label: "Based", value: company.location.split(",")[0] },
  ];

  return (
    <section className="relative bg-black pt-32 pb-8" aria-label="About D2 Communication">
      <div className="mx-auto max-w-[1760px] px-6 md:px-12">
        <Reveal>
          <Label>Who we are</Label>
          <p
            className={cn(
              cond,
              "mt-8 max-w-[68rem] text-[clamp(2rem,3.3vw,3.6rem)] leading-[1.08] font-normal text-[#9a9a9a]",
            )}
          >
            <span className="text-[#f2f2f2]">{company.name}</span> is the production company of director and producer{" "}
            <span className="text-[#f2f2f2]">{company.founder.name}</span> — more than{" "}
            <span className="text-[#f2f2f2]">fifty documentaries and films</span> for national broadcasters, for
            companies, and for the stage. {craftsSentence}, all under one roof.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <dl className="mt-20 grid grid-cols-2 border-y border-white/15 md:grid-cols-3 xl:grid-cols-[1.05fr_1.05fr_1.05fr_1.4fr_1.2fr_0.65fr]">
            {fields.map((f, i) => (
              <div
                key={f.label}
                className={cn(
                  "border-white/15 py-7 pr-6",
                  i > 0 && "xl:border-l xl:pl-6",
                  i % 2 === 1 && "border-l pl-6 md:border-l-0 md:pl-0 xl:border-l xl:pl-6",
                )}
              >
                <dt>
                  <Label className="text-[10px] text-[#6f6f6f]">{f.label}</Label>
                </dt>
                <dd
                  className={cn(
                    cond,
                    "mt-4 text-[clamp(1.35rem,1.7vw,1.9rem)] leading-none font-semibold tracking-[0.04em] text-[#ededed] uppercase",
                  )}
                >
                  {f.value}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
