"use client";

import { LuArrowUpRight } from "react-icons/lu";
import { FaYoutube } from "react-icons/fa6";

import { cn } from "@/lib/utils";
import { D2Mark } from "@/components/brand/d2-mark";
import { Reveal } from "@/components/motion/reveal";
import { company, publicCategories } from "@/data/site";
import { DoubleRule, Kicker, Label, frame, serif } from "./shared";

/** Commissions, correspondence and the colophon. */
export function Colophon() {
  return (
    <footer id="contact" aria-labelledby="contact-title" className={cn(frame, "mt-32 scroll-mt-14 md:mt-40")}>
      <DoubleRule />
      <div className="grid gap-12 pt-8 pb-16 lg:grid-cols-12 lg:gap-8 lg:pb-24">
        <Reveal className="lg:col-span-7">
          <Kicker>Commissions &amp; correspondence</Kicker>
          <h2
            id="contact-title"
            className={cn(serif, "mt-4 text-[clamp(3.2rem,6.4vw,6.6rem)] leading-[0.92] font-normal tracking-[-0.03em]")}
          >
            Tell us about <em className="font-light whitespace-nowrap italic">your film.</em>
          </h2>
          <p className={cn(serif, "mt-6 max-w-xl text-[1.3rem] leading-snug text-(--o5-ink)/75 italic")}>
            Documentary, brand film or performance: write to {company.founder.name} directly. Every enquiry gets a
            personal reply within two working days.
          </p>
          <a
            href={`mailto:${company.email}`}
            className={cn(
              serif,
              "group mt-10 inline-flex items-baseline gap-3 text-[clamp(1.7rem,3vw,2.9rem)] leading-none font-medium tracking-[-0.015em]",
            )}
          >
            <span className="border-b-2 border-(--o5-ink) pb-1.5 transition-colors group-hover:border-(--o5-red) group-hover:text-(--o5-red)">
              {company.email}
            </span>
            <LuArrowUpRight className="size-[0.7em] text-(--o5-red) transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
          </a>
        </Reveal>

        <Reveal delay={0.1} className="lg:col-span-4 lg:col-start-9">
          <dl className="border-t border-(--o5-ink)">
            {[
              [
                "Contact",
                <span key="p">
                  {company.founder.name}
                  <span className="block text-[13px] text-(--o5-muted)">{company.founder.role}</span>
                </span>,
              ],
              ["Correspondence", <a key="e" href={`mailto:${company.email}`} className="hover:text-(--o5-red)">{company.email}</a>],
              ["Telephone", <a key="t" href={`tel:${company.phone.replace(/\s/g, "")}`} className="hover:text-(--o5-red)">{company.phone}</a>],
              ["Studio", company.location],
              ["Response", "Replies within two working days"],
              [
                "Films online",
                <a key="y" href={company.youtube} className="inline-flex items-center gap-2 hover:text-(--o5-red)">
                  <FaYoutube className="size-4" /> {company.name} on YouTube
                </a>,
              ],
            ].map(([k, v]) => (
              <div key={k as string} className="grid grid-cols-[9rem_1fr] gap-4 border-b border-(--o5-rule) py-4">
                <dt className="pt-0.5 text-[10.5px] font-semibold tracking-[0.14em] text-(--o5-muted) uppercase">{k}</dt>
                <dd className="text-[15px]">{v}</dd>
              </div>
            ))}
            <div className="grid grid-cols-[9rem_1fr] gap-4 border-b border-(--o5-rule) py-4">
              <dt className="pt-0.5 text-[10.5px] font-semibold tracking-[0.14em] text-(--o5-muted) uppercase">Sections</dt>
              <dd>
                <ul className="space-y-1 text-[15px]">
                  {publicCategories.map((c) => (
                    <li key={c.slug}>
                      <a href={`#${c.slug}`} className="hover:text-(--o5-red)">
                        {c.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          </dl>
        </Reveal>
      </div>

      <div className="grid items-end gap-8 border-t border-(--o5-ink) py-8 lg:grid-cols-12 lg:gap-8">
        <a href="#top" className="flex items-center gap-3 lg:col-span-4" aria-label="D2 Communication, back to top">
          <D2Mark title="" className="h-8 w-auto" />
          <span className={cn(serif, "text-[1.9rem] leading-none font-medium tracking-[-0.02em]")}>{company.name}</span>
        </a>
        <p className="text-[12px] leading-relaxed text-(--o5-muted) lg:col-span-5">
          <Label className="mr-2 text-(--o5-ink)">Colophon</Label>
          The production company of {company.founder.name} (<span lang="ko">{company.founder.nameKo}</span>),{" "}
          {company.founder.role.toLowerCase()}. Set in Newsreader and Inter.
        </p>
        <p className="text-[12px] text-(--o5-muted) lg:col-span-3 lg:text-right">
          © 2026 {company.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
