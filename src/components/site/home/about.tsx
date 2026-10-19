"use client";

import { useRef } from "react";
import { useScroll } from "motion/react";

import { cn } from "@/lib/utils";
import { tr } from "@/content/format";
import { D2LogoScroll } from "@/components/brand/d2-logo-animated";
import { EAdd, EImage, EItem, EText, Txt } from "@/components/content/editable";
import { useSite } from "@/components/content/site-context";
import { ColorReveal, revealMedia } from "@/components/media/color-reveal";
import { Picture } from "@/components/media/picture";
import { Reveal } from "@/components/motion/reveal";
import { useReducedMotionSafe } from "@/components/motion/use-reduced-motion-safe";
import { D2Mark } from "@/components/brand/d2-mark";
import { RedLine, serif } from "../typography";

/**
 * The company and the man behind it. Opens on the official logo at full scale, its folds
 * assembling as it scrolls into view (the confident logo of Option 2, on Option 3's black),
 * then a portrait, a short paragraph in his voice, and what he does.
 */
export function About() {
  const { content, lang } = useSite();
  const logoRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotionSafe();
  const { scrollYProgress } = useScroll({ target: logoRef, offset: ["start end", "center 60%"] });
  const craftIds = content.crafts.map((c) => c.id);

  return (
    <section id="about" className="scroll-mt-16 border-t border-white/10">
      <div ref={logoRef} className="mx-auto flex max-w-[1600px] flex-col items-center px-5 pt-24 pb-20 md:px-10 md:pt-36 md:pb-28">
        {reduce ? (
          <D2Mark className="h-auto w-[min(62vw,440px)]" />
        ) : (
          <D2LogoScroll progress={scrollYProgress} effect="assemble" className="h-auto w-[min(62vw,440px)]" />
        )}
        <p className="mt-10 text-xs tracking-[0.5em] text-neutral-400 uppercase md:mt-12 md:text-[13px]">D2 Communication</p>
      </div>

      <div className="mx-auto grid max-w-[1600px] gap-12 px-5 pb-24 md:grid-cols-12 md:gap-8 md:px-10 md:pb-36">
        <Reveal className="md:col-span-5">
          <EImage path={["images", "about"]} image={content.images.about} slot="portrait">
            <ColorReveal>
              <Picture
                image={content.images.about}
                alt={tr(content.text["person.name"], lang)}
                sizes="(min-width: 768px) 40vw, 100vw"
                className="aspect-[4/5]"
                imgClassName={revealMedia}
              />
            </ColorReveal>
          </EImage>
        </Reveal>
        <Reveal delay={0.1} className="flex flex-col justify-end md:col-span-6 md:col-start-7">
          <Txt k="about.eyebrow" as="p" className="text-xs font-medium tracking-[0.28em] text-neutral-400 uppercase" />
          <Txt
            k="about.title"
            as="h2"
            rich
            multiline
            className={cn(serif, "mt-5 text-[clamp(2.2rem,4.2vw,4.4rem)] leading-[1.04] font-light")}
          />
          <Txt k="about.body" as="p" multiline className="mt-8 max-w-xl text-[17px] leading-relaxed text-neutral-300" />
          <RedLine className="mt-12" />
          <Txt k="about.crafts" as="p" className="mt-8 text-xs font-medium tracking-[0.28em] text-neutral-500 uppercase" />
          <ul className="mt-4 flex flex-wrap gap-x-7 gap-y-2">
            {content.crafts.map((craft) => (
              <li key={craft.id}>
                <EItem kind="craft" listPath={["crafts"]} id={craft.id} scopeIds={craftIds} label={tr(craft.label, lang)}>
                  <EText
                    path={["crafts", `#${craft.id}`, "label"]}
                    value={craft.label}
                    className={cn(serif, "text-[1.7rem] leading-snug font-light text-neutral-100")}
                  />
                </EItem>
              </li>
            ))}
            <li>
              <EAdd kind="craft" listPath={["crafts"]} variant="inline" />
            </li>
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
