"use client";

import { cn } from "@/lib/utils";
import { CountUp } from "@/components/motion/count-up";
import { Reveal } from "@/components/motion/reveal";
import { company, copy, services, stats } from "@/data/site";
import { DoubleRule, Kicker, Label, frame, serif } from "./shared";

/** Who we are: a short essay with a drop cap, the headline figure set in the margin. */
export function Profile() {
  const [lead, ...others] = stats;
  return (
    <section id="about" aria-labelledby="profile-title" className={cn(frame, "mt-28 scroll-mt-20 md:mt-36")}>
      <DoubleRule />
      <div className="grid gap-6 pt-6 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-3">
          <Kicker>Profile</Kicker>
          <p className="mt-2 text-[11px] font-medium tracking-[0.14em] text-(--o5-muted) uppercase">Who we are</p>
        </div>
        <Reveal className="lg:col-span-9">
          <h2
            id="profile-title"
            className={cn(serif, "text-[clamp(2.6rem,4.6vw,4.6rem)] leading-[1] font-normal tracking-[-0.025em] text-balance")}
          >
            One director, <em className="font-light italic">every craft</em> — from the first idea to the final grade.
          </h2>
        </Reveal>
      </div>

      <div className="mt-14 grid gap-12 lg:grid-cols-12 lg:gap-8">
        {/* The marginal figure */}
        <Reveal className="lg:col-span-3">
          <div className="border-t border-(--o5-ink) pt-4">
            <CountUp
              value={lead.value}
              suffix={lead.suffix}
              className={cn(
                serif,
                "block text-[clamp(6.5rem,10vw,10rem)] leading-[0.78] font-light tracking-[-0.05em] tabular-nums",
              )}
            />
            <p className={cn(serif, "mt-5 max-w-[14rem] text-[1.2rem] leading-snug italic")}>
              {lead.label.toLowerCase()} written, directed and produced
            </p>
          </div>
          <dl className="mt-10 border-t border-(--o5-rule)">
            {others.map((s) => (
              <div key={s.label} className="flex items-baseline justify-between gap-4 border-b border-(--o5-rule) py-3.5">
                <dt className="text-[11px] font-medium tracking-[0.14em] text-(--o5-muted) uppercase">{s.label}</dt>
                <dd className={cn(serif, "text-[1.6rem] leading-none font-normal tabular-nums")}>
                  <CountUp value={s.value} suffix={s.suffix} />
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>

        {/* The essay */}
        <Reveal delay={0.08} className="lg:col-span-6">
          <div
            className={cn(
              serif,
              "gap-8 text-[1.15rem] leading-[1.62] text-(--o5-ink)/90 md:columns-2 [&>p+p]:indent-7",
              "first-letter:float-left first-letter:mt-[0.06em] first-letter:mr-2.5 first-letter:text-[4.4em] first-letter:leading-[0.8] first-letter:font-medium first-letter:text-(--o5-ink)",
            )}
          >
            <p>{copy.intro}</p>
            <p>{copy.about}</p>
            <p>
              Each commission is led by {company.founder.name} himself, from treatment and budget to the final master:
              one point of contact, and one standard throughout.
            </p>
          </div>
          <div className="mt-10 grid gap-x-8 gap-y-6 border-t border-(--o5-rule) pt-6 sm:grid-cols-2">
            {services.map((s, i) => (
              <div key={s.key} className="flex gap-4">
                <span className={cn(serif, "text-[1.05rem] text-(--o5-red) italic tabular-nums")}>{i + 1}.</span>
                <div>
                  <p className="text-[11px] font-semibold tracking-[0.14em] uppercase">{s.title}</p>
                  <p className="mt-1.5 text-[14px] leading-relaxed text-(--o5-muted)">{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        {/* The pull quote */}
        <Reveal delay={0.16} className="lg:col-span-3">
          <figure className="border-t-[3px] border-(--o5-red) pt-6">
            <blockquote className={cn(serif, "text-[1.75rem] leading-[1.22] font-light tracking-[-0.01em] italic")}>
              <span aria-hidden className="mr-0.5 text-(--o5-red)">
                &ldquo;
              </span>
              {copy.quote.text}
              <span aria-hidden className="text-(--o5-red)">
                &rdquo;
              </span>
            </blockquote>
            <figcaption className="mt-6">
              <Label className="text-(--o5-ink)">{copy.quote.by}</Label>
              <p className="mt-1 text-[12px] text-(--o5-muted)">
                {company.founder.role} · <span lang="ko">{company.founder.nameKo}</span>
              </p>
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
