"use client";

import { cn } from "@/lib/utils";
import { tr } from "@/content/format";
import { EAdd, EItem, Txt, useVisible } from "@/components/content/editable";
import { useSite } from "@/components/content/site-context";
import { Reveal } from "@/components/motion/reveal";
import { PartnerMark } from "../partner-mark";
import { serif } from "../typography";

/** Broadcasters and institutions, as a quiet wall of monochrome logos. */
export function Partners() {
  const { content, lang, bridge } = useSite();
  const partners = useVisible(content.partners);
  if (!partners.length && !bridge?.editing) return null;
  const ids = partners.map((p) => p.id);

  return (
    <section className="border-t border-white/10 py-24 md:py-36">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <Reveal className="text-center">
          <Txt k="partners.eyebrow" as="p" className="text-xs font-medium tracking-[0.28em] text-neutral-400 uppercase" />
          <Txt
            k="partners.title"
            as="h2"
            multiline
            rich
            className={cn(serif, "mx-auto mt-5 max-w-3xl text-[clamp(1.9rem,3.4vw,3.2rem)] leading-[1.1] font-light")}
          />
        </Reveal>
        <Reveal delay={0.1}>
          <ul className="mx-auto mt-14 flex max-w-5xl flex-wrap items-center justify-center gap-x-4 gap-y-8 md:mt-20 md:gap-x-10 md:gap-y-12">
            {partners.map((p) => (
              <li key={p.id} className="flex w-[calc(50%-0.5rem)] justify-center sm:w-44 md:w-52">
                <EItem
                  kind="partner"
                  listPath={["partners"]}
                  id={p.id}
                  scopeIds={ids}
                  label={tr(p.name, lang)}
                  onEdit={() => bridge?.openPanel({ kind: "partner", id: p.id })}
                >
                  <button
                    type="button"
                    tabIndex={bridge?.editing ? 0 : -1}
                    onClick={() => bridge?.editing && bridge.openPanel({ kind: "partner", id: p.id })}
                    className={cn(
                      "group/partner grid h-20 min-w-32 place-items-center px-3",
                      bridge?.editing ? "cursor-pointer" : "cursor-default",
                    )}
                    title={tr(p.name, lang)}
                  >
                    <PartnerMark partner={p} lang={lang} height={36} interactive className="max-h-[4.5rem]" />
                  </button>
                </EItem>
              </li>
            ))}
            <li className="flex w-44 justify-center empty:hidden md:w-52">
              <EAdd kind="partner" listPath={["partners"]} variant="tile" className="h-20 w-40" />
            </li>
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
